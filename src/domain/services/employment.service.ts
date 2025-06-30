import { 
  EmploymentRecord, 
  EmploymentDataEntry,
  UnemploymentRateEntry,
  PublicEmploymentGrowthEntry 
} from '../employment';

/**
 * API response format types
 */
interface ApiEmploymentEntry {
  año: number;
  poblacion_ocupada_total_miles?: number;
  sector_publico_total_miles?: number;
  sector_publico_nacional_miles?: number;
  sector_publico_territorial_miles?: number;
  sector_privado_derivado_miles?: number;
  tasa_ocupacion_formal?: number;
  tasa_ocupacion_informal?: number;
  tasa_global_participacion?: number;
  tasa_desocupacion?: number;
}

interface ApiResponse {
  employmentData?: ApiEmploymentEntry[];
  lastUpdated?: string;
  metadata?: {
    sources: string[];
    methodology: string;
  };
}

/**
 * Union types for compatibility with existing code
 */

/**
 * Domain service for employment data analysis
 * Contains pure business logic functions
 */
export class EmploymentService {
  /**
   * Transforms API response to domain entities
   */
  static transformApiResponse(apiResponse: ApiResponse): { employmentData: EmploymentRecord[] } {
    const employmentData = (apiResponse.employmentData || []).map(entry => ({
      year: entry.año,
      totalOccupiedPopulation: entry.poblacion_ocupada_total_miles,
      totalPublicSector: entry.sector_publico_total_miles,
      nationalPublicSector: entry.sector_publico_nacional_miles,
      territorialPublicSector: entry.sector_publico_territorial_miles,
      privateSectorDerived: entry.sector_privado_derivado_miles,
      formalOccupationRate: entry.tasa_ocupacion_formal,
      informalOccupationRate: entry.tasa_ocupacion_informal,
      globalParticipationRate: entry.tasa_global_participacion,
      unemploymentRate: entry.tasa_desocupacion,
    }));

    return { employmentData };
  }

  /**
   * Transforms domain entities to chart format for presentation layer
   */
  static transformToChartFormat(employmentData: EmploymentRecord[]): EmploymentDataEntry[] {
    return employmentData.map(record => ({
      año: record.year,
      poblacion_ocupada_total_miles: record.totalOccupiedPopulation,
      sector_publico_total_miles: record.totalPublicSector,
      sector_publico_nacional_miles: record.nationalPublicSector,
      sector_publico_territorial_miles: record.territorialPublicSector,
      sector_privado_derivado_miles: record.privateSectorDerived,
      tasa_ocupacion_formal: record.formalOccupationRate,
      tasa_ocupacion_informal: record.informalOccupationRate,
      tasa_global_participacion: record.globalParticipationRate,
      tasa_desocupacion: record.unemploymentRate,
    }));
  }

  /**
   * Processes unemployment rate data from employment records
   */
  static processUnemploymentRateData(data: EmploymentDataEntry[]): UnemploymentRateEntry[] {
    return data
      .filter((item) => item.tasa_desocupacion !== undefined && item.tasa_desocupacion !== null)
      .map((item) => ({
        año: item.año,
        tasa_desocupacion: item.tasa_desocupacion!,
      }));
  }

  /**
   * Processes public employment growth data with year-over-year calculations
   */
  static processPublicEmploymentGrowthData(data: EmploymentDataEntry[]): PublicEmploymentGrowthEntry[] {
    const validData = data
      .filter((item) => item.sector_publico_total_miles !== undefined && item.sector_publico_total_miles !== null)
      .sort((a, b) => a.año - b.año);

    return validData.map((item, index) => {
      let growthPercentage: number | undefined;
      if (index > 0) {
        const previousValue = validData[index - 1].sector_publico_total_miles!;
        const currentValue = item.sector_publico_total_miles!;
        growthPercentage = ((currentValue - previousValue) / previousValue) * 100;
      }

      return {
        año: item.año,
        sector_publico_total_miles: item.sector_publico_total_miles!,
        crecimiento_porcentual: growthPercentage,
      };
    });
  }

  /**
   * Filters employment data from a specific year onwards
   */
  static filterDataFromYear(data: EmploymentDataEntry[], fromYear: number): EmploymentDataEntry[] {
    return data.filter((item) => item.año >= fromYear);
  }

  /**
   * Gets available years from employment data
   */
  static getAvailableYears(data: EmploymentDataEntry[]): number[] {
    const years = data.map((item) => item.año);
    return [...new Set(years)].sort((a, b) => a - b);
  }

  /**
   * Validates data integrity
   */
  static validateDataIntegrity(data: EmploymentDataEntry[]): boolean {
    if (!Array.isArray(data) || data.length === 0) return false;
    
    return data.every((item) => {
      return typeof item.año === 'number' && item.año > 1900 && item.año <= new Date().getFullYear() + 1;
    });
  }

  /**
   * Formats tooltip for chart display
   */
  static formatTooltip(value: number, name: string): [string, string] {
    switch (name) {
      case 'tasa_desocupacion':
        return [`${value.toFixed(1)}%`, 'Tasa de Desocupación'];
      case 'sector_publico_total_miles':
        return [`${value.toLocaleString()} mil`, 'Empleados Públicos'];
      case 'crecimiento_porcentual':
        return [`${value >= 0 ? '+' : ''}${value.toFixed(1)}%`, 'Crecimiento Anual'];
      default:
        return [value.toLocaleString(), name];
    }
  }
}
