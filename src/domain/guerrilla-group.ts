/**
 * Domain entity for guerrilla group membership data
 */
export interface GuerrillaGroupMembership {
  year: number;
  farc: number;
  eln: number;
  farcDissidents: number;
  clanDelGolfo: number;
}

/**
 * Domain entity for territorial presence data
 */
export interface GuerrillaTerritorialPresence {
  year: number;
  farcHistorical: number;
  eln: number;
  farcDissidents: number;
  clanDelGolfo: number;
}

/**
 * Aggregate for guerrilla evolution data
 */
export interface GuerrillaEvolutionData {
  membershipData: GuerrillaGroupMembership[];
  territorialData: GuerrillaTerritorialPresence[];
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
