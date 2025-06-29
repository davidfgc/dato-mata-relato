import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import ContentCard from './ContentCard';
import { formatDate } from './utils';

const TimelineItem = ({ item, isLast, isExpanded, onToggle }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: { xs: 1, sm: 2 },
        position: 'relative',
      }}
    >
      {/* Date Column */}
      <Box
        sx={{
          width: { xs: 60, sm: 100 },
          textAlign: 'right',
          pt: 2,
          flexShrink: 0,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 0.5, sm: 1 },
          justifyContent: { xs: 'flex-start', sm: 'flex-end' },
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {formatDate(item.date).split(',')[0]}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {formatDate(item.date).split(',')[1]}
        </Typography>
      </Box>

      {/* Timeline Line and Dot */}
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: 20,
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            bgcolor: 'error.main',
            mt: 2.5,
            zIndex: 1,
          }}
        />
        {!isLast && (
          <Box
            sx={{
              width: 2,
              bgcolor: 'grey.200',
              position: 'absolute',
              top: 32,
              bottom: -16,
            }}
          />
        )}
      </Box>

      {/* Content Card */}
      <Box
        sx={{
          flexGrow: 1,
          pt: 2,
          minWidth: 0,
        }}
      >
        <ContentCard item={item} isExpanded={isExpanded} onToggle={onToggle} />
      </Box>
    </Box>
  );
};

TimelineItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    sources: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  isLast: PropTypes.bool.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default TimelineItem;
