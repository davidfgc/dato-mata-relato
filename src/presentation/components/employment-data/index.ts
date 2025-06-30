/**
 * Barrel exports para EmploymentData component
 * Facilita las importaciones desde otros módulos
 */

// Componentes principales
export { default as EmploymentData } from './EmploymentDataWithProvider';

// Subcomponentes reutilizables
export { YearFilter } from './YearFilter';

// Context y hooks (para uso avanzado)
export {
  EmploymentDataProvider,
  useActiveChart,
  useEmploymentDataActions,
  useEmploymentDataDispatch,
  useEmploymentDataState,
  useError,
  useFromYear,
  useIsLoading,
  useShowAnalysis,
  useShowSources,
} from './context';

// Tipos (para TypeScript)
export type { ChartViewType, EmploymentDataAction, EmploymentDataState } from './context';

// Datos y funciones utilitarias (para uso avanzado)
export {
  employmentData,
  filterDataFromYear,
  formatTooltip,
  getAvailableYears,
  processPublicEmploymentGrowthData,
  processUnemploymentRateData,
  validateDataIntegrity,
} from './data';

export type { EmploymentDataEntry, PublicEmploymentGrowthEntry, UnemploymentRateEntry } from './data';
