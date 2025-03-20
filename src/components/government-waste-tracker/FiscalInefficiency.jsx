import { Alert, Box, CircularProgress, Stack } from '@mui/material';
import { useEffect, useState, useContext } from 'react';
import { ENDPOINTS } from '../../config/api';

// Import components
import StatisticsAlerts from './components/StatisticsAlerts';
import TimelineItem from './components/TimelineItem';
import TagsFilter from './components/TagsFilter';
import { WasteFilterProvider, WasteFilterContext } from './context/WasteFilterContext';

const FiscalInefficiencyContent = () => {
  const [expandedCard, setExpandedCard] = useState(null);
  const [fiscalMismatches, setFiscalMismatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { activeFilter } = useContext(WasteFilterContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(ENDPOINTS.fiscalMismatches);
        const data = await response.json();
        const cutoffDate = new Date('2022-08-07');
        setFiscalMismatches(
          data.fiscalMismatches.filter((item) => new Date(item.date) > cutoffDate).sort((a, b) => new Date(b.date) - new Date(a.date))
        );
      } catch (err) {
        console.error(err);
        setError('Error loading data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate total waste
  const totalWaste = fiscalMismatches.reduce((sum, item) => sum + item.amount, 0);

  // Filter items based on active filter
  const filteredMismatches = activeFilter ? fiscalMismatches.filter((item) => item.waste_filter === activeFilter) : fiscalMismatches;

  // Calculate filtered waste
  const filteredWaste = filteredMismatches.reduce((sum, item) => sum + item.amount, 0);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const toggleCard = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <Box sx={{ maxWidth: 'lg', mx: 'auto', p: { xs: 2, lg: 1 } }}>
      {/* Tags Filter */}
      <TagsFilter />

      {/* Statistics Alerts */}
      <StatisticsAlerts totalWaste={activeFilter ? filteredWaste : totalWaste} />

      {/* Timeline */}
      <Stack spacing={2}>
        {filteredMismatches.map((item, index) => (
          <TimelineItem
            key={item.id}
            item={item}
            isLast={index === filteredMismatches.length - 1}
            isExpanded={expandedCard === item.id}
            onToggle={() => toggleCard(item.id)}
          />
        ))}
      </Stack>
    </Box>
  );
};

const FiscalInefficiency = () => {
  return (
    <WasteFilterProvider>
      <FiscalInefficiencyContent />
    </WasteFilterProvider>
  );
};

export default FiscalInefficiency;
