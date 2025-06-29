import { useEffect, useState } from 'react';
import { MembershipDataEntry, TerritorialDataEntry } from '../../../presentation/components/guerrilla-evolution/data';
import { fetchGuerrillaEvolutionData } from '../../../infrastructure/api/api';

/**
 * Hook para obtener datos de evolución guerrillera de una fuente remota
 * Sigue el mismo patrón que useVotingRecordData.ts
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

        setMembershipData(data.membershipData || []);
        setTerritorialData(data.territorialData || []);
        setLastUpdated(data.lastUpdated || null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar datos';
        setError(errorMessage);
        console.error('Error fetching guerrilla evolution data:', err);
        
        // Fallback a datos locales si la API falla
        try {
          const { membershipData: fallbackMembership, territorialData: fallbackTerritorial } = 
            await import('../../../presentation/components/guerrilla-evolution/data');
          setMembershipData(fallbackMembership);
          setTerritorialData(fallbackTerritorial);
        } catch (fallbackError) {
          console.error('Error loading fallback data:', fallbackError);
        }
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