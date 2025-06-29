# GuerrillaEvolutionChart - Refactorización Redux Pattern + Datos Remotos

## Resumen

Este componente ha sido refactorizado para seguir el patrón Redux usando `useReducer` + Context y ahora incluye soporte para obtener datos de fuentes remotas con fallback a datos locales.

## ✅ Estado Anterior vs Estado Actual

### Antes (useState)
```tsx
const [activeChart, setActiveChart] = useState('total');
const [showSources, setShowSources] = useState(false);

// Uso directo en eventos
onClick={() => setActiveChart('miembros')}
onClick={() => setShowSources(!showSources)}
```

### Después (Redux Pattern)
```tsx
const activeChart = useActiveChart();
const showSources = useShowSources();
const { setActiveChart, toggleSources } = useGuerrillaEvolutionActions();

// Uso con actions explícitas
onClick={() => setActiveChart('miembros')}
onClick={toggleSources}
```

## 🏗️ Arquitectura Implementada

### 1. **Types & Actions** (`context/types.ts`, `context/actions.ts`)
- Definición de tipos de acciones como constantes
- Interfaces TypeScript para state y actions
- Action creators que retornan objetos con `type` y `payload`
- Estado inicial centralizado

### 2. **Reducer** (`context/reducer.ts`)
- Función reducer pura siguiendo convenciones Redux
- Immutabilidad sin Immer (preparado para futura migración)
- Selectors para extraer datos específicos del state
- Manejo de casos default apropiado

### 3. **Context & Provider** (`context/`)
- Context React para compartir state y dispatch
- Provider que usa `useReducer` en lugar de estado local
- Soporte para estado inicial personalizado (útil para testing)
- Validación de uso dentro del Provider

### 4. **Custom Hooks** (`context/hooks.ts`)
- Hooks especializados siguiendo patrón Redux
- `useActiveChart()`, `useShowSources()` para valores específicos
- `useGuerrillaEvolutionActions()` que combina actions con dispatch
- Abstracción que facilita futura migración

### 5. **Separación de Concerns**
- **Datos**: Movidos a `data.ts` con funciones pure
- **UI**: Componente enfocado solo en presentación
- **Estado**: Manejado completamente por el patrón Redux
- **Provider**: Wrapper separado para reutilización

## 🚀 Ventajas de la Refactorización

### ✅ **Mantenibilidad**
- Estado centralizado y predecible
- Actions explícitas documentan todas las operaciones posibles
- Separación clara entre UI y lógica de estado
- Más fácil de debuggear y testear

### ✅ **Escalabilidad**
- Fácil agregar nuevos campos al estado
- Patrones consistentes para nuevas features
- Preparado para compartir estado entre componentes
- Migración directa a Redux Toolkit cuando sea necesario

### ✅ **Testing**
- Estado inicial personalizable para diferentes casos de test
- Actions y reducer testeable de forma aislada
- Provider mock fácil de configurar
- Comportamiento predecible y determinístico

### ✅ **Consistencia**
- Sigue convenciones estándar de Redux
- Immutabilidad explícita
- Type safety completo con TypeScript
- Patrones reutilizables en toda la aplicación

## 🆕 Nueva Funcionalidad: Datos Remotos

### Hook `useGuerrillaEvolutionData`

Siguiendo el mismo patrón que `useVotingRecordData.ts`, este hook permite:

```typescript
const { 
  membershipData, 
  territorialData, 
  loading, 
  error, 
  lastUpdated 
} = useGuerrillaEvolutionData();
```

### Características:
- **Fetch desde API**: Usa `fetchGuerrillaEvolutionData()` de la capa de infraestructura
- **Fallback automático**: Si la API falla, carga datos locales del archivo `data.ts`
- **Estados de loading y error**: Manejo completo de estados async
- **Metadata**: Incluye `lastUpdated` y fuentes de información
- **TypeScript**: Tipado completo con interfaces compartidas

### Configuración de Endpoint

En `src/shared/config/api.ts`:
```typescript
export const ENDPOINTS = {
  // ...otros endpoints...
  guerrillaEvolution: `${API_BASE_URL}/data/guerrilla-evolution.json`,
};
```

### Estructura de la API Response

```typescript
interface GuerrillaEvolutionApiResponse {
  membershipData: MembershipDataEntry[];
  territorialData: TerritorialDataEntry[];
  lastUpdated?: string;
  metadata?: {
    sources: string[];
    methodology: string;
  };
}
```

### Ejemplo de Uso

```tsx
// Componente que usa datos remotos
const MyComponent = () => {
  const { membershipData, loading, error } = useGuerrillaEvolutionData();
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return <Chart data={membershipData} />;
};
```

## 📁 Estructura de Archivos

```
src/
├── application/hooks/queries/
│   └── useGuerrillaEvolutionData.ts      # Hook para datos remotos
├── infrastructure/api/
│   └── api.ts                            # Función fetchGuerrillaEvolutionData
├── shared/config/
│   └── api.ts                            # Configuración de endpoints
├── presentation/components/guerrilla-evolution/
│   ├── data.ts                           # Datos locales (fallback)
│   ├── GuerrillaEvolutionRemoteExample.tsx  # Ejemplo de uso
│   └── context/                          # Estado Redux-like
public/data/
└── guerrilla-evolution.json              # Datos simulados de API
```

## 🔄 Migración Recomendada

### Para usar datos remotos en el componente existente:

1. **Reemplazar import de datos**:
```typescript
// Antes
import { membershipData, territorialData } from './data';

// Después  
const { membershipData, territorialData, loading, error } = useGuerrillaEvolutionData();
```

2. **Agregar estados de loading/error**:
```tsx
if (loading) return <LoadingState />;
if (error) return <ErrorState error={error} />;
```

3. **Usar datos del hook**:
```typescript
// Los datos ahora vienen del hook en lugar de imports estáticos
const totalData = calculateTotalData(membershipData);
```

## 🎯 Beneficios del Patrón Implementado

### Datos Remotos:
- ✅ **Consistencia**: Mismo patrón que otros hooks del proyecto
- ✅ **Robustez**: Fallback automático a datos locales
- ✅ **Performance**: Estados de loading optimizados  
- ✅ **Mantenibilidad**: Separación clara entre datos y presentación
- ✅ **Tipado**: TypeScript en toda la cadena de datos

### Estado Redux-like:
- ✅ **Escalabilidad**: Fácil agregar nuevo estado sin props drilling
- ✅ **Predictibilidad**: Flujo unidireccional claro (actions → reducer → state)
- ✅ **Debuggeable**: Actions explícitas facilitan debugging  
- ✅ **Testeable**: Reducer y actions son funciones puras
- ✅ **Migratable**: Path claro hacia Redux Toolkit cuando sea necesario

## 📝 Guía de Implementación

### Para nuevos componentes que necesiten datos remotos:

1. **Crear el hook en `application/hooks/queries/`**
2. **Agregar función fetch en `infrastructure/api/api.ts`** 
3. **Configurar endpoint en `shared/config/api.ts`**
4. **Crear archivo JSON en `public/data/` para desarrollo**
5. **Usar el hook en el componente con estados loading/error**

Este patrón garantiza consistencia en todo el proyecto y facilita el mantenimiento y testing de la aplicación.

---

**Resultado**: El componente mantiene la misma funcionalidad pero ahora sigue patrones profesionales que facilitan mantenimiento, testing y escalabilidad futura.
