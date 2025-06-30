/**
 * Reducer puro y selectors para EmploymentData component
 * Siguiendo el patrón Redux con TypeScript estricto
 */

import { EMPLOYMENT_DATA_ACTION_TYPES } from './actions';
import type { EmploymentDataAction } from './actions';
import type { EmploymentDataState } from './types';

/**
 * Reducer puro para manejar el estado del componente
 * @param state - Estado actual
 * @param action - Acción a procesar
 * @returns Nuevo estado
 */
export const employmentDataReducer = (
  state: EmploymentDataState,
  action: EmploymentDataAction
): EmploymentDataState => {
  switch (action.type) {
    case EMPLOYMENT_DATA_ACTION_TYPES.SET_ACTIVE_CHART:
      return {
        ...state,
        activeChart: action.payload,
        error: null, // Clear error when changing view
      };

    case EMPLOYMENT_DATA_ACTION_TYPES.SET_FROM_YEAR:
      return {
        ...state,
        fromYear: action.payload,
        error: null,
      };

    case EMPLOYMENT_DATA_ACTION_TYPES.TOGGLE_ANALYSIS:
      return {
        ...state,
        showAnalysis: !state.showAnalysis,
      };

    case EMPLOYMENT_DATA_ACTION_TYPES.TOGGLE_SOURCES:
      return {
        ...state,
        showSources: !state.showSources,
      };

    case EMPLOYMENT_DATA_ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
        error: action.payload ? null : state.error, // Clear error when starting to load
      };

    case EMPLOYMENT_DATA_ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case EMPLOYMENT_DATA_ACTION_TYPES.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

/**
 * Selectors para acceso tipado y optimizado al estado
 * Estas funciones permiten acceder a partes específicas del estado
 */

/** Selector para la vista activa del chart */
export const selectActiveChart = (state: EmploymentDataState) => state.activeChart;

/** Selector para el año inicial del filtro */
export const selectFromYear = (state: EmploymentDataState) => state.fromYear;

/** Selector para la visibilidad del análisis */
export const selectShowAnalysis = (state: EmploymentDataState) => state.showAnalysis;

/** Selector para la visibilidad de las fuentes */
export const selectShowSources = (state: EmploymentDataState) => state.showSources;

/** Selector para el estado de carga */
export const selectIsLoading = (state: EmploymentDataState) => state.isLoading;

/** Selector para el error actual */
export const selectError = (state: EmploymentDataState) => state.error;

/** Selector para la fecha de última actualización */
export const selectDataLastUpdated = (state: EmploymentDataState) => state.dataLastUpdated;
