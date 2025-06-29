import { Alert, Box, CircularProgress, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useVotingRecordData } from '../../../application/hooks/queries/useVotingRecordData';
import PartyStagesVoteChart from '../charts/PartyStagesVoteChart';
import BillCard from './BillCard';
import VotingTabs from './VotingTabs';

const VotingRecord = () => {
  const { year, id } = useParams();
  const { bill, sessions, loading, error, votingStages, graphData } = useVotingRecordData(`${id}/${year}`);
  const [selectedTab, setSelectedTab] = useState(0);

  const getPosition = (party) => {
    const positiveVotes = party.result.yes + party.result.absent;
    if (positiveVotes > party.result.no) return 'supporting';
    if (positiveVotes === party.result.no) return 'neutral';
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
  const partiesWeightData = graphData.stages.map((stage, index) =>
    stage.partyStats
      .map((party) => ({
        name: party.party,
        weight: ((party.result.yes + party.result.absent) / (stage.result.yes + stage.result.absent)) * 100,
        votes: party.result.yes + party.result.absent,
        position: getPosition(party),
        color: getColor(getPosition(party), sessions[index].motion === 'archive'),
      }))
      .sort((a, b) => b.weight - a.weight)
  );

  useEffect(() => {
    if (sessions.length > 0) setSelectedTab(sessions.length - 1);
  }, [sessions]);

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
    <Box
      sx={{
        padding: { xs: 0, sm: 2 },
        margin: { xs: 0 },
        maxWidth: 'md',
        mx: 'auto',
        p: 3,
        minWidth: { xs: '100%', sm: '100%', md: '800px' },
      }}
    >
      <BillCard bill={bill} />
      {sessions.length > 1 && <PartyStagesVoteChart rawData={graphData} />}
      {sessions.length > 0 ? (
        <VotingTabs
          votingStages={votingStages}
          sessions={sessions}
          graphData={partiesWeightData}
          selectedTab={selectedTab}
          onTabChange={handleTabChange}
        />
      ) : (
        <Typography variant="h5">{'No hay votaciones registradas'}</Typography>
      )}
    </Box>
  );
};

export default VotingRecord;
