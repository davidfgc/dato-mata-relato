// const API_BASE_URL = 'http://localhost:5173';
// const API_BASE_URL = 'https://davidfgc.github.io/dato-mata-relato';

const getBaseUrl = () => {
  if (window.location.hostname === 'localhost') return 'http://localhost:5173';
  else return 'https://votos.progres.website';
};

export const API_BASE_URL = getBaseUrl();

export const ENDPOINTS = {
  bills: `${API_BASE_URL}/data/bills.json`,
  votes: `${API_BASE_URL}/data/votes.json`,
  representatives: `${API_BASE_URL}/data/representatives.json`,
  parties: `${API_BASE_URL}/data/parties.json`,
  fiscalMismatches: `${API_BASE_URL}/data/fiscal-mismatches.json`,
};
