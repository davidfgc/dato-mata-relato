import { Chip } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * A reusable status chip component that displays a status with appropriate styling
 * @param {Object} props - Component props
 * @param {string} props.status - The status text to display
 * @param {string} [props.color] - Optional color override (default is determined by status)
 * @param {string} [props.size] - Chip size ('small' or 'medium')
 * @param {Object} [props.sx] - Additional MUI sx props
 * @returns {JSX.Element} StatusChip component
 */
const StatusChip = ({ status, color, size = 'small', sx, ...props }) => {
  // Determine color based on status if not explicitly provided
  const getStatusColor = (statusText) => {
    const statusLower = statusText.toLowerCase();

    if (color) return color;

    if (statusLower.includes('approved') || statusLower.includes('passed')) {
      return 'success';
    } else if (statusLower.includes('rejected') || statusLower.includes('failed') || statusLower.includes('archivado')) {
      return 'error';
    } else {
      return 'warning';
    }
  };

  return <Chip label={status} size={size} color={getStatusColor(status)} variant="outlined" sx={sx} {...props} />;
};

StatusChip.propTypes = {
  status: PropTypes.string.isRequired,
  color: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium']),
  sx: PropTypes.object,
};

export default StatusChip;
