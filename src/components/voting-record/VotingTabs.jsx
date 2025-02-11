import { Box, Tab, Tabs } from '@mui/material';
import PropTypes from 'prop-types';

import WarningAlert from '../common/WarningAlert';
import PartyVotingList from './PartyVotingList';
import TabLabel from './TabLabel';

const VotingTabs = ({ votingSteps, sessions, selectedTab, onTabChange }) => {
  const session = sessions[selectedTab];
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
      <Tabs value={selectedTab} onChange={onTabChange} aria-label="voting sessions">
        {votingSteps.map((step, index) => {
          const session = sessions.find((s) => s.stepId === step.id);
          return session && <Tab key={step.id} label={<TabLabel step={step} session={session} />} />;
        })}
      </Tabs>

      {session.warning && session.warning.length > 0 && <WarningAlert message={session.warning} mb={0} />}

      {sessions.map((session, index) => (
        <Box key={session.stepId} hidden={selectedTab !== index}>
          <PartyVotingList session={session} />
        </Box>
      ))}
    </Box>
  );
};

VotingTabs.propTypes = {
  votingSteps: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
    })
  ).isRequired,
  sessions: PropTypes.arrayOf(
    PropTypes.shape({
      stepId: PropTypes.number.isRequired,
      warning: PropTypes.string,
    })
  ).isRequired,
  selectedTab: PropTypes.number.isRequired,
  onTabChange: PropTypes.func.isRequired,
};

export default VotingTabs;