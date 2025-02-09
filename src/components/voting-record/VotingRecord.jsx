import { Alert, Box, CircularProgress } from '@mui/material';
import _ from 'lodash';

import { useEffect, useState } from 'react';

import { ENDPOINTS } from '../../config/api';
import WarningAlert from '../common/WarningAlert';
import BillCard from './BillCard';
import VotingTabs from './VotingTabs';

const VotingRecord = () => {
  const [bill, setBill] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [parties, setParties] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [votingSteps, setVotingSteps] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [billsResponse, votesResponse, repsResponse, partiesResponse, stepsResponse] = await Promise.all([
          fetch(ENDPOINTS.bills),
          fetch(ENDPOINTS.votes),
          fetch(ENDPOINTS.representatives),
          fetch(ENDPOINTS.parties),
          fetch(ENDPOINTS.votingSteps),
        ]);

        const [billsData, votesData, repsData, partiesData, stepsData] = await Promise.all([
          billsResponse.json(),
          votesResponse.json(),
          repsResponse.json(),
          partiesResponse.json(),
          stepsResponse.json(),
        ]);

        const partiesLookup = partiesData.parties.reduce((acc, party) => {
          acc[party.id] = party;
          return acc;
        }, {});

        const foundBill = billsData.bills.find((b) => b.id === '312/2024C');
        if (!foundBill) {
          throw new Error('Bill not found');
        }

        const processedSessions = votesData.sessions.map((session) => {
          const sessionVotes = session.votes
            .filter((vote) => vote.billId === '312/2024C')
            .map((vote) => {
              const representative = repsData.representatives.find((rep) => rep.id === vote.representativeId);
              const partyId = representative?.party_id;
              const party = partiesLookup[partyId];
              return {
                ...vote,
                representative: representative?.name || 'Unknown',
                party: party?.name || 'Unknown Party',
                partyId: partyId,
                partyInfo: party,
              };
            })
            .sort((a, b) => a.representative.localeCompare(b.representative));

          const groupedVotes = _.groupBy(sessionVotes, 'party');
          const partyStats = Object.entries(groupedVotes).map(([partyName, partyVotes]) => {
            const sampleVote = partyVotes[0];
            return {
              party: partyName,
              partyInfo: sampleVote.partyInfo,
              votes: partyVotes,
              yes: partyVotes.filter((v) => v.vote === 'yes').length,
              no: partyVotes.filter((v) => v.vote === 'no').length,
              absent: partyVotes.filter((v) => v.vote === 'absent').length,
            };
          });

          return {
            stepId: session['voting-step'],
            date: session.date,
            partyStats,
          };
        });

        setBill(foundBill);
        setSessions(processedSessions);
        setParties(partiesLookup);
        setVotingSteps(stepsData.steps);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Error loading data: {error}
      </Alert>
    );
  }

  if (!bill) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        No bill found with the specified ID
      </Alert>
    );
  }

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Box sx={{ maxWidth: 'lg', mx: 'auto', p: 3 }}>
      <BillCard bill={bill} />
      <WarningAlert message="Estamos trabajando completando la información" />
      <VotingTabs votingSteps={votingSteps} sessions={sessions} selectedTab={selectedTab} onTabChange={handleTabChange} />
    </Box>
  );
};

export default VotingRecord;
