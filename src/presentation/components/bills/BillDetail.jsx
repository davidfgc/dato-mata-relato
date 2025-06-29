import LinkIcon from '@mui/icons-material/Link';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Grid,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchBills } from '../../../infrastructure/api/api';
import BillCard from '../voting/BillCard';

const BillDetail = () => {
  const { year, id } = useParams();
  const billId = `${id}/${year}`;
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getBill = async () => {
      try {
        setLoading(true);
        const bills = await fetchBills();
        const foundBill = bills.find((b) => b.id === billId);

        if (foundBill) {
          setBill(foundBill);
        } else {
          setError(`Bill with ID ${billId} not found`);
        }
      } catch (err) {
        console.error('Error fetching bill:', err);
        setError('Failed to load bill. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (billId) {
      getBill();
    }
  }, [billId]);

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

  if (!bill) {
    return (
      <Box my={4}>
        <Typography align="center">Bill not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 'lg', mx: 'auto', py: 3 }}>
      {/* <Card elevation={3} sx={{ overflow: 'hidden', borderRadius: 2 }}> */}
      <BillCard bill={bill} />

      <Box sx={{ p: 3 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
              {bill.title}
            </Typography>

            {bill.tags && bill.tags.length > 0 && (
              <Box sx={{ mb: 4, mt: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Tags
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {bill.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size="small"
                      sx={{
                        mb: 1,
                        borderRadius: 1,
                        fontWeight: 500,
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            )}

            {bill.sources && bill.sources.length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Sources & References
                </Typography>
                <Card variant="outlined" sx={{ borderRadius: 2, mt: 1 }}>
                  <List sx={{ p: 0 }}>
                    {bill.sources.map((source, index) => (
                      <ListItem
                        key={index}
                        component={Link}
                        href={source.url}
                        target="_blank"
                        sx={{
                          borderBottom: index !== bill.sources.length - 1 ? '1px solid' : 'none',
                          borderColor: 'divider',
                          '&:hover': { bgcolor: 'action.hover' },
                        }}
                      >
                        <ListItemIcon>
                          <LinkIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={source.title || source.url} secondary={source.description || 'External reference'} />
                        <ListItemIcon>
                          <OpenInNewIcon fontSize="small" />
                        </ListItemIcon>
                      </ListItem>
                    ))}
                  </List>
                </Card>
              </Box>
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              variant="outlined"
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <CardHeader
                title="Bill Information"
                sx={{
                  bgcolor: 'background.paper',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}
              />
              <CardContent>
                <List disablePadding>
                  <ListItem
                    sx={{
                      px: 0,
                      py: 1.5,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <ListItemText
                      primary="Author"
                      secondary={bill.authorRole}
                      primaryTypographyProps={{ color: 'text.secondary', variant: 'body2' }}
                      secondaryTypographyProps={{ color: 'text.primary', variant: 'body1', fontWeight: 'medium' }}
                    />
                    <Typography variant="body1" fontWeight="medium">
                      {bill.author}
                    </Typography>
                  </ListItem>

                  <ListItem
                    sx={{
                      px: 0,
                      py: 1.5,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <ListItemText primary="Committee" primaryTypographyProps={{ color: 'text.secondary', variant: 'body2' }} />
                    <Typography variant="body1" fontWeight="medium">
                      {bill.committee || 'N/A'}
                    </Typography>
                  </ListItem>

                  {bill.legislature && (
                    <ListItem
                      sx={{
                        px: 0,
                        py: 1.5,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <ListItemText primary="Legislature" primaryTypographyProps={{ color: 'text.secondary', variant: 'body2' }} />
                      <Typography variant="body1" fontWeight="medium">
                        {bill.legislature}
                      </Typography>
                    </ListItem>
                  )}

                  {bill.origin && (
                    <ListItem
                      sx={{
                        px: 0,
                        py: 1.5,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <ListItemText primary="Origin" primaryTypographyProps={{ color: 'text.secondary', variant: 'body2' }} />
                      <Typography variant="body1" fontWeight="medium">
                        {bill.origin}
                      </Typography>
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>

            {bill.coordinators && bill.coordinators.length > 0 && (
              <Card
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  overflow: 'hidden',
                  mt: 3,
                }}
              >
                <CardHeader
                  title="Coordinators"
                  sx={{
                    bgcolor: 'background.paper',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  }}
                />
                <CardContent>
                  <List disablePadding>
                    {bill.coordinators.map((coordinator, index) => (
                      <ListItem
                        key={index}
                        sx={{
                          px: 0,
                          py: 1,
                          borderBottom: index !== bill.coordinators.length - 1 ? '1px solid' : 'none',
                          borderColor: 'divider',
                        }}
                      >
                        <ListItemText primary={coordinator} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default BillDetail;
