import { 
  GuerrillaEvolutionState, 
  GuerrillaEvolutionAction, 
  GUERRILLA_ACTION_TYPES,
  initialState 
} from './types';

/**
 * Reducer siguiendo convenciones Redux
 * - Puro: no muta el estado original
 * - Determinístico: misma entrada = misma salida
 * - Sin efectos secundarios
 * - Manejo inmutable del estado (sin Immer por ahora)
 */
export const guerrillaEvolutionReducer = (
  state: GuerrillaEvolutionState = initialState,
  action: GuerrillaEvolutionAction
): GuerrillaEvolutionState => {
  switch (action.type) {
    case GUERRILLA_ACTION_TYPES.SET_ACTIVE_CHART:
      return {
        ...state,
        activeChart: action.payload,
      };

    case GUERRILLA_ACTION_TYPES.TOGGLE_KEY_DATA:
      return {
        ...state,
        showKeyData: !state.showKeyData,
      };

    case GUERRILLA_ACTION_TYPES.TOGGLE_RESEARCH_SOURCES:
      return {
        ...state,
        showResearchSources: !state.showResearchSources,
      };

    case GUERRILLA_ACTION_TYPES.TOGGLE_TOTAL_ANALYSIS:
      return {
        ...state,
        showTotalAnalysis: !state.showTotalAnalysis,
      };

    default:
      // En Redux, siempre retornamos el estado actual si no hay match
      return state;
  }
};

/**
 * Selector functions - siguiendo patrón Redux
 * Estas funciones extraen datos específicos del state
 * Facilitan la futura migración a Redux Toolkit (reselect)
 */
export const selectActiveChart = (state: GuerrillaEvolutionState) => state.activeChart;
export const selectShowKeyData = (state: GuerrillaEvolutionState) => state.showKeyData;
export const selectShowResearchSources = (state: GuerrillaEvolutionState) => state.showResearchSources;
export const selectShowTotalAnalysis = (state: GuerrillaEvolutionState) => state.showTotalAnalysis;
