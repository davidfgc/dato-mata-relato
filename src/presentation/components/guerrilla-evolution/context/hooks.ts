import { useGuerrillaEvolutionContext } from './contextHook';
import { selectActiveChart, selectShowKeyData, selectShowResearchSources, selectShowTotalAnalysis } from './reducer';
import { guerrillaEvolutionActions, type ChartType } from './actions';

/**
 * Custom hooks para consumir el contexto de manera específica
 * Siguiendo el patrón Redux de hooks especializados
 * Facilita la futura migración a Redux Toolkit
 *
 * BREAKING CHANGE (v2.0.0):
 * - useShowSources() is deprecated, use useShowKeyData() or useShowResearchSources()
 * - toggleSources() is deprecated, use toggleKeyData() or toggleResearchSources()
 * - Now supports independent control of two collapsible sections:
 *   1. Key Data (Datos Clave) - controlled by showKeyData/toggleKeyData
 *   2. Research Sources (Fuentes de Investigación) - controlled by showResearchSources/toggleResearchSources
 */

/**
 * Hook principal para acceder al contexto completo
 */
export const useGuerrillaEvolution = () => {
  return useGuerrillaEvolutionContext();
};

/**
 * Hook para obtener solo el dispatch
 * Útil cuando solo necesitamos enviar actions
 */
export const useGuerrillaEvolutionDispatch = () => {
  const { dispatch } = useGuerrillaEvolutionContext();
  return dispatch;
};

/**
 * Hook para obtener solo el state
 * Útil cuando solo necesitamos leer datos
 */
export const useGuerrillaEvolutionState = () => {
  const { state } = useGuerrillaEvolutionContext();
  return state;
};

/**
 * Hooks especializados para valores específicos del state
 * Siguiendo patrón Redux con selectores
 */
export const useActiveChart = () => {
  const state = useGuerrillaEvolutionState();
  return selectActiveChart(state);
};

export const useShowSources = () => {
  const state = useGuerrillaEvolutionState();
  // Backward compatibility: returns showKeyData for now
  // TODO: Deprecate this in favor of useShowKeyData and useShowResearchSources
  return selectShowKeyData(state);
};

export const useShowKeyData = () => {
  const state = useGuerrillaEvolutionState();
  return selectShowKeyData(state);
};

export const useShowResearchSources = () => {
  const state = useGuerrillaEvolutionState();
  return selectShowResearchSources(state);
};

export const useShowTotalAnalysis = () => {
  const state = useGuerrillaEvolutionState();
  return selectShowTotalAnalysis(state);
};

/**
 * Hook que combina actions con dispatch para mayor comodidad
 * Ahora usa los action creators de actions.ts
 */
export const useGuerrillaEvolutionActions = () => {
  const dispatch = useGuerrillaEvolutionDispatch();

  return {
    setActiveChart: (chartType: ChartType) => dispatch(guerrillaEvolutionActions.setActiveChart(chartType)),
    toggleKeyData: () => dispatch(guerrillaEvolutionActions.toggleKeyData()),
    toggleResearchSources: () => dispatch(guerrillaEvolutionActions.toggleResearchSources()),
    toggleTotalAnalysis: () => dispatch(guerrillaEvolutionActions.toggleTotalAnalysis()),
    // Backwards compatibility - will be removed later
    toggleSources: () => dispatch(guerrillaEvolutionActions.toggleKeyData()),
  };
};
