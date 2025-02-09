import { Box, Tab, Tabs } from '@mui/material';

import PartyVotingList from './PartyVotingList';

const VotingTabs = ({ votingSteps, sessions, selectedTab, onTabChange }) => {
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
      <Tabs value={selectedTab} onChange={onTabChange} aria-label="voting sessions">
        {votingSteps.map((step) => (
          <Tab key={step.id} label={step.name} disabled={!sessions.some((session) => session.stepId === step.id)} />
        ))}
      </Tabs>
      {sessions.map((session, index) => (
        <Box key={session.stepId} hidden={selectedTab !== index}>
          <PartyVotingList partyStats={session.partyStats} />
        </Box>
      ))}
    </Box>
  );
};

export default VotingTabs;
