/**
 * Custom hooks para acceder al estado y acciones del EmploymentData component
 * Siguiendo el patrón Redux con hooks granulares y tipados
 */

import { useContext, useMemo } from 'react';
import { EmploymentDataStateContext, EmploymentDataDispatchContext } from './context';
import { employmentDataActions } from './actions';
import {
  selectActiveChart,
  selectFromYear,
  selectShowAnalysis,
  selectShowSources,
  selectIsLoading,
  selectError,
  selectDataLastUpdated,
} from './reducer';

/**
 * Hook para acceder al estado completo
 * @returns Estado completo del componente
 * @throws Error si se usa fuera del Provider
 */
export const useEmploymentDataState = () => {
  const context = useContext(EmploymentDataStateContext);
  if (context === undefined) {
    throw new Error('useEmploymentDataState must be used within an EmploymentDataProvider');
  }
  return context;
};

/**
 * Hook para acceder al dispatch
 * @returns Función dispatch para ejecutar acciones
 * @throws Error si se usa fuera del Provider
 */
export const useEmploymentDataDispatch = () => {
  const context = useContext(EmploymentDataDispatchContext);
  if (context === undefined) {
    throw new Error('useEmploymentDataDispatch must be used within an EmploymentDataProvider');
  }
  return context;
};

/**
 * Hook granular para la vista activa del chart
 * @returns Vista activa del chart
 */
export const useActiveChart = () => {
  const state = useEmploymentDataState();
  return selectActiveChart(state);
};

/**
 * Hook granular para el año inicial del filtro
 * @returns Año inicial del filtro
 */
export const useFromYear = () => {
  const state = useEmploymentDataState();
  return selectFromYear(state);
};

/**
 * Hook granular para la visibilidad del análisis
 * @returns Boolean indicando si el análisis está visible
 */
export const useShowAnalysis = () => {
  const state = useEmploymentDataState();
  return selectShowAnalysis(state);
};

/**
 * Hook granular para la visibilidad de las fuentes
 * @returns Boolean indicando si las fuentes están visibles
 */
export const useShowSources = () => {
  const state = useEmploymentDataState();
  return selectShowSources(state);
};

/**
 * Hook granular para el estado de carga
 * @returns Boolean indicando si está cargando
 */
export const useIsLoading = () => {
  const state = useEmploymentDataState();
  return selectIsLoading(state);
};

/**
 * Hook granular para el error actual
 * @returns String con el error o null
 */
export const useError = () => {
  const state = useEmploymentDataState();
  return selectError(state);
};

/**
 * Hook granular para la fecha de última actualización
 * @returns Date de última actualización o null
 */
export const useDataLastUpdated = () => {
  const state = useEmploymentDataState();
  return selectDataLastUpdated(state);
};

/**
 * Hook para acceder a todas las acciones disponibles
 * Memorizadas para evitar re-renders innecesarios
 * @returns Objeto con todas las funciones de acción
 */
export const useEmploymentDataActions = () => {
  const dispatch = useEmploymentDataDispatch();
  
  return useMemo(() => ({
    /**
     * Establece la vista activa del chart
     * @param chartType - Tipo de chart a mostrar
     */
    setActiveChart: (chartType: Parameters<typeof employmentDataActions.setActiveChart>[0]) =>
      dispatch(employmentDataActions.setActiveChart(chartType)),

    /**
     * Establece el año inicial para filtrado
     * @param year - Año inicial
     */
    setFromYear: (year: number) =>
      dispatch(employmentDataActions.setFromYear(year)),

    /**
     * Toggle para mostrar/ocultar análisis detallado
     */
    toggleAnalysis: () =>
      dispatch(employmentDataActions.toggleAnalysis()),

    /**
     * Toggle para mostrar/ocultar fuentes de información
     */
    toggleSources: () =>
      dispatch(employmentDataActions.toggleSources()),

    /**
     * Establece el estado de carga
     * @param isLoading - Estado de carga
     */
    setLoading: (isLoading: boolean) =>
      dispatch(employmentDataActions.setLoading(isLoading)),

    /**
     * Establece un error
     * @param error - Mensaje de error
     */
    setError: (error: string) =>
      dispatch(employmentDataActions.setError(error)),

    /**
     * Limpia el error actual
     */
    clearError: () =>
      dispatch(employmentDataActions.clearError()),
  }), [dispatch]);
};
