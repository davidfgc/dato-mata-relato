import { useEffect, useState } from 'react';

import { fetchBills, fetchParties, fetchRepresentatives, fetchVotingRecords, fetchVotingStages } from '../../../infrastructure/api/api';
import { processData } from '../../../infrastructure/api/processData';

export const useVotingRecordData = (billId) => {
  const [bill, setBill] = useState({});
  const [sessions, setSessions] = useState([]);
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [votingStages, setVotingStages] = useState([]);
  const [graphData, setGraphData] = useState({ stages: [] });

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

        // Process data with the specific bill ID if provided
        const data = processData(bills, votingRecords, reps, parties, votingStages, billId);

        const graphData = {
          bill: {
            id: data.bill.id,
            title: data.bill.title,
          },
          stages: data.sessions.map((stage) => {
            const decisionStageVotes =
              (stage.sessionTotals.yes > stage.sessionTotals.no ? stage.sessionTotals.yes : stage.sessionTotals.no) +
              stage.sessionTotals.absent;
            return {
              id: stage.stepId,
              date: stage.date,
              motion: stage.motion,
              partyStats: stage.partyStats.map((party) => {
                const decisionPartyVotes = (party.yes > party.no ? party.yes : party.no) + party.absent;
                return {
                  party: party.party,
                  result: {
                    absent: party.absent,
                    yes: party.yes,
                    no: party.no,
                    weight: (decisionPartyVotes / decisionStageVotes) * 100,
                  },
                };
              }),
              result: { ...stage.sessionTotals },
            };
          }),
        };

        setBill(data.bill);
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
  }, [billId]);

  return {
    bill,
    sessions,
    parties,
    loading,
    error,
    votingStages,
    graphData,
  };
};