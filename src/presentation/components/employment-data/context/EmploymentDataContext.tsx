/**
 * Context Provider para EmploymentData component
 * Implementa el patrón Redux con useReducer y Context API
 */

import React, { useReducer, type ReactNode } from 'react';
import { employmentDataReducer } from './reducer';
import { initialState } from './types';
import { EmploymentDataStateContext, EmploymentDataDispatchContext } from './context';

/**
 * Props para el Provider
 */
interface EmploymentDataProviderProps {
  children: ReactNode;
}

/**
 * Provider que encapsula el estado y dispatch del componente
 * Siguiendo el patrón Redux con useReducer
 * 
 * @param props - Props del componente
 * @returns Provider component
 */
export const EmploymentDataProvider: React.FC<EmploymentDataProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(employmentDataReducer, initialState);

  return (
    <EmploymentDataStateContext.Provider value={state}>
      <EmploymentDataDispatchContext.Provider value={dispatch}>
        {children}
      </EmploymentDataDispatchContext.Provider>
    </EmploymentDataStateContext.Provider>
  );
};
