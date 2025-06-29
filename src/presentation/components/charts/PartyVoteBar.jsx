import { Box, Typography, styled } from '@mui/material';
import PropTypes from 'prop-types';

const VoteBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  color: 'white',
  fontSize: '0.875rem',
}));

const PartyVoteBar = ({ partyStats, maxTotal, invertColors = false }) => {
  const yesColor = invertColors ? 'error.main' : 'success.main';
  const noColor = invertColors ? 'success.main' : 'error.main';

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
      <Box sx={{ flex: 1, display: 'flex', gap: 0.5 }}>
        {partyStats.yes > 0 && (
          <VoteBar
            sx={{
              width: `${(partyStats.yes / maxTotal) * 100}%`,
              bgcolor: yesColor,
            }}
          >
            {partyStats.yes}
          </VoteBar>
        )}
        {partyStats.no > 0 && (
          <VoteBar
            sx={{
              width: `${(partyStats.no / maxTotal) * 100}%`,
              bgcolor: noColor,
            }}
          >
            {partyStats.no}
          </VoteBar>
        )}
        {partyStats.absent > 0 && (
          <VoteBar
            sx={{
              width: `${(partyStats.absent / maxTotal) * 100}%`,
              bgcolor: 'grey.300',
              color: 'black',
            }}
          >
            {partyStats.absent}
          </VoteBar>
        )}
      </Box>

      <Typography sx={{ width: '80px', textAlign: 'right' }}>Total: {partyStats.total}</Typography>
    </Box>
  );
};

PartyVoteBar.propTypes = {
  partyStats: PropTypes.shape({
    yes: PropTypes.number.isRequired,
    no: PropTypes.number.isRequired,
    absent: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
  }).isRequired,
  maxTotal: PropTypes.number.isRequired,
  invertColors: PropTypes.bool,
};

export default PartyVoteBar;
