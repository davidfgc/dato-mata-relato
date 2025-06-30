import { GuerrillaGroupMembership, GuerrillaTerritorialPresence, MembershipDataEntry, TerritorialDataEntry } from '../guerrilla-group';

/**
 * API response format types
 */
interface ApiMembershipEntry {
  año: number;
  FARC: number;
  ELN: number;
  'Disidencias FARC': number;
  'Clan del Golfo': number;
}

interface ApiTerritorialEntry {
  año: number;
  'FARC (histórica)': number;
  ELN: number;
  'Disidencias FARC': number;
  'Clan del Golfo': number;
}

interface ApiResponse {
  membershipData?: ApiMembershipEntry[];
  territorialData?: ApiTerritorialEntry[];
  lastUpdated?: string;
  metadata?: {
    sources: string[];
    methodology: string;
  };
}

/**
 * Union types for compatibility with existing code
 */
type MembershipDataAny = GuerrillaGroupMembership | MembershipDataEntry;
type TerritorialDataAny = GuerrillaTerritorialPresence | TerritorialDataEntry;

/**
 * Domain service for guerrilla evolution analysis
 * Contains pure business logic functions
 */
export class GuerrillaEvolutionService {
  /**
   * Calculates total combatants across all groups for each year
   * Works with both domain entities and chart format
   */
  static calculateTotalCombatants(membershipData: MembershipDataAny[]): Array<{ año?: number; year?: number; total: number }> {
    return membershipData.map((item) => {
      // Handle chart format (with 'año' property)
      if ('año' in item) {
        return {
          año: item.año,
          total: item.FARC + item.ELN + item['Disidencias FARC'] + item['Clan del Golfo'],
        };
      }

      // Handle domain format (with 'year' property)
      return {
        year: item.year,
        total: item.farc + item.eln + item.farcDissidents + item.clanDelGolfo,
      };
    });
  }

  /**
   * Filters membership data from a specific year onwards
   * Works with both domain entities and chart format
   */
  static filterMembershipFromYear(data: MembershipDataAny[], fromYear: number): MembershipDataAny[] {
    return data.filter((item) => {
      const year = 'año' in item ? item.año : item.year;
      return year >= fromYear;
    });
  }

  /**
   * Filters territorial data from a specific year onwards
   * Works with both domain entities and chart format
   */
  static filterTerritorialFromYear(data: TerritorialDataAny[], fromYear: number): TerritorialDataAny[] {
    return data.filter((item) => {
      const year = 'año' in item ? item.año : item.year;
      return year >= fromYear;
    });
  }

  /**
   * Gets available years from membership data
   * Works with both domain entities and chart format
   */
  static getAvailableYears(data: MembershipDataAny[]): number[] {
    const years = data.map((item) => ('año' in item ? item.año : item.year));
    return years.sort((a, b) => a - b);
  }

  /**
   * Formats tooltip for chart display
   * UI-specific logic but kept here for consistency with other chart functions
   */
  static formatTooltip(value: number, name: string): [string, string] {
    if (name === 'FARC' || name === 'FARC (histórica)') {
      return [value?.toLocaleString(), 'FARC-EP'];
    }
    return [value?.toLocaleString(), name];
  }

  /**
   * Formats group names for display
   */
  static formatGroupName(groupKey: string): string {
    const nameMap: Record<string, string> = {
      farc: 'FARC-EP',
      eln: 'ELN',
      farcDissidents: 'Disidencias FARC',
      clanDelGolfo: 'Clan del Golfo',
      farcHistorical: 'FARC-EP (histórica)',
    };
    return nameMap[groupKey] || groupKey;
  }

  /**
   * Validates if data contains the minimum required fields
   */
  static validateMembershipData(data: unknown[]): data is GuerrillaGroupMembership[] {
    return data.every(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        'year' in item &&
        typeof (item as Record<string, unknown>).year === 'number' &&
        'farc' in item &&
        typeof (item as Record<string, unknown>).farc === 'number' &&
        'eln' in item &&
        typeof (item as Record<string, unknown>).eln === 'number' &&
        'farcDissidents' in item &&
        typeof (item as Record<string, unknown>).farcDissidents === 'number' &&
        'clanDelGolfo' in item &&
        typeof (item as Record<string, unknown>).clanDelGolfo === 'number'
    );
  }

  /**
   * Validates territorial data structure
   */
  static validateTerritorialData(data: unknown[]): data is GuerrillaTerritorialPresence[] {
    return data.every(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        'year' in item &&
        typeof (item as Record<string, unknown>).year === 'number' &&
        'farcHistorical' in item &&
        typeof (item as Record<string, unknown>).farcHistorical === 'number' &&
        'eln' in item &&
        typeof (item as Record<string, unknown>).eln === 'number' &&
        'farcDissidents' in item &&
        typeof (item as Record<string, unknown>).farcDissidents === 'number' &&
        'clanDelGolfo' in item &&
        typeof (item as Record<string, unknown>).clanDelGolfo === 'number'
    );
  }

  /**
   * Transforms API response to domain entities
   */
  static transformApiResponse(apiData: ApiResponse): {
    membershipData: GuerrillaGroupMembership[];
    territorialData: GuerrillaTerritorialPresence[];
  } {
    const membershipData: GuerrillaGroupMembership[] = (apiData.membershipData || []).map((item: ApiMembershipEntry) => ({
      year: item.año,
      farc: item.FARC,
      eln: item.ELN,
      farcDissidents: item['Disidencias FARC'],
      clanDelGolfo: item['Clan del Golfo'],
    }));

    const territorialData: GuerrillaTerritorialPresence[] = (apiData.territorialData || []).map((item: ApiTerritorialEntry) => ({
      year: item.año,
      farcHistorical: item['FARC (histórica)'],
      eln: item.ELN,
      farcDissidents: item['Disidencias FARC'],
      clanDelGolfo: item['Clan del Golfo'],
    }));

    return { membershipData, territorialData };
  }

  /**
   * Transforms domain entities to presentation format (for charts)
   */
  static transformToChartFormat(membershipData: GuerrillaGroupMembership[]): MembershipDataEntry[] {
    return membershipData.map((item) => ({
      año: item.year,
      FARC: item.farc,
      ELN: item.eln,
      'Disidencias FARC': item.farcDissidents,
      'Clan del Golfo': item.clanDelGolfo,
    }));
  }

  /**
   * Transforms territorial domain entities to presentation format
   */
  static transformTerritorialToChartFormat(territorialData: GuerrillaTerritorialPresence[]): TerritorialDataEntry[] {
    return territorialData.map((item) => ({
      año: item.year,
      'FARC (histórica)': item.farcHistorical,
      ELN: item.eln,
      'Disidencias FARC': item.farcDissidents,
      'Clan del Golfo': item.clanDelGolfo,
    }));
  }
}
