import { ENDPOINTS } from '../../shared/config/api';

import Party from '../../domain/party';
import { BillEntity } from '../../domain/entities/bill.entity';
import VotingRecord from '../../domain/voting-record';
import Representative from '../../domain/representative';
import VotingStage from '../../domain/voting-stage';
import { MembershipDataEntry, TerritorialDataEntry } from '../../domain/guerrilla-group';
import { EmploymentDataEntry } from '../../domain/employment';

interface GuerrillaEvolutionApiResponse {
  membershipData: MembershipDataEntry[];
  territorialData: TerritorialDataEntry[];
  lastUpdated?: string;
  metadata?: {
    sources: string[];
    methodology: string;
  };
}

interface EmploymentDataApiResponse {
  employmentData: EmploymentDataEntry[];
  lastUpdated?: string;
  metadata?: {
    sources: string[];
    methodology: string;
  };
}

export const fetchBills = async (): Promise<BillEntity[]> => {
  const response = await fetch(ENDPOINTS.bills);
  const data = await response.json();
  // Fetch bill status data
  const statusResponse = await fetch(ENDPOINTS.billStatus);
  const statusData = await statusResponse.json();

  // Create lookup map of status id to name
  const statusMap = statusData.reduce((acc: Record<number, string>, status: { id: number; name: string }) => {
    acc[status.id] = status.name;
    return acc;
  }, {});

  // Add status name to each bill based on statusId
  data.bills = data.bills.map((bill: BillEntity) => {
    if (bill.statusId && statusMap[bill.statusId]) {
      return {
        ...bill,
        status: statusMap[bill.statusId],
      };
    }
    return bill;
  });
  return data.bills as BillEntity[];
};

export const fetchVotingRecords = async (): Promise<VotingRecord[]> => {
  const response = await fetch(ENDPOINTS.votingRecords);
  const data = await response.json();

  return data.records as VotingRecord[];
};

export const fetchRepresentatives = async (): Promise<Representative[]> => {
  const senators = await fetchSenators();
  const representatives = await fetchChamber2();

  return [...senators, ...representatives] as Representative[];
};

export const fetchSenators = async (): Promise<Representative[]> => {
  const response = await fetch(ENDPOINTS.chamber1);
  const data = await response.json();

  return data as Representative[];
};

export const fetchChamber2 = async (): Promise<Representative[]> => {
  const response = await fetch(ENDPOINTS.chamber2);
  const data = await response.json();

  return data as Representative[];
};

export const fetchParties = async (): Promise<Party> => {
  const response = await fetch(ENDPOINTS.parties);
  const data = await response.json();
  return data.parties;
};

export const fetchVotingStages = async (): Promise<VotingStage[]> => {
  const response = await fetch(ENDPOINTS.votingStages);
  const data = await response.json();

  return data.stages as VotingStage[];
};

export const fetchLocations = async (): Promise<unknown[]> => {
  const response = await fetch(ENDPOINTS.locations);
  const data = await response.json();

  return data;
};

export const fetchGuerrillaEvolutionData = async (): Promise<GuerrillaEvolutionApiResponse> => {
  const response = await fetch(ENDPOINTS.guerrillaEvolution);
  const data = await response.json();

  return data;
};

export const fetchEmploymentData = async (): Promise<EmploymentDataApiResponse> => {
  const response = await fetch(ENDPOINTS.employmentData);
  const data = await response.json();

  return data;
};