import { Box, Typography } from '@mui/material';

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

export default TabLabel;
