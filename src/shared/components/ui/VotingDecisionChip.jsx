import { Chip } from '@mui/material';
import PropTypes from 'prop-types';

const VotingDecisionChip = ({ yes, no, invertColors = false }) => {
  const getColor = () => {
    if (yes > no) return invertColors ? 'error' : 'success';
    if (no > yes) return invertColors ? 'success' : 'error';
    return 'default';
  };

  const getLabel = () => {
    if (yes > no) return 'A favor';
    if (no > yes) return 'En contra';
    return 'Empate';
  };

  return <Chip label={getLabel()} size="small" color={getColor()} variant="outlined" />;
};

VotingDecisionChip.propTypes = {
  yes: PropTypes.number.isRequired,
  no: PropTypes.number.isRequired,
  invertColors: PropTypes.bool,
};

export default VotingDecisionChip;