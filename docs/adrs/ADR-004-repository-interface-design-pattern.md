# ADR-004: Repository Interface Design Pattern

## Status
Accepted

## Context

Following ADR-001 (Domain Entity Structure), ADR-002 (Value Object Implementation), and ADR-003 (Domain Event Structure), we need to establish patterns for data access that maintain clean separation between domain logic and infrastructure concerns.

Current challenges:
- Domain entities need persistence without coupling to specific storage technologies
- Query logic scattered across different layers of the application
- Difficulty testing business logic due to database dependencies
- No clear contract for data access operations
- Need to support both simple CRUD and complex domain queries
- React applications require optimistic updates and caching strategies

Requirements:
- Abstract data access behind domain-focused interfaces
- Support aggregate consistency boundaries
- Enable easy testing with in-memory implementations
- Provide type-safe query operations
- Support domain events integration
- Enable optimistic UI updates in React
- Allow for different storage implementations (REST API, GraphQL, local storage)

## Decision

We will implement repositories using **interface-based abstraction** with domain-focused contracts and infrastructure-specific implementations:

### 1. Base Repository Interface
```typescript
export interface Repository<T extends AggregateRoot, ID extends EntityId> {
  // Basic CRUD operations
  save(aggregate: T): Promise<void>;
  findById(id: ID): Promise<T | null>;
  delete(id: ID): Promise<void>;
  
  // Bulk operations
  saveMany(aggregates: T[]): Promise<void>;
  findMany(ids: ID[]): Promise<T[]>;
  
  // Existence check
  exists(id: ID): Promise<boolean>;
  
  // Transaction support
  saveWithinTransaction(aggregate: T, transaction: Transaction): Promise<void>;
}
```

### 2. Domain-Specific Repository Interfaces
```typescript
export interface UserRepository extends Repository<User, UserId> {
  // Domain-specific queries
  findByEmail(email: Email): Promise<User | null>;
  findByEmailDomain(domain: string): Promise<User[]>;
  findActiveUsers(): Promise<User[]>;
  findUsersRegisteredAfter(date: Date): Promise<User[]>;
  
  // Business queries
  countActiveUsers(): Promise<number>;
  findUsersWithIncompleteProfiles(): Promise<User[]>;
  
  // Complex queries
  searchUsers(criteria: UserSearchCriteria): Promise<UserSearchResult>;
}

export interface OrderRepository extends Repository<Order, OrderId> {
  // Customer-related queries
  findByCustomerId(customerId: UserId): Promise<Order[]>;
  findPendingOrdersForCustomer(customerId: UserId): Promise<Order[]>;
  
  // Status-based queries
  findByStatus(status: OrderStatus): Promise<Order[]>;
  findOrdersRequiringShipping(): Promise<Order[]>;
  
  // Date-range queries
  findOrdersInDateRange(startDate: Date, endDate: Date): Promise<Order[]>;
  
  // Business analytics
  calculateTotalRevenueInPeriod(startDate: Date, endDate: Date): Promise<Money>;
  findTopSellingProducts(limit: number): Promise<ProductSalesData[]>;
  
  // Complex domain queries
  findOrdersWithItems(productIds: ProductId[]): Promise<Order[]>;
}

export interface ProductRepository extends Repository<Product, ProductId> {
  // Catalog queries
  findByCategory(category: ProductCategory): Promise<Product[]>;
  findBySku(sku: ProductSku): Promise<Product | null>;
  findAvailableProducts(): Promise<Product[]>;
  
  // Search and filtering
  searchProducts(criteria: ProductSearchCriteria): Promise<ProductSearchResult>;
  findProductsByPriceRange(minPrice: Money, maxPrice: Money): Promise<Product[]>;
  
  // Inventory queries
  findLowStockProducts(threshold: number): Promise<Product[]>;
  findProductsRequiringReorder(): Promise<Product[]>;
}
```

### 3. Query Objects Pattern
```typescript
export class UserSearchCriteria {
  constructor(
    public readonly email?: string,
    public readonly firstName?: string,
    public readonly lastName?: string,
    public readonly status?: UserStatus,
    public readonly registeredAfter?: Date,
    public readonly registeredBefore?: Date,
    public readonly limit?: number,
    public readonly offset?: number,
    public readonly sortBy?: UserSortField,
    public readonly sortDirection?: SortDirection
  ) {}

  static builder(): UserSearchCriteriaBuilder {
    return new UserSearchCriteriaBuilder();
  }
}

export class UserSearchCriteriaBuilder {
  private criteria: Partial<UserSearchCriteria> = {};

  withEmail(email: string): this {
    this.criteria.email = email;
    return this;
  }

  withStatus(status: UserStatus): this {
    this.criteria.status = status;
    return this;
  }

  registeredAfter(date: Date): this {
    this.criteria.registeredAfter = date;
    return this;
  }

  withPagination(limit: number, offset: number): this {
    this.criteria.limit = limit;
    this.criteria.offset = offset;
    return this;
  }

  build(): UserSearchCriteria {
    return new UserSearchCriteria(
      this.criteria.email,
      this.criteria.firstName,
      this.criteria.lastName,
      this.criteria.status,
      this.criteria.registeredAfter,
      this.criteria.registeredBefore,
      this.criteria.limit,
      this.criteria.offset,
      this.criteria.sortBy,
      this.criteria.sortDirection
    );
  }
}
```

### 4. Result Objects Pattern
```typescript
export class UserSearchResult {
  constructor(
    public readonly users: User[],
    public readonly totalCount: number,
    public readonly hasMore: boolean,
    public readonly executionTime: number
  ) {}
}

export class ProductSearchResult {
  constructor(
    public readonly products: Product[],
    public readonly facets: ProductFacets,
    public readonly totalCount: number,
    public readonly page: number,
    public readonly pageSize: number
  ) {}
}
```

### 5. Implementation Example (REST API)
```typescript
export class RestUserRepository implements UserRepository {
  constructor(
    private httpClient: HttpClient,
    private eventDispatcher: EventDispatcher
  ) {}

  async save(user: User): Promise<void> {
    const isNew = !await this.exists(user.id);
    const userData = user.toPersistence();
    
    if (isNew) {
      await this.httpClient.post('/api/users', userData);
    } else {
      await this.httpClient.put(`/api/users/${user.id.value}`, userData);
    }

    // Publish domain events
    const events = user.getUncommittedEvents();
    await this.eventDispatcher.dispatchAll(events);
    user.clearEvents();
  }

  async findById(id: UserId): Promise<User | null> {
    try {
      const response = await this.httpClient.get(`/api/users/${id.value}`);
      return User.fromPersistence(response.data);
    } catch (error) {
      if (error.status === 404) {
        return null;
      }
      throw new RepositoryError(`Failed to find user: ${error.message}`);
    }
  }

  async findByEmail(email: Email): Promise<User | null> {
    const response = await this.httpClient.get('/api/users/search', {
      params: { email: email.value }
    });
    
    if (response.data.length === 0) {
      return null;
    }
    
    return User.fromPersistence(response.data[0]);
  }

  async searchUsers(criteria: UserSearchCriteria): Promise<UserSearchResult> {
    const params = this.buildSearchParams(criteria);
    const response = await this.httpClient.get('/api/users/search', { params });
    
    return new UserSearchResult(
      response.data.users.map(User.fromPersistence),
      response.data.totalCount,
      response.data.hasMore,
      response.data.executionTime
    );
  }

  private buildSearchParams(criteria: UserSearchCriteria): Record<string, any> {
    const params: Record<string, any> = {};
    
    if (criteria.email) params.email = criteria.email;
    if (criteria.status) params.status = criteria.status.value;
    if (criteria.registeredAfter) params.registeredAfter = criteria.registeredAfter.toISOString();
    if (criteria.limit) params.limit = criteria.limit;
    if (criteria.offset) params.offset = criteria.offset;
    
    return params;
  }
}
```

### 6. In-Memory Implementation (Testing)
```typescript
export class InMemoryUserRepository implements UserRepository {
  private users: Map<string, User> = new Map();
  private eventDispatcher: EventDispatcher;

  constructor(eventDispatcher: EventDispatcher) {
    this.eventDispatcher = eventDispatcher;
  }

  async save(user: User): Promise<void> {
    this.users.set(user.id.value, user);
    
    // Publish domain events
    const events = user.getUncommittedEvents();
    await this.eventDispatcher.dispatchAll(events);
    user.clearEvents();
  }

  async findById(id: UserId): Promise<User | null> {
    return this.users.get(id.value) || null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email.equals(email)) {
        return user;
      }
    }
    return null;
  }

  async findActiveUsers(): Promise<User[]> {
    return Array.from(this.users.values())
      .filter(user => user.status.equals(UserStatus.ACTIVE));
  }

  async searchUsers(criteria: UserSearchCriteria): Promise<UserSearchResult> {
    let results = Array.from(this.users.values());
    
    // Apply filters
    if (criteria.email) {
      results = results.filter(user => 
        user.email.value.includes(criteria.email!)
      );
    }
    
    if (criteria.status) {
      results = results.filter(user => 
        user.status.equals(criteria.status!)
      );
    }
    
    // Apply pagination
    const totalCount = results.length;
    if (criteria.offset) {
      results = results.slice(criteria.offset);
    }
    if (criteria.limit) {
      results = results.slice(0, criteria.limit);
    }
    
    return new UserSearchResult(
      results,
      totalCount,
      totalCount > (criteria.offset || 0) + results.length,
      0
    );
  }
}
```

### 7. React Integration with Repository
```typescript
export function useUserRepository() {
  const { httpClient } = useHttpClient();
  const { eventDispatcher } = useDomainEvents();
  
  return useMemo(
    () => new RestUserRepository(httpClient, eventDispatcher),
    [httpClient, eventDispatcher]
  );
}

export function useUsers(searchCriteria: UserSearchCriteria) {
  const userRepository = useUserRepository();
  
  return useQuery({
    queryKey: ['users', searchCriteria],
    queryFn: () => userRepository.searchUsers(searchCriteria),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Usage in React component
export function UserListComponent() {
  const searchCriteria = UserSearchCriteria.builder()
    .withStatus(UserStatus.ACTIVE)
    .withPagination(20, 0)
    .build();
    
  const { data: result, isLoading, error } = useUsers(searchCriteria);
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div>
      {result?.users.map(user => (
        <UserCard key={user.id.value} user={user} />
      ))}
    </div>
  );
}
```

## Consequences

### Positive
- **Testability**: Easy to test business logic with in-memory implementations
- **Flexibility**: Can switch between different storage technologies
- **Type Safety**: Strong typing for queries and results
- **Domain Focus**: Repository interfaces express business intent
- **Clean Architecture**: Clear separation between domain and infrastructure
- **Event Integration**: Automatic domain event publishing on save operations

### Negative
- **Complexity**: Additional abstraction layer to implement and maintain
- **Boilerplate**: More code required compared to direct data access
- **Learning Curve**: Team needs to understand repository and query patterns

### Neutral
- **Performance**: Minimal overhead when implemented efficiently
- **Bundle Size**: Slight increase due to additional interfaces

## Implementation Guidelines

### Repository Design Principles

**Mandatory**
1. Repository interfaces must be defined in the domain layer
2. Implementations must be in the infrastructure layer
3. Methods must use domain language and concepts
4. All operations must be async to support various storage technologies
5. Domain events must be published automatically on save operations

**Domain-Focused Methods**
- Use business terminology in method names
- Accept and return domain objects (entities, value objects)
- Support complex business queries through dedicated methods
- Provide query objects for complex search criteria

**Error Handling**
- Throw domain-specific exceptions for business rule violations
- Throw `RepositoryError` for infrastructure failures
- Return `null` for not-found scenarios (don't throw)

### Query Guidelines

**When to Create Query Objects**
- More than 3 search parameters
- Complex filtering or sorting requirements
- Reusable search patterns across the application

**When to Use Simple Parameters**
- Single parameter lookups (findById, findByEmail)
- Simple boolean queries (findActiveUsers)

## File Organization
```
src/domain/repositories/
├── base/
│   ├── Repository.ts
│   ├── Transaction.ts
│   └── RepositoryError.ts
├── UserRepository.ts
├── OrderRepository.ts
└── ProductRepository.ts

src/infrastructure/repositories/
├── rest/
│   ├── RestUserRepository.ts
│   ├── RestOrderRepository.ts
│   └── RestProductRepository.ts
├── graphql/
│   └── GraphQLUserRepository.ts
└── memory/
    ├── InMemoryUserRepository.ts
    └── InMemoryOrderRepository.ts

src/application/queries/
├── UserSearchCriteria.ts
├── OrderSearchCriteria.ts
└── ProductSearchCriteria.ts
```

## Testing Strategy
- **Unit Tests**: Test repository implementations with known data
- **Integration Tests**: Test repository with real storage systems
- **Contract Tests**: Verify implementations conform to interface contracts
- **React Tests**: Test components using mock repositories

## Related Decisions
- ADR-001: Domain Entity Structure Pattern
- ADR-002: Value Object Implementation Pattern  
- ADR-003: Domain Event Structure and Implementation

## Notes
Repository pattern provides clean separation between domain and infrastructure while enabling flexible storage strategies. The domain-focused interfaces ensure business logic remains independent of storage technology choices.

---
**Decision Date**: 2025-07-03  
**Participants**: Development Team, Architecture Team  
**Review Date**: 2025-10-03
