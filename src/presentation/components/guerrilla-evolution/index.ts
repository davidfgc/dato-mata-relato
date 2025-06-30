/**
 * Guerrilla Evolution Chart Module
 * 
 * Módulo completo que implementa el patrón Redux usando useReducer + Context
 * Preparado para futura migración a Redux Toolkit
 * 
 * Exporta:
 * - Componente principal con Provider incluido (recomendado)
 * - Componente sin Provider (para uso con Provider externo)
 * - Context y hooks (para uso avanzado)
 * - Datos y utilidades
 */

// Componente principal recomendado (incluye Provider)
export { default as GuerrillaEvolutionChart } from './GuerrillaEvolutionWithProvider';

// Context y Provider para uso manual
export {
  GuerrillaEvolutionProvider,
  useGuerrillaEvolution,
  useGuerrillaEvolutionActions,
  useActiveChart,
  useShowSources,
  useShowKeyData,
  useShowResearchSources,
  type ChartType,
  type GuerrillaEvolutionState,
} from './context';

// Datos y utilidades
export { type MembershipDataEntry, type TerritorialDataEntry } from '../../../domain/guerrilla-group';
