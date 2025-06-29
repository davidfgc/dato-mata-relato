// Re-export from actions.ts to maintain single source of truth
import type { ChartType } from './actions';

export {
  GUERRILLA_EVOLUTION_ACTION_TYPES as GUERRILLA_ACTION_TYPES,
  guerrillaEvolutionActions,
  type ChartType,
  type GuerrillaEvolutionAction,
} from './actions';

// State Interface
export interface GuerrillaEvolutionState {
  activeChart: ChartType;
  showKeyData: boolean;
  showResearchSources: boolean;
  showTotalAnalysis: boolean;
  fromYear: number;
}

// Initial State
export const initialState: GuerrillaEvolutionState = {
  activeChart: 'total',
  showKeyData: false,
  showResearchSources: false,
  showTotalAnalysis: false,
  fromYear: 2000, // Año inicial por defecto
};
