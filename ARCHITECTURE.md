# Arquitectura del Proyecto - Dato Mata Relato

## 🏗️ Arquitectura Objetivo

### Visión General

Este proyecto implementará una **Arquitectura por Capas (Layered Architecture)** con principios de **Clean Architecture**, optimizada para aplicaciones de visualización de datos legislativos con React + Vite.

### Principios Arquitectónicos

- **Separación de Responsabilidades**: Cada capa tiene una responsabilidad específica
- **Inversión de Dependencias**: Las capas internas no dependen de las externas
- **Testabilidad**: Código fácil de testear con dependencias inyectadas
- **Escalabilidad**: Estructura que soporta crecimiento del proyecto
- **Performance**: Optimizado para visualización de datos complejos

## 📁 Estructura de Directorios Objetivo

```
src/
├── app/                          # Configuración de la aplicación
│   ├── App.jsx                   # Componente principal
│   ├── router.jsx                # Configuración de rutas
│   └── providers.jsx             # Providers globales (Theme, Query, etc.)
│
├── shared/                       # Código compartido entre capas
│   ├── constants/                # Constantes globales
│   │   ├── routes.ts            # Rutas de la aplicación
│   │   ├── api.ts               # URLs y configuración API
│   │   └── ui.ts                # Constantes de UI
│   ├── types/                    # Tipos TypeScript globales
│   │   ├── api.ts               # Tipos de respuestas API
│   │   ├── common.ts            # Tipos comunes
│   │   └── index.ts             # Exportaciones
│   ├── utils/                    # Utilidades generales
│   │   ├── date.ts              # Utilidades de fecha
│   │   ├── format.ts            # Formateo de datos
│   │   ├── validation.ts        # Validaciones
│   │   └── index.ts             # Exportaciones
│   ├── config/                   # Configuraciones
│   │   ├── environment.ts       # Variables de entorno
│   │   ├── theme.ts             # Tema de MUI
│   │   └── api.ts               # Configuración de API
│   └── components/               # Componentes UI reutilizables
│       ├── ui/                   # Componentes base
│       │   ├── Button/
│       │   ├── Card/
│       │   ├── Modal/
│       │   └── index.ts
│       └── layout/               # Componentes de layout
│           ├── Header/
│           ├── Sidebar/
│           ├── Footer/
│           └── MainLayout/
│
├── domain/                       # Capa de dominio (entidades y reglas de negocio)
│   ├── entities/                 # Entidades del dominio
│   │   ├── Bill.ts              # Entidad Bill
│   │   ├── Representative.ts     # Entidad Representative
│   │   ├── Party.ts             # Entidad Party
│   │   ├── VotingRecord.ts      # Entidad VotingRecord
│   │   └── VotingStage.ts       # Entidad VotingStage
│   ├── value-objects/            # Objetos de valor
│   │   ├── VoteDecision.ts      # Decisión de voto
│   │   ├── PartyColor.ts        # Color de partido
│   │   └── BillStatus.ts        # Estado de ley
│   ├── repositories/             # Interfaces de repositorios
│   │   ├── IBillRepository.ts
│   │   ├── IRepresentativeRepository.ts
│   │   ├── IPartyRepository.ts
│   │   └── IVotingRepository.ts
│   └── services/                 # Servicios del dominio (reglas de negocio)
│       ├── VotingAnalysisService.ts
│       ├── BillProgressService.ts
│       └── PartyAnalysisService.ts
│
├── application/                  # Capa de aplicación (casos de uso)
│   ├── use-cases/                # Casos de uso específicos
│   │   ├── bills/
│   │   │   ├── GetBillsUseCase.ts
│   │   │   ├── GetBillDetailUseCase.ts
│   │   │   └── SearchBillsUseCase.ts
│   │   ├── representatives/
│   │   │   ├── GetRepresentativesUseCase.ts
│   │   │   └── GetRepresentativeVotingHistoryUseCase.ts
│   │   ├── voting/
│   │   │   ├── GetVotingRecordsUseCase.ts
│   │   │   └── AnalyzePartyVotingUseCase.ts
│   │   └── analytics/
│   │       ├── GenerateVotingStatsUseCase.ts
│   │       └── GetPartyTrendsUseCase.ts
│   ├── stores/                   # Estado global de la aplicación
│   │   ├── billsStore.ts        # Store de bills (Zustand)
│   │   ├── representativesStore.ts
│   │   ├── votingStore.ts
│   │   └── uiStore.ts           # Estado de UI global
│   └── hooks/                    # Custom hooks de aplicación
│       ├── queries/              # React Query hooks
│       │   ├── useBills.ts
│       │   ├── useRepresentatives.ts
│       │   └── useVotingRecords.ts
│       ├── mutations/            # Mutaciones (si aplica)
│       └── state/                # Hooks de estado local
│           ├── useFilters.ts
│           ├── useSearch.ts
│           └── usePagination.ts
│
├── infrastructure/               # Capa de infraestructura
│   ├── api/                      # Clientes HTTP
│   │   ├── client.ts            # Cliente HTTP base
│   │   ├── endpoints.ts         # Definición de endpoints
│   │   └── interceptors.ts      # Interceptores de request/response
│   ├── repositories/             # Implementaciones de repositorios
│   │   ├── JsonBillRepository.ts
│   │   ├── JsonRepresentativeRepository.ts
│   │   ├── JsonPartyRepository.ts
│   │   └── JsonVotingRepository.ts
│   ├── storage/                  # Persistencia local
│   │   ├── localStorage.ts      # Wrapper de localStorage
│   │   ├── sessionStorage.ts    # Wrapper de sessionStorage
│   │   └── cache.ts             # Sistema de cache
│   └── external/                 # Servicios externos
│       ├── analytics.ts         # Google Analytics, etc.
│       └── monitoring.ts        # Sentry, etc.
│
├── presentation/                 # Capa de presentación
│   ├── pages/                    # Páginas principales
│   │   ├── HomePage/
│   │   │   ├── HomePage.jsx
│   │   │   ├── HomePage.styles.ts
│   │   │   └── index.ts
│   │   ├── BillsPage/
│   │   │   ├── BillsPage.jsx
│   │   │   ├── components/
│   │   │   │   ├── BillsList.jsx
│   │   │   │   ├── BillsFilter.jsx
│   │   │   │   └── BillsSearch.jsx
│   │   │   └── index.ts
│   │   ├── BillDetailPage/
│   │   ├── RepresentativesPage/
│   │   ├── VotingRecordsPage/
│   │   ├── AnalyticsPage/
│   │   └── NotFoundPage/
│   ├── components/               # Componentes específicos del dominio
│   │   ├── bills/
│   │   │   ├── BillCard/
│   │   │   ├── BillDetail/
│   │   │   ├── BillAuthors/
│   │   │   └── BillStatus/
│   │   ├── representatives/
│   │   │   ├── RepresentativeCard/
│   │   │   ├── RepresentativeList/
│   │   │   └── RepresentativeProfile/
│   │   ├── voting/
│   │   │   ├── VotingRecord/
│   │   │   ├── VotingDecisionChip/
│   │   │   └── VotingHistory/
│   │   ├── charts/               # Componentes de visualización
│   │   │   ├── PartyVoteChart/
│   │   │   ├── VotingTrendsChart/
│   │   │   ├── BillProgressChart/
│   │   │   └── common/
│   │   └── filters/
│   │       ├── PartyFilter/
│   │       ├── DateRangeFilter/
│   │       └── SearchFilter/
│   └── hooks/                    # Hooks específicos de UI
│       ├── useChartData.ts      # Hooks para procesar datos de gráficos
│       ├── useTablePagination.ts
│       ├── useResponsive.ts     # Hook para responsive design
│       └── useLocalStorage.ts   # Hook para localStorage
│
└── assets/                       # Recursos estáticos
    ├── images/
    ├── icons/
    └── fonts/
```

## 🔧 Tecnologías y Librerías

### Core
- **React 18**: UI Library
- **Vite**: Build tool y dev server
- **TypeScript**: Tipado estático
- **React Router DOM**: Enrutamiento

### UI y Styling
- **Material-UI (MUI)**: Componentes UI
- **Emotion**: Styling (ya incluido con MUI)
- **Recharts**: Visualización de datos

### Estado y Data Fetching
- **Zustand**: Estado global simple
- **TanStack Query (React Query)**: Cache y sincronización de datos del servidor
- **React Hook Form**: Manejo de formularios (para filtros)

### Desarrollo y Calidad
- **ESLint**: Linting
- **Prettier**: Formateo de código
- **Vitest**: Testing unitario
- **React Testing Library**: Testing de componentes
- **TypeScript**: Tipado estático

### Performance y Optimización
- **React.lazy**: Code splitting
- **React.memo**: Memoización de componentes
- **useMemo/useCallback**: Optimización de re-renders

## 🎯 Patrones de Diseño Implementados

### 1. Repository Pattern
```typescript
// domain/repositories/IBillRepository.ts
export interface IBillRepository {
  findAll(): Promise<Bill[]>
  findById(id: string): Promise<Bill | null>
  findByAuthor(authorId: string): Promise<Bill[]>
  search(query: string): Promise<Bill[]>
}

// infrastructure/repositories/JsonBillRepository.ts
export class JsonBillRepository implements IBillRepository {
  // Implementación específica para JSON estáticos
}
```

### 2. Use Case Pattern
```typescript
// application/use-cases/bills/GetBillsUseCase.ts
export class GetBillsUseCase {
  constructor(private billRepository: IBillRepository) {}
  
  async execute(filters?: BillFilters): Promise<Bill[]> {
    // Lógica del caso de uso
  }
}
```

### 3. Custom Hooks Pattern
```typescript
// application/hooks/queries/useBills.ts
export const useBills = (filters?: BillFilters) => {
  return useQuery({
    queryKey: ['bills', filters],
    queryFn: () => getBillsUseCase.execute(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}
```

### 4. Component Composition Pattern
```typescript
// presentation/pages/BillsPage/BillsPage.jsx
export const BillsPage = () => {
  return (
    <MainLayout>
      <BillsPageHeader />
      <BillsFilters />
      <BillsList />
      <BillsPagination />
    </MainLayout>
  )
}
```

## 📊 Gestión de Estado

### Estado Global (Zustand)
- **billsStore**: Bills cargados, filtros activos
- **representativesStore**: Representantes y su información
- **votingStore**: Registros de votación
- **uiStore**: Estado de UI (sidebar abierto, tema, etc.)

### Estado del Servidor (React Query)
- Cache automático de datos JSON
- Invalidación inteligente
- Loading y error states
- Optimistic updates (si se implementan mutaciones)

### Estado Local (useState/useReducer)
- Formularios de filtros
- Estados temporales de componentes
- Modales y overlays

## 🚀 Performance y Optimización

### Code Splitting
```typescript
// app/router.jsx
const BillsPage = lazy(() => import('../presentation/pages/BillsPage'))
const VotingRecordsPage = lazy(() => import('../presentation/pages/VotingRecordsPage'))
```

### Memoización
```typescript
// presentation/components/charts/PartyVoteChart.jsx
export const PartyVoteChart = memo(({ data, options }) => {
  const chartData = useMemo(() => 
    processVotingDataForChart(data), [data]
  )
  
  return <ResponsiveContainer>...</ResponsiveContainer>
})
```

### Virtual Scrolling
Para listas grandes de representantes o bills (react-window o react-virtualized).

## 🧪 Testing Strategy

### Estructura de Tests
```
src/
├── domain/
│   └── __tests__/
│       ├── entities/
│       └── services/
├── application/
│   └── __tests__/
│       ├── use-cases/
│       └── hooks/
├── infrastructure/
│   └── __tests__/
│       └── repositories/
└── presentation/
    └── __tests__/
        ├── components/
        └── pages/
```

### Tipos de Tests
- **Unit Tests**: Entidades, servicios, use cases
- **Integration Tests**: Repositorios, hooks complejos
- **Component Tests**: Componentes React
- **E2E Tests**: Flujos críticos del usuario

## 🔄 Data Flow

```
User Action → Component → Custom Hook → Use Case → Repository → JSON Data
    ↓
Component ← Store ← React Query Cache ← Use Case ← Repository ← JSON Data
```

## 📈 Escalabilidad

### Horizontal
- Nuevas features se agregan como nuevos módulos
- Cada página es independiente
- Componentes reutilizables en shared/

### Vertical
- Capas bien definidas permiten cambios sin afectar otras capas
- Interfaces permiten intercambiar implementaciones
- Inyección de dependencias facilita testing

## 🔒 Principios SOLID Aplicados

- **S**: Cada clase/función tiene una responsabilidad específica
- **O**: Abierto para extensión, cerrado para modificación
- **L**: Las implementaciones son intercambiables
- **I**: Interfaces específicas para cada necesidad
- **D**: Dependencias inyectadas, no acopladas

---

## 📋 Lista de Cambios Requeridos

### 1. Reestructuración de Directorios

#### 🔄 Migración de Archivos Existentes

**Mover archivos existentes:**
```bash
# Componentes específicos del dominio
src/components/bills/ → src/presentation/components/bills/
src/components/congress/ → src/presentation/components/representatives/
src/components/voting-record/ → src/presentation/components/voting/
src/components/graphs/ → src/presentation/components/charts/
src/components/voting-filters/ → src/presentation/components/filters/

# Componentes comunes
src/components/common/ → src/shared/components/ui/

# Configuración
src/config/ → src/shared/config/

# Dominio existente
src/domain/ → src/domain/ (reorganizar según nueva estructura)

# API
src/api/ → src/infrastructure/api/

# Hooks
src/hooks/ → src/application/hooks/queries/
```

#### 📁 Crear nuevos directorios:
```bash
mkdir -p src/app
mkdir -p src/shared/{constants,types,utils,components/ui,components/layout}
mkdir -p src/domain/{entities,value-objects,repositories,services}
mkdir -p src/application/{use-cases,stores,hooks/{queries,mutations,state}}
mkdir -p src/infrastructure/{repositories,storage,external}
mkdir -p src/presentation/{pages,components,hooks}
```

### 2. Instalación de Nuevas Dependencias

```bash
# Estado global y data fetching
npm install zustand @tanstack/react-query

# Formularios (para filtros avanzados)
npm install react-hook-form @hookform/resolvers yup

# Utilidades
npm install date-fns clsx

# Testing (desarrollo)
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom

# Performance (si se necesita virtual scrolling)
npm install react-window react-window-infinite-loader
```

### 3. Configuración de TypeScript

#### 📝 Actualizar `tsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@/shared/*": ["src/shared/*"],
      "@/domain/*": ["src/domain/*"],
      "@/application/*": ["src/application/*"],
      "@/infrastructure/*": ["src/infrastructure/*"],
      "@/presentation/*": ["src/presentation/*"]
    }
  }
}
```

#### 📝 Configurar path mapping en `vite.config.js`:
```javascript
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/shared': path.resolve(__dirname, './src/shared'),
      '@/domain': path.resolve(__dirname, './src/domain'),
      '@/application': path.resolve(__dirname, './src/application'),
      '@/infrastructure': path.resolve(__dirname, './src/infrastructure'),
      '@/presentation': path.resolve(__dirname, './src/presentation'),
    },
  },
})
```

### 4. Creación de Archivos Base

#### 🏗️ Crear estructura base:

**Entidades del dominio:**
- `src/domain/entities/Bill.ts`
- `src/domain/entities/Representative.ts`
- `src/domain/entities/Party.ts`
- `src/domain/entities/VotingRecord.ts`
- `src/domain/entities/VotingStage.ts`

**Interfaces de repositorios:**
- `src/domain/repositories/IBillRepository.ts`
- `src/domain/repositories/IRepresentativeRepository.ts`
- `src/domain/repositories/IPartyRepository.ts`
- `src/domain/repositories/IVotingRepository.ts`

**Implementaciones de repositorios:**
- `src/infrastructure/repositories/JsonBillRepository.ts`
- `src/infrastructure/repositories/JsonRepresentativeRepository.ts`
- `src/infrastructure/repositories/JsonPartyRepository.ts`
- `src/infrastructure/repositories/JsonVotingRepository.ts`

**Stores:**
- `src/application/stores/billsStore.ts`
- `src/application/stores/representativesStore.ts`
- `src/application/stores/votingStore.ts`
- `src/application/stores/uiStore.ts`

**Configuración:**
- `src/shared/config/environment.ts`
- `src/shared/config/api.ts`
- `src/shared/config/theme.ts`
- `src/app/providers.jsx`
- `src/app/router.jsx`

### 5. Migración de Componentes

#### 🔄 Convertir componentes existentes:

1. **Actualizar imports** en todos los componentes
2. **Agregar TypeScript** a componentes JSX → TSX
3. **Implementar nuevos patterns**:
   - Custom hooks para lógica
   - Separación de estilos
   - Props interfaces

#### 📱 Crear páginas principales:
- `src/presentation/pages/HomePage/`
- `src/presentation/pages/BillsPage/`
- `src/presentation/pages/BillDetailPage/`
- `src/presentation/pages/RepresentativesPage/`
- `src/presentation/pages/VotingRecordsPage/`
- `src/presentation/pages/AnalyticsPage/`

### 6. Implementación de Data Layer

#### 🔌 Configurar React Query:
```javascript
// src/app/providers.jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
    },
  },
})
```

#### 🏪 Crear Zustand stores:
```javascript
// src/application/stores/billsStore.ts
import { create } from 'zustand'

interface BillsState {
  filters: BillFilters
  setFilters: (filters: BillFilters) => void
  clearFilters: () => void
}

export const useBillsStore = create<BillsState>((set) => ({
  // implementación
}))
```

#### 🎣 Crear custom hooks:
```javascript
// src/application/hooks/queries/useBills.ts
export const useBills = (filters?: BillFilters) => {
  return useQuery({
    queryKey: ['bills', filters],
    queryFn: () => billRepository.findAll(filters),
  })
}
```

### 7. Testing Setup

#### 🧪 Configurar Vitest:
```javascript
// vitest.config.js
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
```

#### 📝 Crear archivos de test base:
- `src/test/setup.ts`
- `src/test/utils.tsx` (render helpers)
- `src/test/mocks/` (mocks de datos)

### 8. Optimización y Performance

#### ⚡ Implementar code splitting:
```javascript
// src/app/router.jsx
const BillsPage = lazy(() => import('@/presentation/pages/BillsPage'))
```

#### 🎯 Agregar memoización:
```javascript
// En componentes de gráficos
const ChartComponent = memo(({ data }) => {
  const processedData = useMemo(() => processData(data), [data])
  // ...
})
```

### 9. Configuración de Build y Deploy

#### 📦 Actualizar scripts en `package.json`:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix"
  }
}
```

### 10. Documentación

#### 📚 Crear documentación técnica:
- `docs/ARCHITECTURE.md` (este archivo)
- `docs/DEVELOPMENT.md` (guía de desarrollo)
- `docs/DEPLOYMENT.md` (guía de deploy)
- `docs/CONTRIBUTING.md` (guía de contribución)

---

## 🎯 Plan de Implementación Sugerido

### Fase 1: Fundación (Semana 1-2)
1. ✅ Reestructurar directorios
2. ☑️ Instalar dependencias
3. ☑️ Configurar TypeScript y path mapping
4. ☑️ Crear entidades del dominio
5. ☑️ Implementar repositorios básicos

### Fase 2: Data Layer (Semana 3)
1. ☑️ Configurar React Query
2. ☑️ Crear Zustand stores
3. ☑️ Implementar custom hooks
4. ☑️ Migrar llamadas a API existentes

### Fase 3: UI Migration (Semana 4-5)
1. ☑️ Crear páginas principales
2. ☑️ Migrar componentes existentes
3. ☑️ Implementar nuevos patterns
4. ☑️ Actualizar routing

### Fase 4: Testing y Optimización (Semana 6)
1. ☑️ Configurar testing
2. ☑️ Escribir tests críticos
3. ☑️ Implementar optimizaciones de performance
4. ☑️ Code splitting

### Fase 5: Documentación y Polish (Semana 7)
1. ☑️ Completar documentación
2. ☑️ Revisar y refinar código
3. ☑️ Testing final
4. ☑️ Deploy

## 📊 Métricas de Éxito

- **Performance**: LCP < 2.5s, CLS < 0.1
- **Bundle Size**: < 500KB initial bundle
- **Test Coverage**: > 80%
- **Type Safety**: 100% TypeScript coverage
- **Code Quality**: ESLint score > 9/10

Este documento servirá como guía durante toda la refactorización del proyecto hacia la nueva arquitectura.
