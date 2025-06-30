/**
 * Context definitions para EmploymentData component
 * Separado del Provider para cumplir con Fast Refresh
 */

import React, { createContext } from 'react';
import type { EmploymentDataState } from './types';
import type { EmploymentDataAction } from './actions';

/**
 * Context para el estado del componente
 */
export const EmploymentDataStateContext = createContext<EmploymentDataState | undefined>(undefined);

/**
 * Context para el dispatch de acciones
 */
export const EmploymentDataDispatchContext = createContext<React.Dispatch<EmploymentDataAction> | undefined>(undefined);
