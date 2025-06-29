import { useContext } from 'react';
import { GuerrillaEvolutionContext, GuerrillaEvolutionContextType } from './context';

/**
 * Hook para consumir el contexto
 * Incluye validación para asegurar uso dentro del Provider
 */
export const useGuerrillaEvolutionContext = (): GuerrillaEvolutionContextType => {
  const context = useContext(GuerrillaEvolutionContext);
  
  if (context === undefined) {
    throw new Error(
      'useGuerrillaEvolutionContext must be used within a GuerrillaEvolutionProvider'
    );
  }
  
  return context;
};
