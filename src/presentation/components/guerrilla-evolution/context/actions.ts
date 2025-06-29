// Action Types
export const GUERRILLA_EVOLUTION_ACTION_TYPES = {
  SET_ACTIVE_CHART: 'SET_ACTIVE_CHART',
  TOGGLE_KEY_DATA: 'TOGGLE_KEY_DATA',
  TOGGLE_RESEARCH_SOURCES: 'TOGGLE_RESEARCH_SOURCES',
  TOGGLE_TOTAL_ANALYSIS: 'TOGGLE_TOTAL_ANALYSIS',
} as const;

// Types
export type ChartType = 'total' | 'miembros' | 'territorial';

export type GuerrillaEvolutionAction =
  | { type: typeof GUERRILLA_EVOLUTION_ACTION_TYPES.SET_ACTIVE_CHART; payload: ChartType }
  | { type: typeof GUERRILLA_EVOLUTION_ACTION_TYPES.TOGGLE_KEY_DATA }
  | { type: typeof GUERRILLA_EVOLUTION_ACTION_TYPES.TOGGLE_RESEARCH_SOURCES }
  | { type: typeof GUERRILLA_EVOLUTION_ACTION_TYPES.TOGGLE_TOTAL_ANALYSIS };

// Action Creators
export const guerrillaEvolutionActions = {
  setActiveChart: (chartType: ChartType): GuerrillaEvolutionAction => ({
    type: GUERRILLA_EVOLUTION_ACTION_TYPES.SET_ACTIVE_CHART,
    payload: chartType,
  }),

  toggleKeyData: (): GuerrillaEvolutionAction => ({
    type: GUERRILLA_EVOLUTION_ACTION_TYPES.TOGGLE_KEY_DATA,
  }),

  toggleResearchSources: (): GuerrillaEvolutionAction => ({
    type: GUERRILLA_EVOLUTION_ACTION_TYPES.TOGGLE_RESEARCH_SOURCES,
  }),

  toggleTotalAnalysis: (): GuerrillaEvolutionAction => ({
    type: GUERRILLA_EVOLUTION_ACTION_TYPES.TOGGLE_TOTAL_ANALYSIS,
  }),
};
