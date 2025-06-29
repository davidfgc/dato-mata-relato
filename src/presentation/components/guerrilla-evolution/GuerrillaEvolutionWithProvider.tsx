import React from 'react';
import { GuerrillaEvolutionProvider } from './context';
import GuerrillaEvolutionChart from './GuerrillaEvolutionChart';

/**
 * Componente wrapper que provee el contexto Redux pattern
 * Esta arquitectura facilita la futura migración a Redux Toolkit:
 * 1. Solo necesitaremos cambiar el Provider por el Redux Provider
 * 2. Los hooks personalizados pueden ser reemplazados por useSelector/useDispatch
 * 3. Los action creators ya están listos
 * 4. El reducer sigue las convenciones Redux
 */
const GuerrillaEvolutionWithProvider: React.FC = () => {
  return (
    <GuerrillaEvolutionProvider>
      <GuerrillaEvolutionChart />
    </GuerrillaEvolutionProvider>
  );
};

export default GuerrillaEvolutionWithProvider;
