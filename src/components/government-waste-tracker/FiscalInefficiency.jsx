import {
  Error as ErrorIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Info as InfoIcon,
  Link as LinkIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { Alert, Box, Collapse, Divider, IconButton, Paper, Stack, Typography } from '@mui/material';
import { CircularProgress } from '@mui/material';

import { useEffect } from 'react';
import { useState } from 'react';

import { ENDPOINTS } from '../../config/api';

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
          data.fiscalMismatches
            .filter((item) => new Date(item.date) > cutoffDate)
            .sort((a, b) => new Date(b.date) - new Date(a.date))
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

  // Calculate days since government started
  const governmentStartDate = new Date('2022-08-07');
  const today = new Date();
  const daysSince = Math.floor((today - governmentStartDate) / (1000 * 60 * 60 * 24));

  // Calculate total waste
  const totalWaste = fiscalMismatches.reduce((sum, item) => sum + item.amount, 0);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  // Format number to Colombian Peso
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00-05:00');
    const month = date.toLocaleDateString('es-CO', { month: 'short' });
    const day = date.getDate();
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const toggleCard = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <Box sx={{ maxWidth: 'lg', mx: 'auto', p: 3 }}>
      {/* Total Waste */}
      <Alert
        icon={<ErrorIcon />}
        severity="error"
        sx={{
          mb: 4,
          '& .MuiAlert-message': {
            width: '100%', // This ensures the message container takes full width
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            alignItems: 'center',
          }}
        >
          <Typography>Total Dinero Desperdiciado:</Typography>
          <Typography fontWeight="medium">{formatCurrency(totalWaste)}</Typography>
        </Box>
      </Alert>

      {/* Average per day */}
      <Alert
        icon={<WarningIcon />}
        severity="warning"
        sx={{
          mb: 4,
          '& .MuiAlert-message': {
            width: '100%', // This ensures the message container takes full width
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            alignItems: 'center',
          }}
        >
          <Typography>Promedio diario:</Typography>
          <Typography fontWeight="medium">{formatCurrency(totalWaste / daysSince)}</Typography>
        </Box>
      </Alert>

      <Alert
        icon={<InfoIcon />}
        severity="info"
        sx={{
          mb: 4,
          '& .MuiAlert-message': {
            width: '100%', // This ensures the message container takes full width
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            alignItems: 'center',
          }}
        >
          <Typography>Días desde inicio de gobierno:</Typography>
          <Typography fontWeight="medium">{daysSince} días</Typography>
        </Box>
      </Alert>

      {/* Timeline */}
      <Stack spacing={2}>
        {fiscalMismatches.map((item, index) => (
          <Box key={item.id} sx={{ display: 'flex', gap: 2 }}>
            {/* Date Column */}
            <Box sx={{ width: 120, textAlign: 'right', pt: 2 }}>
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
              {index !== fiscalMismatches.length - 1 && (
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
            <Box sx={{ flexGrow: 1, pb: 2 }}>
              <Paper
                elevation={expandedCard === item.id ? 2 : 1}
                sx={{
                  cursor: 'pointer',
                  '&:hover': { boxShadow: 3 },
                  transition: 'box-shadow 200ms',
                }}
                onClick={() => toggleCard(item.id)}
              >
                <Box sx={{ p: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: 2,
                    }}
                  >
                    <Box>
                      <Typography variant="h6" component="div">
                        {item.title}
                      </Typography>
                      {/* <Collapse in={expandedCard === item.id}> */}
                      <Typography variant="body2" color="text.secondary" textAlign={{ xs: 'left' }}>
                        Ver fuentes
                      </Typography>
                      {/* </Collapse> */}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <Typography variant="h6" color="error.main">
                        {formatCurrency(item.amount)}
                      </Typography>
                      <IconButton size="small" sx={{ mt: -0.5 }}>
                        {expandedCard === item.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </Box>
                  </Box>

                  <Collapse in={expandedCard === item.id}>
                    <Box sx={{ mt: 2 }}>
                      <Divider />
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Fuentes:
                        </Typography>
                        <Stack spacing={1}>
                          {item.sources.map((source, sourceIndex) => (
                            <Box
                              key={sourceIndex}
                              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                            >
                              <LinkIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <a
                                href={source}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  color: '#1976d2',
                                  textDecoration: 'none',
                                  '&:hover': {
                                    textDecoration: 'underline',
                                  },
                                }}
                              >
                                <Typography variant="body2">{source}</Typography>
                              </a>
                            </Box>
                          ))}
                        </Stack>
                      </Box>
                    </Box>
                  </Collapse>
                </Box>
              </Paper>
            </Box>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default FiscalInefficiency;
