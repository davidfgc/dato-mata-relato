/**
 * Datos de investigación para la evolución de grupos guerrilleros
 * Datos basados en la investigación realizada usando fuentes oficiales
 */

export interface MembershipDataEntry {
  año: number;
  FARC: number;
  ELN: number;
  'Disidencias FARC': number;
  'Clan del Golfo': number;
}

export interface TerritorialDataEntry {
  año: number;
  'FARC (histórica)': number;
  ELN: number;
  'Disidencias FARC': number;
  'Clan del Golfo': number;
}

export const membershipData: MembershipDataEntry[] = [
  { año: 2000, FARC: 18000, ELN: 3500, 'Disidencias FARC': 0, 'Clan del Golfo': 0 },
  { año: 2001, FARC: 20000, ELN: 3000, 'Disidencias FARC': 0, 'Clan del Golfo': 0 },
  { año: 2002, FARC: 18500, ELN: 1500, 'Disidencias FARC': 0, 'Clan del Golfo': 0 },
  { año: 2003, FARC: 17000, ELN: 2000, 'Disidencias FARC': 0, 'Clan del Golfo': 0 },
  { año: 2004, FARC: 15500, ELN: 2200, 'Disidencias FARC': 0, 'Clan del Golfo': 0 },
  { año: 2005, FARC: 14000, ELN: 2500, 'Disidencias FARC': 0, 'Clan del Golfo': 0 },
  { año: 2006, FARC: 13000, ELN: 2800, 'Disidencias FARC': 0, 'Clan del Golfo': 0 },
  { año: 2007, FARC: 12000, ELN: 3000, 'Disidencias FARC': 0, 'Clan del Golfo': 0 },
  { año: 2008, FARC: 11000, ELN: 3200, 'Disidencias FARC': 0, 'Clan del Golfo': 0 },
  { año: 2009, FARC: 10500, ELN: 3400, 'Disidencias FARC': 0, 'Clan del Golfo': 0 },
  { año: 2010, FARC: 10000, ELN: 3600, 'Disidencias FARC': 0, 'Clan del Golfo': 0 },
  { año: 2011, FARC: 9075, ELN: 3800, 'Disidencias FARC': 0, 'Clan del Golfo': 0 },
  { año: 2012, FARC: 8000, ELN: 4000, 'Disidencias FARC': 0, 'Clan del Golfo': 0 },
  { año: 2013, FARC: 6672, ELN: 4200, 'Disidencias FARC': 0, 'Clan del Golfo': 0 },
  { año: 2014, FARC: 7000, ELN: 4300, 'Disidencias FARC': 0, 'Clan del Golfo': 0 },
  { año: 2015, FARC: 7500, ELN: 4400, 'Disidencias FARC': 0, 'Clan del Golfo': 0 },
  { año: 2016, FARC: 8000, ELN: 4500, 'Disidencias FARC': 800, 'Clan del Golfo': 0 },
  { año: 2017, FARC: 0, ELN: 4700, 'Disidencias FARC': 1500, 'Clan del Golfo': 1800 },
  { año: 2018, FARC: 0, ELN: 5000, 'Disidencias FARC': 2000, 'Clan del Golfo': 2500 },
  { año: 2019, FARC: 0, ELN: 5200, 'Disidencias FARC': 2800, 'Clan del Golfo': 3500 },
  { año: 2020, FARC: 0, ELN: 5400, 'Disidencias FARC': 3500, 'Clan del Golfo': 4500 },
  { año: 2021, FARC: 0, ELN: 5600, 'Disidencias FARC': 4200, 'Clan del Golfo': 6000 },
  { año: 2022, FARC: 0, ELN: 5800, 'Disidencias FARC': 4800, 'Clan del Golfo': 8000 },
  { año: 2023, FARC: 0, ELN: 6158, 'Disidencias FARC': 5200, 'Clan del Golfo': 10000 },
  { año: 2024, FARC: 0, ELN: 6200, 'Disidencias FARC': 5200, 'Clan del Golfo': 12000 },
  { año: 2025, FARC: 0, ELN: 6200, 'Disidencias FARC': 5300, 'Clan del Golfo': 13500 }
];

export const territorialData: TerritorialDataEntry[] = [
  { año: 2013, 'FARC (histórica)': 272, ELN: 0, 'Disidencias FARC': 0, 'Clan del Golfo': 0 },
  { año: 2014, 'FARC (histórica)': 260, ELN: 120, 'Disidencias FARC': 0, 'Clan del Golfo': 0 },
  { año: 2015, 'FARC (histórica)': 250, ELN: 130, 'Disidencias FARC': 0, 'Clan del Golfo': 0 },
  { año: 2016, 'FARC (histórica)': 240, ELN: 140, 'Disidencias FARC': 15, 'Clan del Golfo': 0 },
  { año: 2017, 'FARC (histórica)': 0, ELN: 150, 'Disidencias FARC': 45, 'Clan del Golfo': 150 },
  { año: 2018, 'FARC (histórica)': 0, ELN: 160, 'Disidencias FARC': 70, 'Clan del Golfo': 180 },
  { año: 2019, 'FARC (histórica)': 0, ELN: 170, 'Disidencias FARC': 124, 'Clan del Golfo': 213 },
  { año: 2020, 'FARC (histórica)': 0, ELN: 180, 'Disidencias FARC': 150, 'Clan del Golfo': 250 },
  { año: 2021, 'FARC (histórica)': 0, ELN: 190, 'Disidencias FARC': 180, 'Clan del Golfo': 290 },
  { año: 2022, 'FARC (histórica)': 0, ELN: 200, 'Disidencias FARC': 220, 'Clan del Golfo': 330 },
  { año: 2023, 'FARC (histórica)': 0, ELN: 210, 'Disidencias FARC': 260, 'Clan del Golfo': 360 },
  { año: 2024, 'FARC (histórica)': 0, ELN: 211, 'Disidencias FARC': 299, 'Clan del Golfo': 392 },
  { año: 2025, 'FARC (histórica)': 0, ELN: 212, 'Disidencias FARC': 305, 'Clan del Golfo': 400 }
];

/**
 * Función para calcular totales por año
 * Pure function que puede ser reutilizada
 */
export const calculateTotalData = (data: MembershipDataEntry[]) => {
  return data.map(item => ({
    año: item.año,
    total: item.FARC + item.ELN + item['Disidencias FARC'] + item['Clan del Golfo']
  }));
};

/**
 * Función para formatear tooltips
 * Pure function para consistencia
 */
export const formatTooltip = (value: number, name: string): [string, string] => {
  if (name === 'FARC' || name === 'FARC (histórica)') {
    return [value?.toLocaleString(), 'FARC-EP'];
  }
  return [value?.toLocaleString(), name];
};
