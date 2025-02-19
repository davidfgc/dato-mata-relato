import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';

import VotingTotals from './VotingTotals';

const TabLabel = ({ step, session }) => (
  <Box className="flex flex-col items-center gap-1">
    <Typography>{step.name}</Typography>
    {session?.sessionTotals && (
      <VotingTotals
        yes={session?.sessionTotals.yes}
        no={session?.sessionTotals.no}
        absent={session?.sessionTotals.absent}
        showIcons={false}
        invertColors={session.motion === 'archive'}
      />
    )}
  </Box>
);

TabLabel.propTypes = {
  step: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  session: PropTypes.shape({
    sessionTotals: PropTypes.shape({
      yes: PropTypes.number,
      no: PropTypes.number,
      absent: PropTypes.number,
    }),
    motion: PropTypes.string,
  }),
};

export default TabLabel;