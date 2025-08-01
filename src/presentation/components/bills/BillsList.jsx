import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Box, CircularProgress, List, ListItem, ListItemButton, ListItemText, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchBills } from '../../../infrastructure/api/api';
import StatusChip from '../../../shared/components/ui/StatusChip';

const BillsList = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBills = async () => {
      try {
        setLoading(true);
        const data = await fetchBills();

        // Filter out hidden bills and sort by date (newest to oldest)
        const visibleBills = data.filter((bill) => !bill.hidden);
        const sortedBills = [...visibleBills].sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });

        setBills(sortedBills);
        setError(null);
      } catch (err) {
        console.error('Error fetching bills:', err);
        setError('Failed to load bills. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadBills();
  }, []);

  // Format the bill ID for display and navigation
  const formatBillPath = (id) => {
    // Original formatting for voting records
    if (id.includes('/')) {
      const parts = id.split('/');
      return `/reformas/${parts[0]}/${parts[1]}/votacion`;
      // return `/reformas/${parts[1]}/${parts[0]}`;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box my={4}>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 'sm', mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Reformas
      </Typography>

      <Paper elevation={2}>
        <List>
          {bills.length > 0 ? (
            bills.map((bill) => (
              <ListItem key={bill.id} disablePadding divider>
                <ListItemButton component={Link} to={formatBillPath(bill.id)}>
                  <ListItemText primary={`${bill.shortTitle}: ${bill.id}`} secondary={new Date(bill.date).toLocaleDateString()} />
                  <StatusChip status={bill.status} />
                  <ArrowForwardIosIcon fontSize="small" color="action" sx={{ marginLeft: 1 }} />
                </ListItemButton>
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No bills available" />
            </ListItem>
          )}
        </List>
      </Paper>
    </Box>
  );
};

export default BillsList;
