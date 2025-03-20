import { Box, Chip, CircularProgress, Typography } from '@mui/material';
import { useContext } from 'react';
import { WasteFilterContext } from '../context/WasteFilterContext';

const TagsFilter = () => {
  const { wasteFilters, activeFilter, setActiveFilter, clearFilter, isLoading } = useContext(WasteFilterContext);

  const handleFilterClick = (filterId) => {
    if (activeFilter === filterId) {
      clearFilter();
    } else {
      setActiveFilter(filterId);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Filtrar por categoría:
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
        {wasteFilters.map((filter) => (
          <Chip
            key={filter.id}
            label={filter.name}
            variant={activeFilter === filter.id ? 'filled' : 'outlined'}
            color="primary"
            onClick={() => handleFilterClick(filter.id)}
            sx={{ mb: 1 }}
          />
        ))}
        {activeFilter && <Chip label="Limpiar filtros" variant="outlined" color="secondary" onClick={clearFilter} sx={{ mb: 1 }} />}
      </Box>
    </Box>
  );
};

export default TagsFilter;
