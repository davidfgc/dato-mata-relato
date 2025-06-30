import { useEffect, useState } from 'react';
import { EmploymentDataEntry, UnemploymentRateEntry, PublicEmploymentGrowthEntry } from '../../../domain/employment';
import { fetchEmploymentData } from '../../../infrastructure/api/api';
import { EmploymentService } from '../../../domain/services/employment.service';

/**
 * Hook para obtener datos de empleo de una fuente remota
 * Sigue el mismo patrón que useGuerrillaEvolutionData.ts pero usa la lógica del dominio de empleo
 */
export const useEmploymentData = () => {
  const [employmentData, setEmploymentData] = useState<EmploymentDataEntry[]>([]);
  const [unemploymentData, setUnemploymentData] = useState<UnemploymentRateEntry[]>([]);
  const [publicEmploymentGrowthData, setPublicEmploymentGrowthData] = useState<PublicEmploymentGrowthEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Usar la función de API centralizada
        const data = await fetchEmploymentData();

        // Transformar usando el servicio del dominio
        const { employmentData: domainEmployment } = EmploymentService.transformApiResponse(data);

        // Convertir a formato de presentación para compatibilidad
        const presentationEmployment = EmploymentService.transformToChartFormat(domainEmployment);
        
        // Procesar los datos para gráficos específicos
        const processedUnemploymentData = EmploymentService.processUnemploymentRateData(presentationEmployment);
        const processedPublicEmploymentData = EmploymentService.processPublicEmploymentGrowthData(presentationEmployment);

        setEmploymentData(presentationEmployment);
        setUnemploymentData(processedUnemploymentData);
        setPublicEmploymentGrowthData(processedPublicEmploymentData);
        setLastUpdated(data.lastUpdated || null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar datos de empleo';
        setError(errorMessage);
        console.error('Error fetching employment data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    employmentData,
    unemploymentData,
    publicEmploymentGrowthData,
    loading,
    error,
    lastUpdated,
  };
};
