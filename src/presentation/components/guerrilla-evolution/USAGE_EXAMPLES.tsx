/**
 * Ejemplo de uso del componente GuerrillaEvolutionChart refactorizado
 * 
 * Este ejemplo muestra diferentes formas de usar el componente:
 * 1. Uso simple (recomendado)
 * 2. Uso con Provider personalizado
 * 3. Uso con estado inicial personalizado
 */

import React from 'react';
import { 
  GuerrillaEvolutionChart,           // Componente con Provider incluido
  GuerrillaEvolutionChartCore,       // Componente sin Provider
  GuerrillaEvolutionProvider,        // Provider manual
  useGuerrillaEvolutionActions,      // Hook para actions
  useActiveChart,                    // Hook para valor específico
} from './index';

// 1. USO SIMPLE (RECOMENDADO)
export const ExampleSimple: React.FC = () => {
  return (
    <div>
      <h1>Evolución de Grupos Guerrilleros</h1>
      {/* El componente incluye su propio Provider */}
      <GuerrillaEvolutionChart />
    </div>
  );
};

// 2. USO CON PROVIDER PERSONALIZADO
export const ExampleWithCustomProvider: React.FC = () => {
  return (
    <GuerrillaEvolutionProvider>
      <div>
        <h1>Dashboard de Análisis</h1>
        
        {/* Componente personalizado que usa el estado */}
        <CustomControls />
        
        {/* Componente principal sin Provider propio */}
        <GuerrillaEvolutionChartCore />
      </div>
    </GuerrillaEvolutionProvider>
  );
};

// Componente personalizado que consume el contexto
const CustomControls: React.FC = () => {
  const activeChart = useActiveChart();
  const { setActiveChart } = useGuerrillaEvolutionActions();

  return (
    <div className="mb-4 p-4 bg-gray-100 rounded">
      <h3>Controles Personalizados</h3>
      <p>Gráfico activo: <strong>{activeChart}</strong></p>
      <div className="flex gap-2 mt-2">
        <button 
          onClick={() => setActiveChart('total')}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
        >
          Total
        </button>
        <button 
          onClick={() => setActiveChart('miembros')}
          className="px-3 py-1 bg-green-500 text-white rounded text-sm"
        >
          Por Grupo
        </button>
        <button 
          onClick={() => setActiveChart('territorial')}
          className="px-3 py-1 bg-purple-500 text-white rounded text-sm"
        >
          Territorial
        </button>
      </div>
    </div>
  );
};

// 3. USO CON ESTADO INICIAL PERSONALIZADO
export const ExampleWithInitialState: React.FC = () => {
  return (
    <GuerrillaEvolutionProvider 
      initialStateOverride={{ 
        activeChart: 'territorial',  // Inicia con gráfico territorial
        showSources: true           // Fuentes visibles por defecto
      }}
    >
      <div>
        <h1>Análisis Territorial - Vista Predeterminada</h1>
        <GuerrillaEvolutionChartCore />
      </div>
    </GuerrillaEvolutionProvider>
  );
};

// EJEMPLO DE TESTING
export const ExampleForTesting: React.FC = () => {
  // Para testing, puedes usar el Provider con estado inicial controlado
  const testInitialState = {
    activeChart: 'miembros' as const,
    showSources: false
  };

  return (
    <GuerrillaEvolutionProvider initialStateOverride={testInitialState}>
      <GuerrillaEvolutionChartCore />
    </GuerrillaEvolutionProvider>
  );
};
