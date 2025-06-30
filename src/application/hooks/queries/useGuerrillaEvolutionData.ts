import { useEffect, useState } from 'react';
import { MembershipDataEntry, TerritorialDataEntry } from '../../../domain/guerrilla-group';
import { fetchGuerrillaEvolutionData } from '../../../infrastructure/api/api';
import { GuerrillaEvolutionService } from '../../../domain/services/guerrilla-evolution.service';

/**
 * Hook para obtener datos de evolución guerrillera de una fuente remota
 * Sigue el mismo patrón que useVotingRecordData.ts pero usa la lógica del dominio
 */
export const useGuerrillaEvolutionData = () => {
  const [membershipData, setMembershipData] = useState<MembershipDataEntry[]>([]);
  const [territorialData, setTerritorialData] = useState<TerritorialDataEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Usar la función de API centralizada
        const data = await fetchGuerrillaEvolutionData();

        // Transformar usando el servicio del dominio
        const { membershipData: domainMembership, territorialData: domainTerritorial } =
          GuerrillaEvolutionService.transformApiResponse(data);

        // Convertir a formato de presentación para compatibilidad
        const presentationMembership = GuerrillaEvolutionService.transformToChartFormat(domainMembership);
        const presentationTerritorial = GuerrillaEvolutionService.transformTerritorialToChartFormat(domainTerritorial);

        setMembershipData(presentationMembership);
        setTerritorialData(presentationTerritorial);
        setLastUpdated(data.lastUpdated || null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar datos';
        setError(errorMessage);
        console.error('Error fetching guerrilla evolution data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    membershipData,
    territorialData,
    loading,
    error,
    lastUpdated,
  };
};