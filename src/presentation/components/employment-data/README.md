# EmploymentData Component

## Descripción

Componente de visualización de datos de empleo en Colombia que muestra tendencias de tasa de desocupación y crecimiento del empleo público. Basado en datos del DANE y siguiendo el patrón arquitectónico Redux con Context + useReducer.

## Características

- 📊 **Visualizaciones interactivas**: Gráficas de líneas para tasa de desocupación y empleo público
- 🎛️ **Controles de filtrado**: Selector de vista y filtro por año inicial
- 🔄 **Patrón Redux**: Context + useReducer preparado para migración a Redux Toolkit
- 📈 **Recharts**: Gráficos responsivos y configurables
- 🛡️ **TypeScript estricto**: Tipado completo y validaciones
- 🎨 **Material-UI**: Componentes consistentes con el sistema de diseño
- 📱 **Responsive**: Adaptado para móviles y escritorio

## Uso Básico

```tsx
import { EmploymentDataWithProvider } from '../components/employment-data';

const MyPage = () => {
  return (
    <div>
      <h1>Datos Laborales de Colombia</h1>
      <EmploymentDataWithProvider />
    </div>
  );
};
```

## Uso Avanzado con Context Personalizado

```tsx
import { 
  EmploymentData, 
  EmploymentDataProvider,
  useEmploymentDataActions 
} from '../components/employment-data';

const CustomWrapper = () => {
  return (
    <EmploymentDataProvider>
      <CustomControls />
      <EmploymentData />
    </EmploymentDataProvider>
  );
};

const CustomControls = () => {
  const { setActiveChart, setFromYear } = useEmploymentDataActions();
  // Controles personalizados...
};
```

## Visualizaciones Disponibles

### 1. Tasa de Desocupación
- **Tipo**: Gráfica de líneas
- **Datos**: 2023-2024 (10.2% estable)
- **Color**: Rojo (#dc3545)
- **Insight**: Estabilización post-pandemia

### 2. Crecimiento del Empleo Público
- **Tipo**: Gráfica de líneas dual (empleo + crecimiento %)
- **Datos**: 2002-2023 (950K → 1,310K empleados)
- **Colores**: Verde (#198754) y Naranja (#fd7e14)
- **Insight**: Crecimiento sostenido del 2% anual

## Arquitectura del Componente

### Estructura de Archivos
```
employment-data/
├── EmploymentData.tsx                    # Componente principal
├── EmploymentDataWithProvider.tsx        # Wrapper con Provider
├── YearFilter.tsx                       # Componente de filtro
├── data.ts                              # Datos y transformaciones
├── index.ts                             # Barrel exports
├── README.md                            # Esta documentación
└── context/
    ├── index.ts                         # Barrel exports del context
    ├── types.ts                         # Interfaces de estado
    ├── actions.ts                       # Action types y creators
    ├── reducer.ts                       # Reducer puro + selectors
    ├── context.ts                       # Context definitions
    ├── EmploymentDataContext.tsx         # Provider component
    └── hooks.ts                         # Custom hooks
```

### Patrón Redux Implementado

#### Estado
```typescript
interface EmploymentDataState {
  activeChart: 'unemployment' | 'publicEmploymentGrowth';
  fromYear: number;
  showAnalysis: boolean;
  showSources: boolean;
  isLoading: boolean;
  error: string | null;
  dataLastUpdated: Date | null;
}
```

#### Acciones Disponibles
- `setActiveChart(chartType)` - Cambiar vista activa
- `setFromYear(year)` - Filtrar desde año específico
- `toggleAnalysis()` - Mostrar/ocultar análisis
- `toggleSources()` - Mostrar/ocultar fuentes
- `setLoading(boolean)` - Estado de carga
- `setError(string)` - Manejo de errores

### Hooks Disponibles

#### Hooks de Estado
```typescript
const activeChart = useActiveChart();
const fromYear = useFromYear();
const showAnalysis = useShowAnalysis();
const isLoading = useIsLoading();
const error = useError();
```

#### Hook de Acciones
```typescript
const {
  setActiveChart,
  setFromYear,
  toggleAnalysis,
  toggleSources
} = useEmploymentDataActions();
```

## Datos y Fuentes

### Estructura de Datos
```typescript
interface EmploymentDataEntry {
  año: number;
  poblacion_ocupada_total_miles?: number;
  sector_publico_total_miles?: number;
  tasa_ocupacion_formal?: number;
  tasa_desocupacion?: number;
  // ... otros campos
}
```

### Fuentes Principales
- **DANE**: Departamento Administrativo Nacional de Estadística
- **Ministerio del Trabajo**: Estadísticas laborales oficiales
- **OIT**: Organización Internacional del Trabajo
- **Banco Mundial**: Indicadores de desarrollo mundial

### Transformaciones de Datos

#### Pure Functions Disponibles
```typescript
// Procesar datos de desocupación
const unemploymentData = processUnemploymentRateData(rawData);

// Procesar empleo público con crecimiento
const growthData = processPublicEmploymentGrowthData(rawData);

// Filtrar por año
const filteredData = filterDataFromYear(data, fromYear);

// Validar integridad
const isValid = validateDataIntegrity(data);
```

## Personalización

### Colores de las Gráficas
```typescript
const colors = {
  unemployment: '#dc3545',      // Rojo para desocupación
  publicEmployment: '#198754',  // Verde para empleo público
  growth: '#fd7e14',           // Naranja para crecimiento
  grid: '#f0f0f0',             // Gris claro para grillas
};
```

### Configuración de Tooltips
```typescript
const formatTooltip = (value: number, name: string): [string, string] => {
  switch (name) {
    case 'tasa_desocupacion':
      return [`${value}%`, 'Tasa de Desocupación'];
    case 'sector_publico_total_miles':
      return [`${value.toLocaleString()} mil`, 'Empleo Público'];
    // ...
  }
};
```

## Migración a Redux Toolkit (Futura)

El componente está preparado para migración sin cambios en la API:

```typescript
// Actual: Context + useReducer
const { setActiveChart } = useEmploymentDataActions();

// Futuro: Redux Toolkit
const dispatch = useAppDispatch();
dispatch(employmentDataActions.setActiveChart('unemployment'));
```

## Validaciones y Error Handling

### Validación de Datos
- Verificación de integridad al montar el componente
- Validación de tipos TypeScript en tiempo de compilación
- Manejo graceful de datos faltantes (`undefined` vs `null`)

### Estados de Error
```typescript
if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorDisplay error={error} />;
return <MainContent />;
```

## Testing (Recomendado)

### Unit Tests
```typescript
// Testar pure functions
describe('processUnemploymentRateData', () => {
  it('should filter null values and sort by year', () => {
    const result = processUnemploymentRateData(mockData);
    expect(result).toHaveLength(2);
    expect(result[0].año).toBe(2023);
  });
});
```

### Integration Tests
```typescript
// Testar reducer
describe('employmentDataReducer', () => {
  it('should set active chart', () => {
    const action = employmentDataActions.setActiveChart('unemployment');
    const newState = employmentDataReducer(initialState, action);
    expect(newState.activeChart).toBe('unemployment');
  });
});
```

## Performance

### Optimizaciones Implementadas
- **Pure functions**: Para transformación de datos inmutable
- **useMemo en hooks**: Prevención de re-renders innecesarios
- **Selectors**: Acceso granular al estado
- **Lazy loading**: Preparado para carga asíncrona de datos

### Métricas Recomendadas
- Tiempo de renderizado inicial: < 100ms
- Tiempo de cambio de vista: < 50ms
- Bundle size: ~15KB (sin dependencias)

## Roadmap

### Mejoras Futuras
1. **Conectar API real**: Reemplazar datos estáticos
2. **Más visualizaciones**: Gráficos de barras, área, etc.
3. **Exportación**: PNG, PDF, CSV
4. **Predicciones**: Modelos de proyección
5. **Comparaciones**: Benchmarking internacional
6. **Filtros avanzados**: Por departamento, sector, demografía

### Migraciones Planificadas
1. **Redux Toolkit**: Para aplicaciones más grandes
2. **React Query**: Para manejo de datos remotos
3. **Virtualization**: Para datasets grandes
4. **Web Workers**: Para cálculos pesados
