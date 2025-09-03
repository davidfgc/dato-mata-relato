const getBaseUrl = () => {
  if (window.location.hostname === 'localhost') return 'http://localhost:5173';
  else return 'https://votos.progres.website';
};

export const API_BASE_URL = getBaseUrl();

export const ENDPOINTS = {
  bills: `${API_BASE_URL}/data/bills.json`,
  billStatus: `${API_BASE_URL}/data/bill-status.json`,
  votingRecords: `${API_BASE_URL}/data/voting-records.json`,
  chamber1: `${API_BASE_URL}/data/chamber-1.json`,
  chamber2: `${API_BASE_URL}/data/chamber-2.json`,
  representatives: `${API_BASE_URL}/data/representatives.json`,
  parties: `${API_BASE_URL}/data/parties.json`,
  fiscalMismatches: `${API_BASE_URL}/data/fiscal-mismatches.json`,
  votingStages: `${API_BASE_URL}/data/voting-stages.json`,
  locations: `${API_BASE_URL}/data/locations.json`,
  guerrillaEvolution: `${API_BASE_URL}/data/guerrilla-evolution.json`,
  employmentData: `${API_BASE_URL}/data/employment-data.json`,
};
