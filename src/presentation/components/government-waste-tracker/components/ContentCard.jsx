import { ExpandLess as ExpandLessIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { Box, Chip, Collapse, Divider, IconButton, Paper, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useContext } from 'react';
import { WasteFilterContext } from '../context/WasteFilterContext';
import SourcesList from './SourcesList';
import { formatCurrency } from './utils';

const ContentCard = ({ item, isExpanded, onToggle }) => {
  const { wasteFilters, setActiveFilter } = useContext(WasteFilterContext);

  // Find the filter name based on waste_filter id
  const getFilterName = (filterId) => {
    const filter = wasteFilters.find((f) => f.id === filterId);
    return filter ? filter.name : '';
  };

  // Handle tag click - stop propagation to prevent card toggle
  const handleTagClick = (e, filterId) => {
    e.stopPropagation();
    setActiveFilter(filterId);
  };

  return (
    <Paper
      elevation={isExpanded ? 2 : 1}
      sx={{
        cursor: 'pointer',
        '&:hover': { boxShadow: 3 },
        transition: 'box-shadow 200ms',
        p: 2,
      }}
      onClick={onToggle}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'flex-start',
            width: '100%',
            gap: 1,
          }}
        >
          <Typography variant="h6" component="div" sx={{ wordBreak: 'break-word', textAlign: 'left', flexGrow: 1 }}>
            {item.title}
          </Typography>
          <Typography variant="h6" color="error.main" noWrap>
            {formatCurrency(item.amount)}
          </Typography>
          <IconButton size="small" sx={{ display: { xs: 'none', sm: 'flex' } }}>
            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column-reverse', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            gap: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Ver más
          </Typography>
          <Box sx={{ display: 'flex', mt: 1, mb: 1 }}>
            {item.waste_filter && (
              <Chip
                label={getFilterName(item.waste_filter)}
                variant="outlined"
                color="primary"
                size="small"
                onClick={(e) => handleTagClick(e, item.waste_filter)}
                sx={{ mr: 1 }}
              />
            )}
          </Box>
        </Box>
      </Box>

      <Collapse in={isExpanded}>
        <Box sx={{ mt: 2 }}>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="subtitle2">Descripción:</Typography>
          <Typography variant="body2" color="text.secondary" textAlign="start">
            {item.description}
          </Typography>
          <SourcesList sources={item.sources} />
        </Box>
      </Collapse>
    </Paper>
  );
};

ContentCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    amount: PropTypes.number.isRequired,
    sources: PropTypes.arrayOf(PropTypes.string).isRequired,
    waste_filter: PropTypes.number,
  }).isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default ContentCard;
