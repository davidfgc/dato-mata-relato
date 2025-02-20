import { useEffect, useState } from 'react';

import { fetchBills, fetchParties, fetchRepresentatives, fetchVotingRecords, fetchVotingStages } from '../api/api';
import { processData } from '../api/processData';

export const useVotingRecordData = () => {
  const [bill, setBill] = useState({});
  const [votingRecords, setVotingRecords] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [parties, setParties] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [votingStages, setVotingStages] = useState([]);
  const [graphData, setGraphData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [bills, votingRecords, reps, parties, votingStages] = await Promise.all([
          fetchBills(),
          fetchVotingRecords(),
          fetchRepresentatives(),
          fetchParties(),
          fetchVotingStages(),
        ]);

        const data = processData(bills, votingRecords, reps, parties, votingStages);
        const graphData = data.sessions.map((session) => {
          return {
            billId: data.bill.id,
            votingStage: session,
            result: { ...session.sessionTotals },
            partyStats: [...session.partyStats],
          };
        });

        setBill(data.bill);
        setVotingRecords(votingRecords);
        setSessions(data.sessions);
        setParties(data.parties);
        setVotingStages(data.stages);
        setGraphData(graphData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    bill,
    votingRecords,
    sessions,
    parties,
    loading,
    error,
    votingStages,
    graphData,
  };
};