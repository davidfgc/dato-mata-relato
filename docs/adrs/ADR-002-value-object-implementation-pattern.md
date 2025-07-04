# ADR-002: Value Object Implementation Pattern

## Status
Accepted

## Context

Following ADR-001 (Domain Entity Structure Pattern), we need to establish consistent patterns for implementing value objects within our domain layer. Value objects are essential for avoiding primitive obsession and expressing domain concepts clearly.

Current challenges:
- Inconsistent representation of domain values (strings for emails, numbers for money)
- Scattered validation logic across different layers
- Difficulty in maintaining business rules for complex values
- Type safety gaps when passing primitive values around
- Need for immutable objects that can be safely shared

Value objects in our domain include:
- Identifiers (UserId, ProductId, OrderId)
- Contact information (Email, PhoneNumber, Address)
- Financial values (Money, Price, Discount)
- Measurements (Weight, Dimensions, Quantity)
- Business-specific types (SKU, CustomerCode, OrderStatus)

## Decision

We will implement value objects using **immutable TypeScript classes** with the following mandatory patterns:

### 1. Value Object Class Structure
```typescript
export class ValueObjectName {
  private constructor(private readonly _value: PrimitiveType) {}

  // Factory method with validation
  static create(value: InputType): ValueObjectName {
    if (!this.isValid(value)) {
      throw new DomainError(`Invalid ${ValueObjectName.name}: ${value}`);
    }
    return new ValueObjectName(this.normalize(value));
  }

  // Validation method
  private static isValid(value: InputType): boolean {
    // Validation logic
    return true;
  }

  // Normalization method
  private static normalize(value: InputType): PrimitiveType {
    // Normalization logic
    return value;
  }

  // Value accessor
  get value(): PrimitiveType { return this._value; }

  // Equality comparison
  equals(other: ValueObjectName): boolean {
    return this._value === other._value;
  }

  // String representation
  toString(): string {
    return this._value.toString();
  }
}
```

### 2. Complex Value Objects (Multiple Properties)
```typescript
export class Money {
  private constructor(
    private readonly _amount: number,
    private readonly _currency: Currency
  ) {}

  static create(amount: number, currency: string): Money {
    if (!this.isValidAmount(amount)) {
      throw new DomainError(`Invalid amount: ${amount}`);
    }
    const currencyObj = Currency.fromCode(currency);
    return new Money(amount, currencyObj);
  }

  get amount(): number { return this._amount; }
  get currency(): Currency { return this._currency; }

  add(other: Money): Money {
    if (!this._currency.equals(other._currency)) {
      throw new DomainError("Cannot add money with different currencies");
    }
    return new Money(this._amount + other._amount, this._currency);
  }

  equals(other: Money): boolean {
    return this._amount === other._amount && 
           this._currency.equals(other._currency);
  }

  toString(): string {
    return `${this._amount} ${this._currency.code}`;
  }
}
```

### 3. Identifier Value Objects
```typescript
export abstract class EntityId {
  protected constructor(private readonly _value: string) {}

  get value(): string { return this._value; }

  equals(other: EntityId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}

export class UserId extends EntityId {
  private constructor(value: string) {
    super(value);
  }

  static generate(): UserId {
    return new UserId(crypto.randomUUID());
  }

  static fromString(value: string): UserId {
    if (!value || value.trim().length === 0) {
      throw new DomainError("UserId cannot be empty");
    }
    return new UserId(value);
  }
}
```

### 4. Enumeration Value Objects
```typescript
export class OrderStatus {
  private static readonly VALID_STATUSES = [
    'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'
  ] as const;

  private constructor(private readonly _value: string) {}

  static create(value: string): OrderStatus {
    if (!this.VALID_STATUSES.includes(value as any)) {
      throw new DomainError(`Invalid order status: ${value}`);
    }
    return new OrderStatus(value);
  }

  static get PENDING(): OrderStatus { return new OrderStatus('pending'); }
  static get CONFIRMED(): OrderStatus { return new OrderStatus('confirmed'); }
  static get SHIPPED(): OrderStatus { return new OrderStatus('shipped'); }
  static get DELIVERED(): OrderStatus { return new OrderStatus('delivered'); }
  static get CANCELLED(): OrderStatus { return new OrderStatus('cancelled'); }

  get value(): string { return this._value; }

  equals(other: OrderStatus): boolean {
    return this._value === other._value;
  }

  isPending(): boolean { return this._value === 'pending'; }
  isCompleted(): boolean { return this._value === 'delivered'; }
  canBeCancelled(): boolean { 
    return ['pending', 'confirmed'].includes(this._value); 
  }
}
```

## Consequences

### Positive
- **Type Safety**: Prevents mixing different types of identifiers or values
- **Validation**: Centralized validation logic with clear error messages
- **Immutability**: Safe sharing across different parts of the application
- **Business Logic**: Value objects can contain domain-specific behavior
- **Self-Documenting**: Code clearly expresses what values are valid
- **Refactoring Safety**: Changes to value logic are contained and testable

### Negative
- **Memory Overhead**: More objects created compared to primitive values
- **Learning Curve**: Team needs to understand when and how to use value objects
- **Verbosity**: More code required compared to simple primitive types

### Neutral
- **Performance**: Minimal impact in typical business applications
- **Bundle Size**: Slight increase due to additional classes

## Implementation Guidelines

### When to Create Value Objects
- **Always**: For domain identifiers (UserId, ProductId, etc.)
- **Complex Values**: Email, Phone, Address, Money, Coordinates
- **Business Rules**: Values with validation or business logic
- **Enumerations**: Status values, categories, types
- **Measurements**: Weight, dimensions, quantities with units

### When NOT to Create Value Objects
- Simple boolean flags without business rules
- Timestamps used only for auditing
- Technical identifiers without domain meaning
- Values that change frequently and have no validation

## Compliance Requirements

### Mandatory
1. All value objects must be immutable
2. Use private constructors with static factory methods
3. Implement validation in factory methods
4. Provide `equals()` method for comparison
5. Use meaningful error messages in `DomainError`
6. No public setters or mutating methods

### Prohibited
1. Public constructors
2. Mutable state after creation
3. Validation logic outside the value object
4. Primitive obsession for domain-significant values
5. External dependencies in value objects

### Code Review Checklist
- [ ] Value object is immutable
- [ ] Uses private constructor
- [ ] Factory method validates inputs
- [ ] `equals()` method implemented
- [ ] No external dependencies
- [ ] Appropriate error messages
- [ ] Business logic methods present if needed
- [ ] `toString()` method for debugging

## File Organization
```
src/domain/value-objects/
├── identifiers/
│   ├── UserId.ts
│   ├── ProductId.ts
│   └── OrderId.ts
├── contact/
│   ├── Email.ts
│   ├── PhoneNumber.ts
│   └── Address.ts
├── financial/
│   ├── Money.ts
│   ├── Price.ts
│   └── Currency.ts
├── status/
│   ├── OrderStatus.ts
│   └── UserStatus.ts
└── measurements/
    ├── Weight.ts
    └── Dimensions.ts
```

## Testing Strategy
- **Unit Tests**: Validate creation, validation, and business methods
- **Property-Based Testing**: Test with random valid/invalid inputs
- **Equality Testing**: Verify `equals()` method behavior
- **Immutability Testing**: Ensure objects cannot be mutated after creation

## Related Decisions
- ADR-001: Domain Entity Structure Pattern
- ADR-003: Domain Event Structure (pending)
- ADR-004: Repository Interface Design (pending)

## Notes
Value objects form the foundation of type-safe domain modeling. They eliminate primitive obsession and provide clear boundaries for validation and business rules. This pattern scales well from simple identifiers to complex business values.

---
**Decision Date**: 2025-07-03  
**Participants**: Development Team, Architecture Team  
**Review Date**: 2025-10-03
