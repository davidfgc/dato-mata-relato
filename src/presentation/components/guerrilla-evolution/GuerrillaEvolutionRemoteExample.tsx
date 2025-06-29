import React from 'react';
import { useGuerrillaEvolutionData } from '../../../application/hooks/queries/useGuerrillaEvolutionData';
import { calculateTotalData } from './data';

/**
 * Componente que demuestra cómo usar el hook useGuerrillaEvolutionData
 * para obtener datos de una fuente remota en lugar de datos quemados
 */
const GuerrillaEvolutionRemoteExample: React.FC = () => {
  const { membershipData, territorialData, loading, error, lastUpdated } = useGuerrillaEvolutionData();

  if (loading) {
    return (
      <div className="w-full p-6 bg-white">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6 bg-white">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error al cargar datos</h3>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  const totalData = calculateTotalData(membershipData);
  const latestYear = membershipData[membershipData.length - 1];
  const latestTotal = totalData[totalData.length - 1];

  return (
    <div className="w-full p-6 bg-white">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Datos Remotos - Evolución Guerrillera
        </h2>
        <p className="text-gray-600 text-sm mb-4">
          Datos obtenidos desde fuente remota con fallback a datos locales
        </p>
        
        {lastUpdated && (
          <p className="text-xs text-gray-500 mb-4">
            Última actualización: {new Date(lastUpdated).toLocaleDateString('es-CO')}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Resumen de membresía */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">
            Membresía {latestYear?.año}
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-blue-700">ELN:</span>
              <span className="font-semibold">{latestYear?.ELN.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Disidencias FARC:</span>
              <span className="font-semibold">{latestYear?.['Disidencias FARC'].toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Clan del Golfo:</span>
              <span className="font-semibold">{latestYear?.['Clan del Golfo'].toLocaleString()}</span>
            </div>
            <hr className="my-2 border-blue-200" />
            <div className="flex justify-between font-bold">
              <span className="text-blue-800">Total:</span>
              <span className="text-blue-800">{latestTotal?.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Estadísticas del dataset */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 mb-3">
            Dataset Info
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-green-700">Años de membresía:</span>
              <span className="font-semibold">{membershipData.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">Años territoriales:</span>
              <span className="font-semibold">{territorialData.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-700">Periodo:</span>
              <span className="font-semibold">
                {membershipData[0]?.año} - {membershipData[membershipData.length - 1]?.año}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <h4 className="font-semibold text-yellow-800 mb-2">Implementación:</h4>
        <div className="text-sm text-yellow-700 space-y-1">
          <p>• Los datos se obtienen de <code>/data/guerrilla-evolution.json</code></p>
          <p>• Si la API falla, se usan los datos locales como fallback</p>
          <p>• El hook sigue el mismo patrón que <code>useVotingRecordData</code></p>
          <p>• Estados de loading, error y lastUpdated incluidos</p>
        </div>
      </div>
    </div>
  );
};

export default GuerrillaEvolutionRemoteExample;
