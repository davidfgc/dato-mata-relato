/**
 * Domain entity for employment data
 */
export interface EmploymentRecord {
  year: number;
  totalOccupiedPopulation?: number; // in thousands
  totalPublicSector?: number; // in thousands
  nationalPublicSector?: number; // in thousands
  territorialPublicSector?: number; // in thousands
  privateSectorDerived?: number; // in thousands
  formalOccupationRate?: number; // percentage
  informalOccupationRate?: number; // percentage
  globalParticipationRate?: number; // percentage
  unemploymentRate?: number; // percentage
}

/**
 * Domain entity for unemployment rate analysis
 */
export interface UnemploymentAnalysis {
  year: number;
  unemploymentRate: number;
}

/**
 * Domain entity for public employment growth analysis
 */
export interface PublicEmploymentGrowth {
  year: number;
  totalPublicSector: number; // in thousands
  growthPercentage?: number;
}

/**
 * Aggregate for employment data
 */
export interface EmploymentData {
  records: EmploymentRecord[];
  lastUpdated?: string;
  metadata?: {
    sources: string[];
    methodology: string;
  };
}

/**
 * Presentation/Chart format interfaces
 * These represent the format used by charts and external APIs
 */
export interface EmploymentDataEntry {
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

export interface UnemploymentRateEntry {
  año: number;
  tasa_desocupacion: number;
}

export interface PublicEmploymentGrowthEntry {
  año: number;
  sector_publico_total_miles: number;
  crecimiento_porcentual?: number;
}
