import { Alert, Box, CircularProgress } from '@mui/material';

import { useEffect, useState } from 'react';

import { useData } from '../../hooks/useData';
import BillCard from './BillCard';
import VotingTabs from './VotingTabs';

const VotingRecord = () => {
  const { bill, votingRecords, sessions, loading, error, votingStages } = useData();
  const [selectedTab, setSelectedTab] = useState(0);

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
      <VotingTabs votingStages={votingStages} sessions={sessions} selectedTab={selectedTab} onTabChange={handleTabChange} />
    </Box>
  );
};

export default VotingRecord;