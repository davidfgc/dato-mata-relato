/**
 * Barrel exports para facilitar las importaciones
 * Siguiendo convenciones Redux para organización de código
 */

// Provider Component
export { GuerrillaEvolutionProvider } from './GuerrillaEvolutionContext';

// Custom Hooks
export {
  useGuerrillaEvolution,
  useGuerrillaEvolutionDispatch,
  useGuerrillaEvolutionState,
  useActiveChart,
  useShowSources,
  useShowKeyData,
  useShowResearchSources,
  useShowTotalAnalysis,
  useGuerrillaEvolutionActions,
} from './hooks';

// Types (para TypeScript)
export type { ChartType, GuerrillaEvolutionState, GuerrillaEvolutionAction } from './types';

// Action Creators y Types
export { guerrillaEvolutionActions, GUERRILLA_EVOLUTION_ACTION_TYPES } from './actions';

// Selectors (para uso avanzado)
export { selectActiveChart, selectShowKeyData, selectShowResearchSources, selectShowTotalAnalysis } from './reducer';
