# Guía de Migración a Redux Toolkit

Este componente ha sido refactorizado para seguir el patrón Redux usando `useReducer + Context`, preparándolo para una futura migración a Redux Toolkit.

## Arquitectura Actual (useReducer + Context)

```
guerrilla-evolution/
├── context/
│   ├── types.ts          # Action types, interfaces, initial state
│   ├── actions.ts        # Action creators (Redux style)
│   ├── reducer.ts        # Reducer function + selectors
│   ├── context.ts        # React Context definition
│   ├── contextHook.ts    # Hook interno para usar context
│   ├── hooks.ts          # Custom hooks públicos
│   └── index.ts          # Barrel exports
├── data.ts               # Datos separados del componente
├── GuerrillaEvolutionChart.tsx           # Componente UI
├── GuerrillaEvolutionWithProvider.tsx    # Wrapper con Provider
└── MIGRATION_GUIDE.md    # Esta guía
```

## Pasos para Migrar a Redux Toolkit

### 1. Instalar Redux Toolkit
```bash
npm install @reduxjs/toolkit react-redux
```

### 2. Crear el Slice (reemplaza reducer.ts)
```typescript
// store/guerrillaEvolutionSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChartType, GuerrillaEvolutionState, initialState } from '../context/types';

const guerrillaEvolutionSlice = createSlice({
  name: 'guerrillaEvolution',
  initialState,
  reducers: {
    setActiveChart: (state, action: PayloadAction<ChartType>) => {
      state.activeChart = action.payload;
    },
    toggleSources: (state) => {
      state.showSources = !state.showSources;
    },
    setSourcesVisibility: (state, action: PayloadAction<boolean>) => {
      state.showSources = action.payload;
    },
  },
});

export const { setActiveChart, toggleSources, setSourcesVisibility } = guerrillaEvolutionSlice.actions;
export default guerrillaEvolutionSlice.reducer;
```

### 3. Configurar Store
```typescript
// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import guerrillaEvolutionReducer from './guerrillaEvolutionSlice';

export const store = configureStore({
  reducer: {
    guerrillaEvolution: guerrillaEvolutionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### 4. Crear Hooks Tipados
```typescript
// hooks/redux.ts
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

### 5. Actualizar Hooks del Componente
```typescript
// hooks/useGuerrillaEvolution.ts
import { useAppSelector, useAppDispatch } from './redux';
import { setActiveChart, toggleSources, setSourcesVisibility } from '../store/guerrillaEvolutionSlice';

export const useActiveChart = () => 
  useAppSelector((state) => state.guerrillaEvolution.activeChart);

export const useShowSources = () => 
  useAppSelector((state) => state.guerrillaEvolution.showSources);

export const useGuerrillaEvolutionActions = () => {
  const dispatch = useAppDispatch();
  
  return {
    setActiveChart: (chartType: ChartType) => dispatch(setActiveChart(chartType)),
    toggleSources: () => dispatch(toggleSources()),
    setSourcesVisibility: (isVisible: boolean) => dispatch(setSourcesVisibility(isVisible)),
  };
};
```

### 6. Reemplazar Provider
```typescript
// GuerrillaEvolutionWithProvider.tsx
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import GuerrillaEvolutionChart from './GuerrillaEvolutionChart';

const GuerrillaEvolutionWithProvider: React.FC = () => {
  return (
    <Provider store={store}>
      <GuerrillaEvolutionChart />
    </Provider>
  );
};

export default GuerrillaEvolutionWithProvider;
```

## Ventajas de la Migración

### Redux Toolkit vs useReducer + Context

**Redux Toolkit:**
- ✅ Immer integrado (mutación "directa" del estado)
- ✅ DevTools automáticos
- ✅ Middleware configurado (thunk, etc.)
- ✅ Optimizaciones de performance
- ✅ Mejores herramientas de debugging
- ✅ Ecosystem más robusto

**useReducer + Context (actual):**
- ✅ Sin dependencias externas
- ✅ Más simple para casos específicos
- ✅ Menor bundle size
- ✅ Control total sobre la implementación

## Consideraciones de Performance

### Actual (Context)
- Re-renders en todos los componentes que consumen el context cuando cambia cualquier valor
- Solución: Multiple contexts o memoización

### Redux Toolkit
- Re-renders solo en componentes que usan los valores específicos que cambiaron
- Optimizaciones automáticas con react-redux

## Cuándo Migrar

**Migrar cuando:**
- La aplicación crezca significativamente
- Necesites compartir estado entre múltiples componentes lejanos
- Requieras debugging avanzado
- El equipo esté familiarizado con Redux

**Mantener actual cuando:**
- Es un componente aislado
- El equipo prefiere menos dependencias
- La complejidad del estado es mínima
- Performance actual es suficiente

## Testing

### Actual
```typescript
// Fácil testing con provider personalizado
const renderWithProvider = (initialState?: Partial<GuerrillaEvolutionState>) => {
  return render(
    <GuerrillaEvolutionProvider initialStateOverride={initialState}>
      <GuerrillaEvolutionChart />
    </GuerrillaEvolutionProvider>
  );
};
```

### Redux Toolkit
```typescript
// Testing con store mockeado
const renderWithStore = (preloadedState?: Partial<RootState>) => {
  const store = configureStore({
    reducer: { guerrillaEvolution: guerrillaEvolutionReducer },
    preloadedState,
  });
  
  return render(
    <Provider store={store}>
      <GuerrillaEvolutionChart />
    </Provider>
  );
};
```

## Conclusión

La arquitectura actual proporciona una base sólida que hace que la migración a Redux Toolkit sea directa y sin grandes cambios en el componente UI. Los patrones seguidos son consistentes con Redux, lo que facilita la transición cuando sea necesaria.
