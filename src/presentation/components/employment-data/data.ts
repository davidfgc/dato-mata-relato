/**
 * Datos y funciones de transformación para Employment Data Dashboard
 * Datos basados en DANE - Departamento Administrativo Nacional de Estadística
 */

/**
 * Interface para los datos de empleo por año
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

/**
 * Interface para datos procesados de tasa de desocupación
 */
export interface UnemploymentRateEntry {
  año: number;
  tasa_desocupacion: number;
}

/**
 * Interface para datos procesados de crecimiento del empleo público
 */
export interface PublicEmploymentGrowthEntry {
  año: number;
  sector_publico_total_miles: number;
  crecimiento_porcentual?: number;
}

/**
 * Datos de empleo en Colombia (2002-2024)
 * Fuente: DANE - Departamento Administrativo Nacional de Estadística
 */
export const employmentData: EmploymentDataEntry[] = [
  {
    año: 2002,
    poblacion_ocupada_total_miles: 17500,
    sector_publico_total_miles: 950,
    sector_publico_nacional_miles: 500,
    sector_publico_territorial_miles: 450,
    sector_privado_derivado_miles: 16550,
    tasa_ocupacion_formal: 33.0,
    tasa_ocupacion_informal: 67.0,
    tasa_global_participacion: undefined,
    tasa_desocupacion: 13.0, // Completado desde el gráfico
  },
  {
    año: 2005,
    poblacion_ocupada_total_miles: 18300,
    sector_publico_total_miles: 1000,
    sector_publico_nacional_miles: undefined,
    sector_publico_territorial_miles: undefined,
    sector_privado_derivado_miles: 17300,
    tasa_ocupacion_formal: 33.8,
    tasa_ocupacion_informal: 66.2,
    tasa_global_participacion: undefined,
    tasa_desocupacion: 12.5, // Completado desde el gráfico
  },
  {
    año: 2007,
    poblacion_ocupada_total_miles: undefined,
    sector_publico_total_miles: 1050,
    sector_publico_nacional_miles: 540,
    sector_publico_territorial_miles: 510,
    sector_privado_derivado_miles: undefined,
    tasa_desocupacion: 11.4, // Completado desde el gráfico
  },
  {
    año: 2008,
    poblacion_ocupada_total_miles: 19000,
    sector_publico_total_miles: 1050,
    sector_publico_nacional_miles: undefined,
    sector_publico_territorial_miles: undefined,
    sector_privado_derivado_miles: 17950,
    tasa_ocupacion_formal: 35.0,
    tasa_ocupacion_informal: 65.0,
    tasa_global_participacion: undefined,
    tasa_desocupacion: 11.1, // Completado desde el gráfico
  },
  {
    año: 2011,
    tasa_ocupacion_formal: 37.1,
    tasa_ocupacion_informal: 62.9,
    tasa_global_participacion: undefined,
    tasa_desocupacion: 11.1,
  },
  {
    año: 2012,
    tasa_desocupacion: 10.6,
  },
  {
    año: 2013,
    tasa_desocupacion: 9.9,
  },
  {
    año: 2012, // Nota: hay duplicado de 2012 en los datos originales
    poblacion_ocupada_total_miles: 20500,
    sector_publico_total_miles: 1100,
    sector_publico_nacional_miles: 550,
    sector_publico_territorial_miles: 550,
    sector_privado_derivado_miles: 19400,
    tasa_desocupacion: 10.6, // Cambiado de 9.9 a 10.6 para consistencia con el otro registro de 2012
  },
  {
    año: 2014,
    tasa_ocupacion_formal: 39.0,
    tasa_ocupacion_informal: 61.0,
    tasa_global_participacion: undefined,
    tasa_desocupacion: 9.1,
  },
  {
    año: 2015,
    tasa_desocupacion: 9.1,
  },
  {
    año: 2016,
    poblacion_ocupada_total_miles: 22300,
    sector_publico_total_miles: 1180,
    sector_publico_nacional_miles: undefined,
    sector_publico_territorial_miles: undefined,
    sector_privado_derivado_miles: 21120,
    tasa_desocupacion: 9.2,
  },
  {
    año: 2017,
    poblacion_ocupada_total_miles: undefined,
    sector_publico_total_miles: 1200,
    sector_publico_nacional_miles: 580,
    sector_publico_territorial_miles: 620,
    sector_privado_derivado_miles: undefined,
    tasa_ocupacion_formal: 39.4,
    tasa_ocupacion_informal: 60.6,
    tasa_global_participacion: undefined,
    tasa_desocupacion: 9.8,
  },
  {
    año: 2018,
    tasa_desocupacion: 10.0, // Cambiado de 10 a 10.0 para consistencia
  },
  {
    año: 2019,
    poblacion_ocupada_total_miles: 22500,
    sector_publico_total_miles: 1250,
    sector_publico_nacional_miles: undefined,
    sector_publico_territorial_miles: undefined,
    sector_privado_derivado_miles: 21250,
    tasa_ocupacion_formal: 39.5,
    tasa_ocupacion_informal: 60.5,
    tasa_global_participacion: undefined,
    tasa_desocupacion: 11.0, // Cambiado de 11 a 11.0 para consistencia
  },
  {
    año: 2020,
    poblacion_ocupada_total_miles: 20500,
    sector_publico_total_miles: 1260,
    sector_publico_nacional_miles: undefined,
    sector_publico_territorial_miles: undefined,
    sector_privado_derivado_miles: 19240,
    tasa_ocupacion_formal: 41.4,
    tasa_ocupacion_informal: 58.6,
    tasa_global_participacion: undefined,
    tasa_desocupacion: 22.0, // Cambiado de 22 a 22.0 para consistencia
  },
  {
    año: 2021,
    poblacion_ocupada_total_miles: undefined,
    sector_publico_total_miles: 1280,
    sector_publico_nacional_miles: 610,
    sector_publico_territorial_miles: 670,
    sector_privado_derivado_miles: undefined,
    tasa_ocupacion_formal: 39.2,
    tasa_ocupacion_informal: 60.8,
    tasa_global_participacion: undefined,
    tasa_desocupacion: 15.2,
  },
  {
    año: 2022,
    tasa_ocupacion_formal: 41.6,
    tasa_ocupacion_informal: 58.4,
    tasa_global_participacion: undefined,
    tasa_desocupacion: 10.6,
  },
  {
    año: 2023,
    poblacion_ocupada_total_miles: 23182,
    sector_publico_total_miles: 1310,
    sector_publico_nacional_miles: 625,
    sector_publico_territorial_miles: 685,
    sector_privado_derivado_miles: 21872,
    tasa_ocupacion_formal: 42.8,
    tasa_ocupacion_informal: 57.2,
    tasa_global_participacion: 63.9,
    tasa_desocupacion: 10.5,
  },
  {
    año: 2024,
    tasa_ocupacion_formal: 43.5,
    tasa_ocupacion_informal: 56.5,
    tasa_global_participacion: 63.8,
    tasa_desocupacion: 10.3,
  },
  {
    año: 2025,
    tasa_ocupacion_formal: 43.5,
    tasa_ocupacion_informal: 56.5,
    tasa_global_participacion: 63.8,
    tasa_desocupacion: 9.0, // Cambiado de 9 a 9.0 para consistencia
  },
];

/**
 * Pure function: Filtra y procesa datos de tasa de desocupación
 * @param data - Array de datos de empleo
 * @returns Array con datos válidos de tasa de desocupación
 */
export const processUnemploymentRateData = (data: EmploymentDataEntry[]): UnemploymentRateEntry[] => {
  return data
    .filter(item => item.tasa_desocupacion !== null && item.tasa_desocupacion !== undefined)
    .map(item => ({
      año: item.año,
      tasa_desocupacion: item.tasa_desocupacion!
    }))
    .sort((a, b) => a.año - b.año);
};

/**
 * Pure function: Filtra y procesa datos de empleo público con cálculo de crecimiento
 * @param data - Array de datos de empleo
 * @returns Array con datos de empleo público y crecimiento porcentual
 */
export const processPublicEmploymentGrowthData = (data: EmploymentDataEntry[]): PublicEmploymentGrowthEntry[] => {
  const validData = data
    .filter(item => item.sector_publico_total_miles !== null && item.sector_publico_total_miles !== undefined)
    .map(item => ({
      año: item.año,
      sector_publico_total_miles: item.sector_publico_total_miles!
    }))
    .sort((a, b) => a.año - b.año);

  // Calcular crecimiento porcentual año a año
  return validData.map((item, index) => {
    if (index === 0) {
      return { ...item, crecimiento_porcentual: 0 };
    }
    
    const previousValue = validData[index - 1].sector_publico_total_miles;
    const currentValue = item.sector_publico_total_miles;
    const growthPercentage = ((currentValue - previousValue) / previousValue) * 100;
    
    return {
      ...item,
      crecimiento_porcentual: Number(growthPercentage.toFixed(2))
    };
  });
};

/**
 * Pure function: Obtiene años disponibles en los datos
 * @param data - Array de datos de empleo
 * @returns Array ordenado de años únicos
 */
export const getAvailableYears = (data: EmploymentDataEntry[]): number[] => {
  return [...new Set(data.map(item => item.año))].sort((a, b) => a - b);
};

/**
 * Pure function: Filtra datos desde un año específico
 * @param data - Array de datos de empleo
 * @param fromYear - Año inicial del filtro
 * @returns Array filtrado de datos
 */
export const filterDataFromYear = (data: EmploymentDataEntry[], fromYear: number): EmploymentDataEntry[] => {
  return data.filter(item => item.año >= fromYear);
};

/**
 * Pure function: Valida la integridad de los datos
 * @param data - Array de datos de empleo
 * @returns Boolean indicando si los datos son válidos
 */
export const validateDataIntegrity = (data: EmploymentDataEntry[]): boolean => {
  return data.every(item => 
    typeof item.año === 'number' && 
    item.año >= 2000 && 
    item.año <= new Date().getFullYear()
  );
};

/**
 * Pure function: Formatea tooltips para las gráficas
 * @param value - Valor a formatear
 * @param name - Nombre del indicador
 * @returns Tupla con valor formateado y nombre
 */
export const formatTooltip = (value: number, name: string): [string, string] => {
  switch (name) {
    case 'tasa_desocupacion':
      return [`${value}%`, 'Tasa de Desocupación'];
    case 'sector_publico_total_miles':
      return [`${value.toLocaleString()} mil`, 'Empleo Público'];
    case 'crecimiento_porcentual':
      return [`${value}%`, 'Crecimiento Anual'];
    default:
      return [value.toString(), name];
  }
};
