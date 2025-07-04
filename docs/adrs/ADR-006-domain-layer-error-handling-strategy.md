# ADR-006: Domain Layer Error Handling Strategy

## Status
Accepted

## Context

Following ADR-001 through ADR-005, we need to establish a comprehensive error handling strategy for the domain layer. Proper error handling is critical for maintaining business rule integrity, providing clear feedback to users, and enabling robust application behavior.

Current challenges:
- No standardized approach to domain error types and hierarchy
- Business rule violations mixed with technical errors
- Inconsistent error messages and context information
- Difficulty distinguishing between validation errors and business rule violations
- No clear strategy for error recovery and user feedback
- Need for type-safe error handling in TypeScript React applications

Requirements:
- Clear distinction between different types of domain errors
- Meaningful error messages using domain language
- Consistent error structure with machine-readable codes
- Support for error context and debugging information
- Integration with React error boundaries and user feedback
- Type-safe error handling patterns
- Support for both immediate failures and result-based patterns

## Decision

We will implement a **hierarchical domain error system** with specific error types, meaningful contexts, and patterns for both exception-based and result-based error handling:

### 1. Domain Error Base Class
```typescript
export abstract class DomainError extends Error {
  abstract readonly errorCode: string;
  abstract readonly errorType: string;
  public readonly timestamp: Date;
  public readonly errorId: string;

  constructor(
    message: string,
    public readonly context?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.timestamp = new Date();
    this.errorId = crypto.randomUUID();
    
    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  // For logging and debugging
  toLogObject(): Record<string, unknown> {
    return {
      errorId: this.errorId,
      errorType: this.errorType,
      errorCode: this.errorCode,
      message: this.message,
      context: this.context,
      timestamp: this.timestamp.toISOString(),
      stack: this.stack
    };
  }

  // For user-facing error messages
  toUserMessage(): string {
    return this.message;
  }
}
```

### 2. Specific Domain Error Types
```typescript
// Business rule violations
export class BusinessRuleViolationError extends DomainError {
  readonly errorType = 'BUSINESS_RULE_VIOLATION';

  constructor(
    message: string,
    public readonly rule: string,
    context?: Record<string, unknown>
  ) {
    super(message, context);
  }

  get errorCode(): string {
    return `BUSINESS_RULE_${this.rule}`;
  }

  toUserMessage(): string {
    return `Business rule violation: ${this.message}`;
  }
}

// Invalid domain values
export class InvalidDomainValueError extends DomainError {
  readonly errorType = 'INVALID_DOMAIN_VALUE';
  readonly errorCode = 'INVALID_VALUE';

  constructor(
    message: string,
    public readonly field: string,
    public readonly value: unknown,
    context?: Record<string, unknown>
  ) {
    super(message, { ...context, field, value });
  }

  toUserMessage(): string {
    return `Invalid ${this.field}: ${this.message}`;
  }
}

// Aggregate not found
export class AggregateNotFoundError extends DomainError {
  readonly errorType = 'AGGREGATE_NOT_FOUND';
  readonly errorCode = 'NOT_FOUND';

  constructor(
    aggregateType: string,
    id: string,
    context?: Record<string, unknown>
  ) {
    super(`${aggregateType} with id ${id} not found`, { 
      ...context, 
      aggregateType, 
      id 
    });
  }

  toUserMessage(): string {
    const { aggregateType } = this.context!;
    return `The requested ${aggregateType} could not be found.`;
  }
}

// Concurrency conflicts
export class ConcurrencyConflictError extends DomainError {
  readonly errorType = 'CONCURRENCY_CONFLICT';
  readonly errorCode = 'CONFLICT';

  constructor(
    aggregateType: string,
    id: string,
    expectedVersion: number,
    actualVersion: number,
    context?: Record<string, unknown>
  ) {
    super(
      `Concurrency conflict for ${aggregateType} ${id}. Expected version ${expectedVersion}, got ${actualVersion}`,
      { ...context, aggregateType, id, expectedVersion, actualVersion }
    );
  }

  toUserMessage(): string {
    return 'The item has been modified by another user. Please refresh and try again.';
  }
}

// Aggregate invariant violations
export class InvariantViolationError extends DomainError {
  readonly errorType = 'INVARIANT_VIOLATION';

  constructor(
    message: string,
    public readonly invariant: string,
    context?: Record<string, unknown>
  ) {
    super(message, context);
  }

  get errorCode(): string {
    return `INVARIANT_${this.invariant}`;
  }

  toUserMessage(): string {
    return `System constraint violation: ${this.message}`;
  }
}

// Domain service errors
export class DomainServiceError extends DomainError {
  readonly errorType = 'DOMAIN_SERVICE_ERROR';

  constructor(
    message: string,
    public readonly service: string,
    public readonly operation: string,
    context?: Record<string, unknown>
  ) {
    super(message, context);
  }

  get errorCode(): string {
    return `SERVICE_${this.service}_${this.operation}`;
  }
}
```

### 3. Value Object Error Handling
```typescript
export class Email {
  private constructor(private readonly _value: string) {}

  static create(value: string): Email {
    // Null/empty validation
    if (!value || value.trim().length === 0) {
      throw new InvalidDomainValueError(
        'Email address is required',
        'email',
        value
      );
    }

    // Format validation
    if (!this.isValidFormat(value)) {
      throw new InvalidDomainValueError(
        'Email address format is invalid',
        'email',
        value,
        { 
          expectedFormat: 'user@domain.com',
          suggestion: 'Please enter a valid email address'
        }
      );
    }

    // Length validation
    if (value.length > 254) {
      throw new InvalidDomainValueError(
        'Email address is too long',
        'email',
        value,
        { 
          maxLength: 254, 
          actualLength: value.length,
          suggestion: 'Please use a shorter email address'
        }
      );
    }

    return new Email(value.toLowerCase().trim());
  }

  private static isValidFormat(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export class Money {
  static create(amount: number, currencyCode: string): Money {
    if (!Number.isFinite(amount)) {
      throw new InvalidDomainValueError(
        'Amount must be a finite number',
        'amount',
        amount,
        { suggestion: 'Please enter a valid numeric amount' }
      );
    }

    if (amount < 0) {
      throw new InvalidDomainValueError(
        'Amount cannot be negative',
        'amount',
        amount,
        { suggestion: 'Please enter a positive amount' }
      );
    }

    // Precision check (max 2 decimal places for most currencies)
    if (Math.round(amount * 100) !== amount * 100) {
      throw new InvalidDomainValueError(
        'Amount has too many decimal places',
        'amount',
        amount,
        { 
          maxDecimals: 2,
          suggestion: 'Please round to 2 decimal places'
        }
      );
    }

    const currency = Currency.fromCode(currencyCode); // May throw its own errors
    return new Money(amount, currency);
  }
}
```

### 4. Entity Business Rule Enforcement
```typescript
export class Order extends AggregateRoot {
  addItem(product: Product, quantity: number): void {
    // State validation
    if (!this._status.equals(OrderStatus.DRAFT)) {
      throw new BusinessRuleViolationError(
        'Items can only be added to draft orders',
        'ORDER_MUST_BE_DRAFT',
        { 
          orderId: this._id.value,
          currentStatus: this._status.value,
          allowedStatuses: [OrderStatus.DRAFT.value]
        }
      );
    }

    // Parameter validation
    if (quantity <= 0) {
      throw new InvalidDomainValueError(
        'Quantity must be greater than zero',
        'quantity',
        quantity,
        { 
          minimum: 1,
          suggestion: 'Please enter a positive quantity'
        }
      );
    }

    if (quantity > 100) {
      throw new BusinessRuleViolationError(
        'Quantity exceeds maximum allowed per item',
        'MAX_QUANTITY_PER_ITEM',
        { 
          requestedQuantity: quantity,
          maxQuantity: 100,
          productId: product.id.value
        }
      );
    }

    // Product state validation
    if (!product.isAvailable()) {
      throw new BusinessRuleViolationError(
        'Product is not available for ordering',
        'PRODUCT_MUST_BE_AVAILABLE',
        { 
          productId: product.id.value,
          productStatus: product.status.value,
          productName: product.name
        }
      );
    }

    // Business limit validation
    const itemPrice = product.price.multiply(quantity);
    const newTotal = this.calculateTotal().add(itemPrice);
    const maxOrderValue = Money.create(10000, 'USD');

    if (newTotal.isGreaterThan(maxOrderValue)) {
      throw new BusinessRuleViolationError(
        'Order total would exceed maximum allowed amount',
        'ORDER_TOTAL_LIMIT_EXCEEDED',
        { 
          currentTotal: this.calculateTotal().toString(),
          itemPrice: itemPrice.toString(),
          newTotal: newTotal.toString(),
          maxLimit: maxOrderValue.toString()
        }
      );
    }

    // Create and add item
    const orderItem = OrderItem.create(product, quantity);
    this._items.push(orderItem);
    this._updatedAt = new Date();

    this.addEvent(new OrderItemAdded(
      this._id.value,
      product.id.value,
      quantity
    ));
  }

  place(): void {
    // Validate order can be placed
    if (!this._status.equals(OrderStatus.DRAFT)) {
      throw new BusinessRuleViolationError(
        'Only draft orders can be placed',
        'ORDER_MUST_BE_DRAFT',
        { 
          orderId: this._id.value,
          currentStatus: this._status.value
        }
      );
    }

    if (this._items.length === 0) {
      throw new BusinessRuleViolationError(
        'Cannot place an empty order',
        'ORDER_CANNOT_BE_EMPTY',
        { 
          orderId: this._id.value,
          suggestion: 'Please add items to the order before placing it'
        }
      );
    }

    // Check minimum order value
    const total = this.calculateTotal();
    const minOrderValue = Money.create(10, total.currency.code);

    if (total.isLessThan(minOrderValue)) {
      throw new BusinessRuleViolationError(
        'Order total is below minimum required amount',
        'ORDER_BELOW_MINIMUM',
        { 
          currentTotal: total.toString(),
          minimumRequired: minOrderValue.toString(),
          shortfall: minOrderValue.subtract(total).toString()
        }
      );
    }

    this._status = OrderStatus.PLACED;
    this._placedAt = new Date();
    this._updatedAt = new Date();

    this.addEvent(new OrderPlaced(
      this._id.value,
      this._customerId.value,
      this._items.map(item => item.toPersistence()),
      total
    ));
  }
}
```

### 5. Result Pattern for Fallible Operations
```typescript
export class Result<T, E = DomainError> {
  private constructor(
    private readonly _isSuccess: boolean,
    private readonly _value?: T,
    private readonly _error?: E
  ) {}

  static success<T>(value: T): Result<T> {
    return new Result(true, value);
  }

  static failure<E>(error: E): Result<never, E> {
    return new Result(false, undefined, error);
  }

  get isSuccess(): boolean {
    return this._isSuccess;
  }

  get isFailure(): boolean {
    return !this._isSuccess;
  }

  get value(): T {
    if (!this._isSuccess) {
      throw new Error('Cannot access value of failed result');
    }
    return this._value!;
  }

  get error(): E {
    if (this._isSuccess) {
      throw new Error('Cannot access error of successful result');
    }
    return this._error!;
  }

  // Transform successful results
  map<U>(fn: (value: T) => U): Result<U, E> {
    if (this._isSuccess) {
      return Result.success(fn(this._value!));
    }
    return Result.failure(this._error!);
  }

  // Chain operations that return Results
  flatMap<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
    if (this._isSuccess) {
      return fn(this._value!);
    }
    return Result.failure(this._error!);
  }

  // Execute side effects
  ifSuccess(fn: (value: T) => void): Result<T, E> {
    if (this._isSuccess) {
      fn(this._value!);
    }
    return this;
  }

  ifFailure(fn: (error: E) => void): Result<T, E> {
    if (this._isFailure) {
      fn(this._error!);
    }
    return this;
  }
}

// Usage in domain services
export class OrderValidationService {
  static validateOrderPlacement(
    customer: User,
    items: OrderItem[]
  ): Result<void, DomainError> {
    
    if (!customer.status.equals(UserStatus.ACTIVE)) {
      return Result.failure(new BusinessRuleViolationError(
        'Only active customers can place orders',
        'CUSTOMER_MUST_BE_ACTIVE',
        { customerId: customer.id.value, status: customer.status.value }
      ));
    }

    if (items.length === 0) {
      return Result.failure(new BusinessRuleViolationError(
        'Order must contain at least one item',
        'ORDER_CANNOT_BE_EMPTY'
      ));
    }

    const totalValue = items.reduce(
      (sum, item) => sum.add(item.totalPrice),
      Money.create(0, 'USD')
    );

    if (totalValue.isGreaterThan(Money.create(5000, 'USD'))) {
      return Result.failure(new BusinessRuleViolationError(
        'Order value exceeds customer limit',
        'ORDER_EXCEEDS_CUSTOMER_LIMIT',
        { 
          customerId: customer.id.value,
          orderValue: totalValue.toString(),
          customerLimit: '$5,000'
        }
      ));
    }

    return Result.success(undefined);
  }
}
```

### 6. React Integration and Error Boundaries
```typescript
// Domain error boundary component
export class DomainErrorBoundary extends Component<
  { 
    children: ReactNode;
    fallback?: ComponentType<{ error: DomainError; retry: () => void }>;
    onError?: (error: DomainError) => void;
  },
  { error: DomainError | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    if (error instanceof DomainError) {
      return { error };
    }
    return null;
  }

  componentDidCatch(error: Error) {
    if (error instanceof DomainError && this.props.onError) {
      this.props.onError(error);
    }
  }

  retry = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      const FallbackComponent = this.props.fallback || DefaultDomainErrorFallback;
      return <FallbackComponent error={this.state.error} retry={this.retry} />;
    }

    return this.props.children;
  }
}

// Error display component
export function DomainErrorDisplay({ error }: { error: DomainError }) {
  const getErrorSeverity = (error: DomainError): 'error' | 'warning' | 'info' => {
    switch (error.errorType) {
      case 'BUSINESS_RULE_VIOLATION':
        return 'warning';
      case 'INVALID_DOMAIN_VALUE':
        return 'error';
      case 'AGGREGATE_NOT_FOUND':
        return 'info';
      default:
        return 'error';
    }
  };

  const severity = getErrorSeverity(error);

  return (
    <Alert severity={severity}>
      <AlertTitle>
        {error.errorType.replace(/_/g, ' ').toLowerCase()}
      </AlertTitle>
      {error.toUserMessage()}
      {error.context?.suggestion && (
        <div className="mt-2 text-sm opacity-75">
          Suggestion: {error.context.suggestion}
        </div>
      )}
    </Alert>
  );
}

// Hook for domain error handling
export function useDomainErrorHandler() {
  const [error, setError] = useState<DomainError | null>(null);

  const handleDomainOperation = useCallback(
    async <T>(operation: () => Promise<T>): Promise<T | null> => {
      try {
        setError(null);
        return await operation();
      } catch (err) {
        if (err instanceof DomainError) {
          setError(err);
          return null;
        }
        throw err; // Re-throw non-domain errors
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { error, handleDomainOperation, clearError };
}

// Usage in React components
export function OrderFormComponent() {
  const { error, handleDomainOperation, clearError } = useDomainErrorHandler();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: OrderFormData) => {
    setIsSubmitting(true);
    
    const result = await handleDomainOperation(async () => {
      const customer = await userRepository.findById(
        UserId.fromString(formData.customerId)
      );
      
      if (!customer) {
        throw new AggregateNotFoundError('User', formData.customerId);
      }

      const order = Order.create(customer.id);
      
      formData.items.forEach(itemData => {
        const product = Product.fromPersistence(itemData.product);
        order.addItem(product, itemData.quantity);
      });

      order.place();
      await orderRepository.save(order);
      
      return order;
    });

    setIsSubmitting(false);
    
    if (result) {
      // Success handling
      navigate(`/orders/${result.id.value}`);
    }
  };

  return (
    <DomainErrorBoundary>
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4">
            <DomainErrorDisplay error={error} />
            <button 
              type="button" 
              onClick={clearError}
              className="mt-2 text-sm text-blue-600"
            >
              Dismiss
            </button>
          </div>
        )}
        
        {/* Form fields */}
        
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="btn-primary"
        >
          {isSubmitting ? 'Placing Order...' : 'Place Order'}
        </button>
      </form>
    </DomainErrorBoundary>
  );
}
```

### 7. Error Logging and Monitoring
```typescript
// Error logger service
export interface ErrorLogger {
  logDomainError(error: DomainError): void;
  logCriticalDomainError(error: DomainError): void;
}

export class ConsoleErrorLogger implements ErrorLogger {
  logDomainError(error: DomainError): void {
    console.error('Domain Error:', error.toLogObject());
  }

  logCriticalDomainError(error: DomainError): void {
    console.error('CRITICAL Domain Error:', error.toLogObject());
    // Could send to monitoring service
  }
}

// Integration with domain operations
export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private errorLogger: ErrorLogger
  ) {}

  async placeOrder(orderData: OrderCreationData): Promise<Result<Order, DomainError>> {
    try {
      const order = Order.create(orderData.customerId);
      
      orderData.items.forEach(item => {
        order.addItem(item.product, item.quantity);
      });
      
      order.place();
      await this.orderRepository.save(order);
      
      return Result.success(order);
      
    } catch (error) {
      if (error instanceof DomainError) {
        this.errorLogger.logDomainError(error);
        
        if (error instanceof InvariantViolationError) {
          this.errorLogger.logCriticalDomainError(error);
        }
        
        return Result.failure(error);
      }
      
      throw error; // Re-throw infrastructure errors
    }
  }
}
```

## Consequences

### Positive
- **Clear Error Types**: Distinct categories for different failure scenarios
- **Rich Context**: Detailed information for debugging and user feedback
- **Type Safety**: Strong typing for error handling in TypeScript
- **User Experience**: Meaningful error messages with suggestions
- **Debugging**: Comprehensive logging with error IDs and context
- **Testability**: Easy to test error scenarios and error handling logic
- **Consistency**: Standardized error handling across the domain layer

### Negative
- **Complexity**: Additional error types and patterns to understand
- **Boilerplate**: More code required for comprehensive error handling
- **Performance**: Slight overhead from error object creation and context

### Neutral
- **Bundle Size**: Modest increase due to error handling infrastructure
- **Learning Curve**: Team needs to understand error patterns and best practices

## Implementation Guidelines

### Error Creation Rules

**Mandatory**
1. **Use specific error types for different scenarios**
2. **Include meaningful context information**
3. **Provide user-friendly error messages**
4. **Use domain language in error messages**
5. **Include machine-readable error codes**

**Error Message Guidelines**
- Be specific about what went wrong
- Use business terminology, not technical jargon
- Include suggestions for resolution when possible
- Avoid exposing internal system details
- Be consistent in tone and format

**Context Information**
- Include relevant entity IDs and values
- Provide expected vs actual values for validation errors
- Add suggestions for error resolution
- Include business-relevant metadata

### Error Handling Patterns

**When to Use Exceptions**
- Invalid value object creation
- Business rule violations in entity methods
- Aggregate invariant violations
- Critical system constraints

**When to Use Result Pattern**
- Operations that commonly fail
- Validation services
- Complex multi-step operations
- When callers need to handle errors programmatically

### Testing Strategy
- **Unit Tests**: Test error creation and message formatting
- **Domain Tests**: Test business rule violations and error scenarios
- **Integration Tests**: Test error handling across application layers
- **React Tests**: Test error boundary behavior and user feedback

## File Organization
```
src/domain/errors/
├── base/
│   ├── DomainError.ts
│   ├── Result.ts
│   └── ErrorLogger.ts
├── types/
│   ├── BusinessRuleViolationError.ts
│   ├── InvalidDomainValueError.ts
│   ├── AggregateNotFoundError.ts
│   ├── ConcurrencyConflictError.ts
│   ├── InvariantViolationError.ts
│   └── DomainServiceError.ts
└── react/
    ├── DomainErrorBoundary.tsx
    ├── DomainErrorDisplay.tsx
    └── useDomainErrorHandler.ts
```

## Related Decisions
- ADR-001: Domain Entity Structure Pattern
- ADR-002: Value Object Implementation Pattern
- ADR-003: Domain Event Structure and Implementation
- ADR-004: Repository Interface Design Pattern
- ADR-005: Persistence Data Transfer Objects Pattern

## Notes
A comprehensive error handling strategy is essential for maintaining domain integrity and providing excellent user experience. This approach balances developer productivity with robust error management while maintaining clean separation between domain logic and error handling concerns.

---
**Decision Date**: 2025-07-03  
**Participants**: Development Team, Architecture Team  
**Review Date**: 2025-10-03
