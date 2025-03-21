import { ENDPOINTS } from '../config/api';

import Party from '../domain/party';
import Bill from '../domain/bill';
import VotingRecord from '../domain/voting-record';
import Representative from '../domain/representative';
import VotingStage from '../domain/voting-stage';

export const fetchBills = async (): Promise<Bill[]> => {
  const response = await fetch(ENDPOINTS.bills);
  const data = await response.json();

  return data.bills as Bill[];
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