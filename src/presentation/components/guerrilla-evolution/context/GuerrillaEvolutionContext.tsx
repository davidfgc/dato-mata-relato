import React, { useReducer, ReactNode } from 'react';
import { 
  GuerrillaEvolutionState, 
  initialState 
} from './types';
import { guerrillaEvolutionReducer } from './reducer';
import { GuerrillaEvolutionContext, GuerrillaEvolutionContextType } from './context';

/**
 * Provider Props
 */
interface GuerrillaEvolutionProviderProps {
  children: ReactNode;
  initialStateOverride?: Partial<GuerrillaEvolutionState>;
}

/**
 * Context Provider Component
 * Maneja el estado usando useReducer (patrón Redux)
 */
export const GuerrillaEvolutionProvider: React.FC<GuerrillaEvolutionProviderProps> = ({ 
  children, 
  initialStateOverride 
}) => {
  // Permitimos override del estado inicial para testing o diferentes configuraciones
  const mergedInitialState: GuerrillaEvolutionState = {
    ...initialState,
    ...initialStateOverride,
  };

  const [state, dispatch] = useReducer(guerrillaEvolutionReducer, mergedInitialState);

  const contextValue: GuerrillaEvolutionContextType = {
    state,
    dispatch,
  };

  return (
    <GuerrillaEvolutionContext.Provider value={contextValue}>
      {children}
    </GuerrillaEvolutionContext.Provider>
  );
};
