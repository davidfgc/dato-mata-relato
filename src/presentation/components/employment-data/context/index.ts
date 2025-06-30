/**
 * Barrel exports para facilitar las importaciones del context
 * Siguiendo convenciones Redux para organización de código
 */

// Provider Component
export { EmploymentDataProvider } from './EmploymentDataContext';

// Custom Hooks
export {
  useEmploymentDataState,
  useEmploymentDataDispatch,
  useActiveChart,
  useFromYear,
  useShowAnalysis,
  useShowSources,
  useIsLoading,
  useError,
  useDataLastUpdated,
  useEmploymentDataActions,
} from './hooks';

// Types (para TypeScript)
export type { ChartViewType, EmploymentDataState } from './types';

export type { EmploymentDataAction } from './actions';

// Action Creators y Types
export { 
  employmentDataActions, 
  EMPLOYMENT_DATA_ACTION_TYPES 
} from './actions';

// Selectors (para uso avanzado)
export { 
  selectActiveChart,
  selectFromYear,
  selectShowAnalysis,
  selectShowSources,
  selectIsLoading,
  selectError,
  selectDataLastUpdated,
} from './reducer';
