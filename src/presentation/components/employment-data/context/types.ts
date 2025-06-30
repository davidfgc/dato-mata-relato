/**
 * Tipos y interfaces para el estado del EmploymentData component
 * Siguiendo el patrón Redux con TypeScript estricto
 */

/**
 * Tipo para las vistas disponibles del chart
 */
export type ChartViewType = 'unemployment' | 'publicEmploymentGrowth';

/**
 * Interface para el estado del componente EmploymentData
 */
export interface EmploymentDataState {
  /** Vista activa del chart */
  activeChart: ChartViewType;
  /** Año inicial para filtrado de datos */
  fromYear: number;
  /** Visibilidad de la sección de análisis detallado */
  showAnalysis: boolean;
  /** Visibilidad de las fuentes de información */
  showSources: boolean;
  /** Estado de carga */
  isLoading: boolean;
  /** Error en caso de fallo */
  error: string | null;
  /** Fecha de última actualización de datos */
  dataLastUpdated: Date | null;
}

/**
 * Estado inicial del componente
 */
export const initialState: EmploymentDataState = {
  activeChart: 'unemployment',
  fromYear: 2002,
  showAnalysis: false,
  showSources: false,
  isLoading: false,
  error: null,
  dataLastUpdated: new Date(),
};
