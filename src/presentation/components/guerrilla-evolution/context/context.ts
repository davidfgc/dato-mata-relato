import React, { createContext } from 'react';
import { 
  GuerrillaEvolutionState, 
  GuerrillaEvolutionAction 
} from './types';

/**
 * Context Interface - incluye state y dispatch
 * Siguiendo patrón Redux donde el dispatch está disponible para enviar actions
 */
export interface GuerrillaEvolutionContextType {
  state: GuerrillaEvolutionState;
  dispatch: React.Dispatch<GuerrillaEvolutionAction>;
}

/**
 * Context creation
 * Iniciamos como undefined para forzar el uso dentro del Provider
 */
export const GuerrillaEvolutionContext = createContext<GuerrillaEvolutionContextType | undefined>(
  undefined
);
