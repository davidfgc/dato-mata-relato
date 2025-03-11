import { ExpandLess as ExpandLessIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { Box, Collapse, Divider, IconButton, Paper, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import SourcesList from './SourcesList';
import { formatCurrency, formatDate } from './utils';

const TimelineItem = ({ item, isLast, isExpanded, onToggle }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: 2,
        position: 'relative',
      }}
    >
      {/* Date Column */}
      <Box
        sx={{
          width: { xs: 80, sm: 120 },
          textAlign: 'right',
          pt: 2,
          flexShrink: 0,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {formatDate(item.date)}
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
          pb: 2,
          minWidth: 0,
        }}
      >
        <Paper
          elevation={isExpanded ? 2 : 1}
          sx={{
            cursor: 'pointer',
            '&:hover': { boxShadow: 3 },
            transition: 'box-shadow 200ms',
          }}
          onClick={onToggle}
        >
          <Box sx={{ p: 2 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'flex-start' },
                gap: 1,
              }}
            >
              <Box sx={{ width: '100%' }}>
                <Typography variant="h6" component="div" sx={{ wordBreak: 'break-word' }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ver fuentes
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: { xs: 'space-between', sm: 'flex-end' },
                  width: { xs: '100%', sm: 'auto' },
                  mt: { xs: 1, sm: 0 },
                  gap: 1,
                  flexShrink: 0,
                }}
              >
                <Typography variant="h6" color="error.main" noWrap>
                  {formatCurrency(item.amount)}
                </Typography>
                <IconButton size="small">{isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>
              </Box>
            </Box>

            <Collapse in={isExpanded}>
              <Box sx={{ mt: 2 }}>
                <Divider />
                <SourcesList sources={item.sources} />
              </Box>
            </Collapse>
          </Box>
        </Paper>
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
