/**
 * Action types y action creators para EmploymentData component
 * Siguiendo el patrón Redux con TypeScript estricto
 */

import type { ChartViewType } from './types';

/**
 * Constantes para los tipos de acciones
 */
export const EMPLOYMENT_DATA_ACTION_TYPES = {
  SET_ACTIVE_CHART: 'SET_ACTIVE_CHART',
  SET_FROM_YEAR: 'SET_FROM_YEAR',
  TOGGLE_ANALYSIS: 'TOGGLE_ANALYSIS',
  TOGGLE_SOURCES: 'TOGGLE_SOURCES',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
} as const;

/**
 * Union type para todas las acciones posibles
 */
export type EmploymentDataAction =
  | { type: typeof EMPLOYMENT_DATA_ACTION_TYPES.SET_ACTIVE_CHART; payload: ChartViewType }
  | { type: typeof EMPLOYMENT_DATA_ACTION_TYPES.SET_FROM_YEAR; payload: number }
  | { type: typeof EMPLOYMENT_DATA_ACTION_TYPES.TOGGLE_ANALYSIS }
  | { type: typeof EMPLOYMENT_DATA_ACTION_TYPES.TOGGLE_SOURCES }
  | { type: typeof EMPLOYMENT_DATA_ACTION_TYPES.SET_LOADING; payload: boolean }
  | { type: typeof EMPLOYMENT_DATA_ACTION_TYPES.SET_ERROR; payload: string }
  | { type: typeof EMPLOYMENT_DATA_ACTION_TYPES.CLEAR_ERROR };

/**
 * Action creators siguiendo el patrón Redux
 */
export const employmentDataActions = {
  /**
   * Establece la vista activa del chart
   * @param chartType - Tipo de chart a mostrar
   */
  setActiveChart: (chartType: ChartViewType): EmploymentDataAction => ({
    type: EMPLOYMENT_DATA_ACTION_TYPES.SET_ACTIVE_CHART,
    payload: chartType,
  }),

  /**
   * Establece el año inicial para filtrado
   * @param year - Año inicial
   */
  setFromYear: (year: number): EmploymentDataAction => ({
    type: EMPLOYMENT_DATA_ACTION_TYPES.SET_FROM_YEAR,
    payload: year,
  }),

  /**
   * Toggle para mostrar/ocultar análisis detallado
   */
  toggleAnalysis: (): EmploymentDataAction => ({
    type: EMPLOYMENT_DATA_ACTION_TYPES.TOGGLE_ANALYSIS,
  }),

  /**
   * Toggle para mostrar/ocultar fuentes de información
   */
  toggleSources: (): EmploymentDataAction => ({
    type: EMPLOYMENT_DATA_ACTION_TYPES.TOGGLE_SOURCES,
  }),

  /**
   * Establece el estado de carga
   * @param isLoading - Estado de carga
   */
  setLoading: (isLoading: boolean): EmploymentDataAction => ({
    type: EMPLOYMENT_DATA_ACTION_TYPES.SET_LOADING,
    payload: isLoading,
  }),

  /**
   * Establece un error
   * @param error - Mensaje de error
   */
  setError: (error: string): EmploymentDataAction => ({
    type: EMPLOYMENT_DATA_ACTION_TYPES.SET_ERROR,
    payload: error,
  }),

  /**
   * Limpia el error actual
   */
  clearError: (): EmploymentDataAction => ({
    type: EMPLOYMENT_DATA_ACTION_TYPES.CLEAR_ERROR,
  }),
};
