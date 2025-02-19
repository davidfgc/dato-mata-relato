import { DoNotDisturbOnRounded as AbsentIcon, Cancel as NoIcon, CheckCircle as YesIcon } from '@mui/icons-material';
import { Box, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const VotingTotals = ({ yes, no, absent, showIcons = true, invertColors = false }) => {
  const yesColor = invertColors ? 'error.main' : 'success.main';
  const noColor = invertColors ? 'success.main' : 'error.main';

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Box sx={{ color: yesColor, display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {showIcons && <YesIcon fontSize="small" />}
        <Typography>{yes}</Typography>
      </Box>
      <Box sx={{ color: noColor, display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {showIcons && <NoIcon fontSize="small" />}
        <Typography>{no}</Typography>
      </Box>
      <Box sx={{ color: 'default.main', display: 'flex', alignItems: 'center', gap: 0.5 }}>
        {showIcons && <AbsentIcon fontSize="small" />}
        <Typography>{absent}</Typography>
      </Box>
    </Stack>
  );
};
VotingTotals.propTypes = {
  yes: PropTypes.number.isRequired,
  no: PropTypes.number.isRequired,
  absent: PropTypes.number.isRequired,
  showIcons: PropTypes.bool,
  invertColors: PropTypes.bool,
};

export default VotingTotals;