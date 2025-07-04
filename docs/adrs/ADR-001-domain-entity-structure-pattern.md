# ADR-001: Domain Entity Structure Pattern

## Status
Accepted

## Context

As we build the domain layer for our React TypeScript application, we need to establish a consistent pattern for defining domain entities. The domain layer must be framework-agnostic, maintain business rule integrity, and provide clear separation between domain logic and infrastructure concerns.

Key requirements:
- Encapsulation of entity state and business logic
- Type safety to prevent invalid states
- Clear separation between creation and reconstitution scenarios
- Framework independence (no React/UI dependencies)
- Immutable value objects for complex data types
- Controlled state mutations through business methods

## Decision

We will adopt a **class-based entity structure** with the following mandatory patterns:

### 1. Entity Class Structure
```typescript
export class EntityName {
  private constructor(
    private readonly _id: EntityId,
    private _mutableField: ValueObject,
    private readonly _immutableField: Date
  ) {}

  // Factory methods
  static create(params: CreationParams): EntityName
  static fromPersistence(data: PersistenceData): EntityName

  // Getters only
  get id(): EntityId { return this._id; }
  get field(): ValueObject { return this._field; }

  // Business methods
  businessOperation(params: Params): void

  // Persistence method
  toPersistence(): PersistenceData
}
```

### 2. Mandatory Components

**Private Constructor**: All entities must use private constructors to enforce controlled instantiation.

**Factory Methods**:
- `create()`: For new entity creation with business validation
- `fromPersistence()`: For entity reconstitution from storage

**Private Fields**: All internal state must be private with readonly prefix (`_fieldName`)

**Getter Methods**: Public access to state through getter methods only

**Business Methods**: Domain operations that modify state and enforce business rules

**Persistence Method**: `toPersistence()` for infrastructure layer serialization

### 3. Value Object Integration
- Complex types (Email, Money, Address) must be implemented as value objects
- Primitive obsession is prohibited for domain-significant values
- All value objects must be immutable

### 4. Validation Strategy
- Input validation at factory method level
- Business rule validation within entity methods
- Throw `DomainError` for rule violations

## Consequences

### Positive
- **Encapsulation**: Private fields prevent external state manipulation
- **Type Safety**: Strong typing eliminates invalid state scenarios
- **Testability**: Business logic is isolated and easily testable
- **Consistency**: Uniform pattern across all domain entities
- **Framework Independence**: Pure TypeScript classes with no external dependencies
- **Business Intent**: Code clearly expresses domain concepts and rules

### Negative
- **Verbosity**: More boilerplate compared to simple interfaces or types
- **Learning Curve**: Team members need to understand the pattern
- **Initial Overhead**: Setting up the structure requires more upfront work

### Neutral
- **Performance**: Minimal impact compared to other patterns
- **Bundle Size**: Classes add slightly more code than plain objects

## Compliance Requirements

### Mandatory
1. All domain entities must follow the prescribed class structure
2. No public fields or direct property access
3. Factory methods must validate inputs and enforce business rules
4. Value objects must be used for complex domain types
5. Business logic must reside within entity methods

### Prohibited
1. Public constructors
2. Direct property assignment outside of private methods
3. Primitive obsession for domain-significant values
4. External frameworks or libraries in domain entities
5. Mutation of entity state outside of designated business methods

### Code Review Checklist
- [ ] Entity uses private constructor
- [ ] Factory methods present and validate inputs
- [ ] All fields are private with underscore prefix
- [ ] Business methods enforce domain rules
- [ ] Value objects used for complex types
- [ ] `toPersistence()` method implemented
- [ ] No external dependencies imported

## Enforcement

This ADR will be enforced through:
1. **Code Review Process**: All entity implementations must pass review checklist
2. **TypeScript Linting**: ESLint rules to detect pattern violations
3. **Architecture Tests**: Automated tests to verify structural compliance
4. **Documentation**: Entity examples and guidelines in development wiki

## Related Decisions
- ADR-002: Value Object Implementation Pattern
- ADR-003: Domain Event Structure
- ADR-004: Repository Interface Design

## Notes
This pattern aligns with Domain-Driven Design principles and provides a solid foundation for complex business logic. The structure can be extended with domain events and aggregate patterns as the application grows.

---
**Decision Date**: 2025-07-03  
**Participants**: Development Team, Architecture Team  
**Review Date**: 2025-10-03
