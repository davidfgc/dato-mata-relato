# ADR-003: Domain Event Structure and Implementation

## Status
Accepted

## Context

Following ADR-001 (Domain Entity Structure) and ADR-002 (Value Object Implementation), we need to establish patterns for domain events to enable decoupled communication between aggregates and manage side effects effectively.

Current challenges:
- Tight coupling between aggregates when one needs to trigger behavior in another
- Side effects (emails, notifications, integrations) mixed with core business logic
- Difficulty maintaining eventual consistency across aggregate boundaries
- No clear audit trail of business events
- Complex React state management for cross-component updates

Requirements:
- Decouple aggregates while maintaining business consistency
- Separate core business logic from side effects
- Enable real-time UI updates in React components
- Provide audit trail for business events
- Support eventual consistency patterns
- Enable integration with external systems

## Decision

We will implement domain events using **immutable event classes** with a centralized event dispatcher pattern:

### 1. Domain Event Base Structure
```typescript
export abstract class DomainEvent {
  public readonly eventId: string;
  public readonly occurredAt: Date;
  public readonly aggregateId: string;
  public readonly eventVersion: number;

  protected constructor(
    aggregateId: string,
    eventVersion: number = 1
  ) {
    this.eventId = crypto.randomUUID();
    this.occurredAt = new Date();
    this.aggregateId = aggregateId;
    this.eventVersion = eventVersion;
  }

  abstract get eventType(): string;
  abstract get eventData(): Record<string, unknown>;
}
```

### 2. Concrete Event Implementation
```typescript
export class UserRegistered extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly email: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly registrationSource: string
  ) {
    super(aggregateId);
  }

  get eventType(): string {
    return 'user.registered';
  }

  get eventData(): Record<string, unknown> {
    return {
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      registrationSource: this.registrationSource
    };
  }
}

export class OrderPlaced extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly customerId: string,
    public readonly items: OrderItem[],
    public readonly totalAmount: Money,
    public readonly shippingAddress: Address
  ) {
    super(aggregateId);
  }

  get eventType(): string {
    return 'order.placed';
  }

  get eventData(): Record<string, unknown> {
    return {
      customerId: this.customerId,
      items: this.items.map(item => item.toObject()),
      totalAmount: this.totalAmount.toString(),
      shippingAddress: this.shippingAddress.toString()
    };
  }
}
```

### 3. Aggregate Event Management
```typescript
export abstract class AggregateRoot {
  private _domainEvents: DomainEvent[] = [];

  protected addEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  getUncommittedEvents(): DomainEvent[] {
    return [...this._domainEvents];
  }

  clearEvents(): void {
    this._domainEvents = [];
  }

  protected removeEvent(event: DomainEvent): void {
    const index = this._domainEvents.indexOf(event);
    if (index !== -1) {
      this._domainEvents.splice(index, 1);
    }
  }
}

// Entity implementation
export class User extends AggregateRoot {
  private constructor(
    private readonly _id: UserId,
    private _email: Email,
    private _profile: UserProfile,
    private _status: UserStatus
  ) {
    super();
  }

  static create(params: {
    email: string;
    firstName: string;
    lastName: string;
    registrationSource: string;
  }): User {
    const user = new User(
      UserId.generate(),
      Email.create(params.email),
      UserProfile.create({
        firstName: params.firstName,
        lastName: params.lastName
      }),
      UserStatus.ACTIVE
    );

    // Emit domain event
    user.addEvent(new UserRegistered(
      user._id.value,
      params.email,
      params.firstName,
      params.lastName,
      params.registrationSource
    ));

    return user;
  }

  changeEmail(newEmail: string): void {
    const oldEmail = this._email.value;
    this._email = Email.create(newEmail);

    this.addEvent(new UserEmailChanged(
      this._id.value,
      oldEmail,
      newEmail
    ));
  }
}
```

### 4. Event Handler Interface
```typescript
export interface EventHandler<T extends DomainEvent> {
  handle(event: T): Promise<void>;
}

export class UserRegisteredHandler implements EventHandler<UserRegistered> {
  constructor(
    private emailService: EmailService,
    private analyticsService: AnalyticsService
  ) {}

  async handle(event: UserRegistered): Promise<void> {
    // Send welcome email
    await this.emailService.sendWelcomeEmail({
      to: event.email,
      firstName: event.firstName
    });

    // Track registration
    await this.analyticsService.trackEvent('user_registered', {
      userId: event.aggregateId,
      source: event.registrationSource
    });

    console.log(`User registered: ${event.email}`);
  }
}
```

### 5. Event Dispatcher
```typescript
export class EventDispatcher {
  private handlers: Map<string, EventHandler<any>[]> = new Map();

  register<T extends DomainEvent>(
    eventType: string,
    handler: EventHandler<T>
  ): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType)!.push(handler);
  }

  async dispatch(event: DomainEvent): Promise<void> {
    const eventHandlers = this.handlers.get(event.eventType) || [];
    
    // Execute handlers in parallel
    const promises = eventHandlers.map(handler => 
      handler.handle(event).catch(error => {
        console.error(`Error handling event ${event.eventType}:`, error);
        // Could implement retry logic or dead letter queue here
      })
    );

    await Promise.allSettled(promises);
  }

  async dispatchAll(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      await this.dispatch(event);
    }
  }
}
```

### 6. React Integration Pattern
```typescript
// React hook for domain events
export function useDomainEvents() {
  const [eventDispatcher] = useState(() => new EventDispatcher());
  
  const publishEvents = useCallback(async (aggregate: AggregateRoot) => {
    const events = aggregate.getUncommittedEvents();
    await eventDispatcher.dispatchAll(events);
    aggregate.clearEvents();
  }, [eventDispatcher]);

  return { publishEvents, eventDispatcher };
}

// Usage in React component
export function UserRegistrationComponent() {
  const { publishEvents } = useDomainEvents();
  
  const handleRegistration = async (formData: RegistrationForm) => {
    try {
      const user = User.create({
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        registrationSource: 'web'
      });
      
      // Save to repository
      await userRepository.save(user);
      
      // Publish domain events
      await publishEvents(user);
      
      // Update UI state
      setRegistrationComplete(true);
    } catch (error) {
      setError(error.message);
    }
  };
}
```

## Consequences

### Positive
- **Decoupling**: Aggregates remain focused on core business logic
- **Scalability**: Easy to add new event handlers without modifying existing code
- **Testability**: Business logic and side effects can be tested independently
- **Audit Trail**: Complete record of business events for compliance and debugging
- **React Integration**: Clean pattern for updating UI state across components
- **Eventual Consistency**: Support for complex business workflows

### Negative
- **Complexity**: Additional abstraction layer to understand and maintain
- **Debugging**: Harder to trace execution flow across event handlers
- **Potential Race Conditions**: Asynchronous event handling can create timing issues
- **Memory Usage**: Events stored in memory until processed

### Neutral
- **Performance**: Minimal overhead for most business applications
- **Learning Curve**: Team needs to understand event-driven patterns

## Implementation Guidelines

### When to Use Domain Events
- **Cross-Aggregate Communication**: When one aggregate needs to trigger behavior in another
- **Side Effects**: Sending emails, notifications, external API calls
- **UI Updates**: Real-time updates across React components
- **Audit Requirements**: When business events need to be tracked
- **Integration**: Synchronizing with external systems

### When NOT to Use Domain Events
- **Simple Value Changes**: Basic property updates without side effects
- **Internal Aggregate Logic**: Operations contained within a single aggregate
- **Technical Events**: Low-level system events (logging, metrics)

## Event Design Principles

### Mandatory
1. Events must be immutable after creation
2. Events must contain all data needed by handlers
3. Event names should be past tense (UserRegistered, OrderPlaced)
4. Events must include aggregate ID and timestamp
5. Handlers must be idempotent (safe to replay)

### Prohibited
1. Events containing references to other aggregates
2. Mutable event data
3. Events triggering synchronous operations that can fail
4. Events with circular dependencies between handlers

## File Organization
```
src/domain/
├── events/
│   ├── base/
│   │   ├── DomainEvent.ts
│   │   ├── AggregateRoot.ts
│   │   └── EventHandler.ts
│   ├── user/
│   │   ├── UserRegistered.ts
│   │   ├── UserEmailChanged.ts
│   │   └── UserDeactivated.ts
│   ├── order/
│   │   ├── OrderPlaced.ts
│   │   ├── OrderShipped.ts
│   │   └── OrderCancelled.ts
│   └── product/
│       ├── ProductCreated.ts
│       └── ProductPriceChanged.ts
├── handlers/
│   ├── UserRegisteredHandler.ts
│   ├── OrderPlacedHandler.ts
│   └── ProductPriceChangedHandler.ts
└── infrastructure/
    └── EventDispatcher.ts
```

## Testing Strategy
- **Unit Tests**: Test event creation and data integrity
- **Handler Tests**: Test individual event handlers in isolation
- **Integration Tests**: Test event flow from aggregate to handlers
- **React Tests**: Test UI updates triggered by events

## Related Decisions
- ADR-001: Domain Entity Structure Pattern
- ADR-002: Value Object Implementation Pattern
- ADR-004: Repository Interface Design (pending)

## Notes
Domain events provide the foundation for building scalable, maintainable applications with clear separation of concerns. They enable complex business workflows while keeping individual aggregates focused on their core responsibilities.

---
**Decision Date**: 2025-07-03  
**Participants**: Development Team, Architecture Team  
**Review Date**: 2025-10-03
