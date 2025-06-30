/**
 * EmploymentDataWithProvider - Wrapper component que incluye el Provider
 * Facilita el uso del componente sin necesidad de envolver manualmente
 */

import React from 'react';
import { EmploymentDataProvider } from './context';
import EmploymentData from './EmploymentData';

/**
 * Componente que encapsula EmploymentData con su Provider
 * Simplifica el uso al exportar un componente auto-contenido
 * 
 * @returns Componente EmploymentData envuelto en su Provider
 */
const EmploymentDataWithProvider: React.FC = () => {
  return (
    <EmploymentDataProvider>
      <EmploymentData />
    </EmploymentDataProvider>
  );
};

export default EmploymentDataWithProvider;
