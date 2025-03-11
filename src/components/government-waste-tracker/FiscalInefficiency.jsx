import { Alert, Box, CircularProgress, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { ENDPOINTS } from '../../config/api';

// Import components
import StatisticsAlerts from './components/StatisticsAlerts';
import TimelineItem from './components/TimelineItem';

const FiscalInefficiency = () => {
  const [expandedCard, setExpandedCard] = useState(null);
  const [fiscalMismatches, setFiscalMismatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <Box sx={{ maxWidth: 'lg', mx: 'auto', p: { xs: 1.5, sm: 3 } }}>
      {/* Statistics Alerts */}
      <StatisticsAlerts totalWaste={totalWaste} />

      {/* Timeline */}
      <Stack spacing={2}>
        {fiscalMismatches.map((item, index) => (
          <TimelineItem
            key={item.id}
            item={item}
            isLast={index === fiscalMismatches.length - 1}
            isExpanded={expandedCard === item.id}
            onToggle={() => toggleCard(item.id)}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default FiscalInefficiency;
