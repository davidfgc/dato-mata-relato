import { Alert, Box, CircularProgress } from '@mui/material';

import { useEffect, useState } from 'react';

import { useVotingRecordData } from '../../hooks/useVotingRecordData';
import BillCard from './BillCard';
import VotingTabs from './VotingTabs';

const VotingRecord = () => {
  const { bill, votingRecords, sessions, loading, error, votingStages, graphData } = useVotingRecordData();
  const [selectedTab, setSelectedTab] = useState(0);

  const getPosition = (party) => {
    const positiveVotes = party.yes + party.absent;
    if (positiveVotes > party.no) return 'supporting';
    if (positiveVotes === party.no) return 'neutral';
    return 'against';
  };
  const getColor = (position, invertColors) => {
    if (invertColors) {
      if (position === 'supporting') return '#f44336';
      if (position === 'neutral') return '#ff9800';
      return '#4caf50';
    } else {
      if (position === 'supporting') return '#4caf50';
      if (position === 'neutral') return '#ff9800';
      return '#f44336';
    }
  };
  const partiesWeightData = graphData.map((stage, index) =>
    stage.partyStats
      .map((party) => ({
        name: party.party,
        weight: ((party.yes + party.absent) / (stage.result.yes + stage.result.absent)) * 100,
        votes: party.yes + party.absent,
        position: getPosition(party),
        color: getColor(getPosition(party), sessions[index].motion === 'archive'),
      }))
      .sort((a, b) => b.weight - a.weight)
  );

  useEffect(() => {
    if (votingRecords.length > 0) setSelectedTab(votingRecords.length - 1);
  }, [votingRecords]);

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
    <Box sx={{ maxWidth: 'md', mx: 'auto', p: 3, minWidth: { xs: '100%', sm: '100%', md: '800px' } }}>
      <BillCard bill={bill} />
      <VotingTabs
        votingStages={votingStages}
        sessions={sessions}
        graphData={partiesWeightData}
        selectedTab={selectedTab}
        onTabChange={handleTabChange}
      />
    </Box>
  );
};

export default VotingRecord;