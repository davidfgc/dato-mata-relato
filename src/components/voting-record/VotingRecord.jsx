import { Cancel as CancelIcon, CheckCircle as CheckCircleIcon, ExpandLess as ExpandLessIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Collapse,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import _ from 'lodash';



import { useEffect, useState } from 'react';

const VotingRecord = () => {
  const [expandedParty, setExpandedParty] = useState(null);
  const [bill, setBill] = useState(null);
  const [votes, setVotes] = useState([]);
  const [parties, setParties] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [billsResponse, votesResponse, repsResponse, partiesResponse] = await Promise.all([
          fetch('https://davidfgc.github.io/dato-mata-relato/data/bills.json'),
          fetch('https://davidfgc.github.io/dato-mata-relato/data/votes.json'),
          fetch('https://davidfgc.github.io/dato-mata-relato/data/representatives.json'),
          fetch('https://davidfgc.github.io/dato-mata-relato/data/parties.json'),
        ]);

        const [billsData, votesData, repsData, partiesData] = await Promise.all([
          billsResponse.json(),
          votesResponse.json(),
          repsResponse.json(),
          partiesResponse.json(),
        ]);

        const partiesLookup = partiesData.parties.reduce((acc, party) => {
          acc[party.id] = party;
          return acc;
        }, {});

        const foundBill = billsData.bills.find((b) => b.id === '312/2024C');
        if (!foundBill) {
          throw new Error('Bill not found');
        }

        const billVotes = votesData.votes
          .filter((vote) => vote.billId === '312/2024C')
          .map((vote) => {
            const representative = repsData.representatives.find(
              (rep) => rep.id === vote.representativeId
            );
            const partyId = representative?.party_id;
            const party = partiesLookup[partyId];
            return {
              ...vote,
              representative: representative?.name || 'Unknown',
              party: party?.name || 'Unknown Party',
              partyId: partyId,
              partyInfo: party,
            };
          })
          .sort((a, b) => a.representative.localeCompare(b.representative));

        setBill(foundBill);
        setVotes(billVotes);
        setParties(partiesLookup);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Error loading data: {error}
      </Alert>
    );
  }

  if (!bill) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        No bill found with the specified ID
      </Alert>
    );
  }

  const groupedVotes = _.groupBy(votes, 'party');
  const partyStats = Object.entries(groupedVotes).map(([partyName, partyVotes]) => {
    const sampleVote = partyVotes[0];
    return {
      party: partyName,
      partyInfo: sampleVote.partyInfo,
      votes: partyVotes,
      favor: partyVotes.filter((v) => v.vote === 'favor').length,
      contra: partyVotes.filter((v) => v.vote === 'contra').length,
    };
  });

  return (
    <Box sx={{ maxWidth: 'lg', mx: 'auto', p: 3 }}>
      {/* Bill Information Card */}
      <Card elevation={2} sx={{ mb: 3 }}>
        <CardContent>
          <Grid container justifyContent={'space-between'}>
            <Grid xs justifyItems={'flex-start'}>
              <Typography variant="h5" component="h1" gutterBottom>
                {bill.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {bill.type} • {bill.legislature}
              </Typography>
              <Typography variant="body2">{bill.author}</Typography>
              <Typography variant="body2" color="text.secondary">
                {bill.authorRole}
              </Typography>
            </Grid>
            <Grid>
              <Stack spacing={1} alignItems="flex-end">
                <Chip label={bill.status} size="small" color="warning" variant="outlined" />
                <Typography variant="body2" color="text.secondary">
                  {bill.date}
                </Typography>
              </Stack>
            </Grid>
          </Grid>

          <Typography variant="body1" sx={{ my: 2 }} textAlign={'justify'}>
            {bill.description}
          </Typography>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {bill.tags?.map((tag) => (
              <Chip key={tag} label={tag} size="small" sx={{ mb: 1 }} />
            ))}
            {bill.committee && (
              <Chip
                label={bill.committee}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ mb: 1 }}
              />
            )}
            {bill.origin && (
              <Chip
                label={bill.origin}
                size="small"
                color="secondary"
                variant="outlined"
                sx={{ mb: 1 }}
              />
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Party Voting Records */}
      <Stack spacing={2}>
        {partyStats.map(({ party, partyInfo, votes, favor, contra }) => (
          <Paper
            key={party}
            elevation={1}
            sx={{
              '&:hover': {
                boxShadow: 2,
                cursor: 'pointer',
              },
            }}
            onClick={() => setExpandedParty(expandedParty === party ? null : party)}
          >
            <Box sx={{ p: 2 }}>
              <Grid container justifyContent="space-between">
                <Stack direction="row" spacing={1} alignItems="center">
                  <Tooltip
                    title={
                      partyInfo
                        ? `Fundado en ${partyInfo.founding_year}
                    Posición: ${partyInfo.position}
                    Ideología: ${partyInfo.ideology.join(', ')}`
                        : ''
                    }
                  >
                    <Typography variant="subtitle1" sx={{ cursor: 'help' }}>
                      {party}
                    </Typography>
                  </Tooltip>
                  <Chip
                    label={favor > contra ? 'A favor' : contra > favor ? 'En contra' : 'Empate'}
                    size="small"
                    color={favor > contra ? 'success' : contra > favor ? 'error' : 'default'}
                    variant="outlined"
                  />
                </Stack>

                <Grid xs="auto" container spacing={2} alignItems="center">
                  <Box
                    sx={{ color: 'success.main', display: 'flex', alignItems: 'center', gap: 0.5 }}
                  >
                    <CheckCircleIcon fontSize="small" />
                    <Typography>{favor}</Typography>
                  </Box>
                  <Grid>
                    <Box
                      sx={{ color: 'error.main', display: 'flex', alignItems: 'center', gap: 0.5 }}
                    >
                      <CancelIcon fontSize="small" />
                      <Typography>{contra}</Typography>
                    </Box>
                  </Grid>
                  <Grid>
                    <IconButton size="small">
                      {expandedParty === party ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>

              <Collapse in={expandedParty === party}>
                <Box sx={{ mt: 2, ml: 2 }}>
                  <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                    {votes.map((vote, index) => (
                      <Chip
                        key={index}
                        icon={vote.vote === 'favor' ? <CheckCircleIcon /> : <CancelIcon />}
                        label={vote.representative}
                        color={vote.vote === 'favor' ? 'success' : 'error'}
                        variant="outlined"
                        size="medium"
                      />
                    ))}
                  </Stack>
                </Box>
              </Collapse>
            </Box>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
};

export default VotingRecord;