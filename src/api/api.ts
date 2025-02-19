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
  const response = await fetch(ENDPOINTS.representatives);
  const data = await response.json();

  return data.representatives as Representative[];
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