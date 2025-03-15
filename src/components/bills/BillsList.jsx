import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Box, CircularProgress, List, ListItem, ListItemButton, ListItemText, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchBills } from '../../api/api';

const BillsList = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBills = async () => {
      try {
        setLoading(true);
        const data = await fetchBills();

        // Sort bills by date (newest to oldest)
        const sortedBills = [...data].sort((a, b) => {
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
    const parts = id.split('/');
    return `/reformas/${parts[1]}/${parts[0]}/votacion`;
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
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto', my: 4, px: 2 }}>
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
                  <ArrowForwardIosIcon fontSize="small" color="action" />
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
