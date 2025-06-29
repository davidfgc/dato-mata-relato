import {
  Box,
  Button,
  ButtonGroup,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';

// Import the API functions
import { fetchBills, fetchParties, fetchRepresentatives, fetchVotingRecords, fetchVotingStages } from '../../../infrastructure/api/api';
import RepresentativesList from './RepresentativesList';

const VotingFilters = () => {
  // State for selections
  const [selectedBill, setSelectedBill] = useState('312/2024C');
  const [selectedStage, setSelectedStage] = useState(null);
  const [selectedParty, setSelectedParty] = useState('PL');
  const [voteFilter, setVoteFilter] = useState('yes');

  // Handle bill selection change - need to update available stages
  const handleBillChange = (billId) => {
    setSelectedBill(billId);

    // Find available stages for this bill
    const availableStages = votingRecords.filter((record) => record.billId === billId).map((record) => record['voting-stage']);

    // Select the latest stage if available
    if (availableStages.length > 0) {
      const latestStageId = Math.max(...availableStages);
      setSelectedStage(latestStageId);
    } else {
      setSelectedStage(null);
    }
  };

  // State for data
  const [bills, setBills] = useState([]);
  const [stages, setStages] = useState([]);
  const [parties, setParties] = useState([]);
  const [representatives, setRepresentatives] = useState([]);
  const [votingRecords, setVotingRecords] = useState([]);

  // State for loading status
  const [loading, setLoading] = useState(true);

  // Fetch all required data on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        const billsData = await fetchBills();
        setBills(billsData);

        const stagesData = await fetchVotingStages();
        setStages(stagesData);

        const partiesData = await fetchParties();
        setParties(partiesData);

        const repsData = await fetchRepresentatives();
        setRepresentatives(repsData);

        const votingData = await fetchVotingRecords();
        setVotingRecords(votingData);

        // After fetching, find available stages for the default bill
        const defaultBill = '312/2024C';
        const availableStages = votingData.filter((record) => record.billId === defaultBill).map((record) => record['voting-stage']);

        // Select the latest stage by default (highest ID)
        if (availableStages.length > 0) {
          const latestStageId = Math.max(...availableStages);
          setSelectedStage(latestStageId);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Find the current voting record based on bill and stage
  const currentVotingRecord = votingRecords.find((record) => record.billId === selectedBill && record['voting-stage'] === selectedStage);

  // Filter representatives by party and vote
  const filteredRepresentatives = currentVotingRecord
    ? representatives.filter((rep) => {
        // First filter by party (if 'ALL' is selected, skip party filter)
        if (selectedParty !== 'ALL' && rep.party_id !== selectedParty) {
          return false;
        }

        // Then find their vote in the current voting record
        const vote = currentVotingRecord.votes.find((v) => v.representativeId === rep.id);

        // Apply vote filter
        if (voteFilter === 'all') return vote !== undefined;
        if (voteFilter === 'yes') return vote && vote.vote === 'yes';
        if (voteFilter === 'no') return vote && vote.vote === 'no';

        return false;
      })
    : [];

  // Get vote status for a representative
  const getVoteStatus = (repId) => {
    if (!currentVotingRecord) return 'unknown';

    const vote = currentVotingRecord.votes.find((v) => v.representativeId === repId);
    return vote ? vote.vote : 'absent';
  };

  // // Get color based on vote status
  // const getVoteColor = (status) => {
  //   switch (status) {
  //     case 'yes':
  //       return 'success.main';
  //     case 'no':
  //       return 'error.main';
  //     case 'absent':
  //       return 'text.disabled';
  //     default:
  //       return 'text.secondary';
  //   }
  // };

  // // Get icon based on vote status
  // const getVoteIcon = (status) => {
  //   switch (status) {
  //     case 'yes':
  //       return <CheckCircleIcon color="success" />;
  //     case 'no':
  //       return <CancelIcon color="error" />;
  //     default:
  //       return <HelpIcon color="disabled" />;
  //   }
  // };

  // Get party name for a representative
  const getPartyName = (partyId) => {
    const party = parties.find((p) => p.id === partyId);
    return party ? party.name : partyId;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Proyecto de Ley</InputLabel>
            <Select value={selectedBill} label="Proyecto de Ley" onChange={(e) => handleBillChange(e.target.value)}>
              {bills.map((bill) => (
                <MenuItem key={bill.id} value={bill.id}>
                  {bill.id} - {bill.shortTitle}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Etapa de Votación</InputLabel>
            <Select value={selectedStage} label="Etapa de Votación" onChange={(e) => setSelectedStage(e.target.value)}>
              {stages
                .filter((stage) => {
                  // Only show stages that have voting records for the selected bill
                  return votingRecords.some((record) => record.billId === selectedBill && record['voting-stage'] === stage.id);
                })
                .map((stage) => (
                  <MenuItem key={stage.id} value={stage.id}>
                    {stage.name} - {stage.description || ''}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Partido</InputLabel>
            <Select value={selectedParty} label="Partido" onChange={(e) => setSelectedParty(e.target.value)}>
              <MenuItem value="ALL">Todos los partidos</MenuItem>
              {parties.map((party) => (
                <MenuItem key={party.id} value={party.id}>
                  {party.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        {currentVotingRecord && (
          <ButtonGroup aria-label="filter votes">
            {(() => {
              // Get all representatives that match the party filter (or all if ALL is selected)
              const filteredByParty = representatives.filter((rep) => selectedParty === 'ALL' || rep.party_id === selectedParty);

              // Get their IDs for easier lookup
              const filteredRepIds = new Set(filteredByParty.map((rep) => rep.id));

              // Count votes from the current voting record that match our party filter
              const filteredVotes = currentVotingRecord.votes.filter((v) => filteredRepIds.has(v.representativeId));

              // Calculate vote counts for the filtered group
              const yesVotes = filteredVotes.filter((v) => v.vote === 'yes').length;
              const noVotes = filteredVotes.filter((v) => v.vote === 'no').length;

              return (
                <>
                  <Button
                    onClick={() => setVoteFilter('yes')}
                    color={voteFilter === 'yes' ? 'success' : 'primary'}
                    variant={voteFilter === 'yes' ? 'contained' : 'outlined'}
                  >
                    A Favor ({yesVotes})
                  </Button>
                  <Button
                    onClick={() => setVoteFilter('no')}
                    color={voteFilter === 'no' ? 'error' : 'primary'}
                    variant={voteFilter === 'no' ? 'contained' : 'outlined'}
                  >
                    En Contra ({noVotes})
                  </Button>
                  <Button
                    onClick={() => setVoteFilter('all')}
                    color={voteFilter === 'all' ? 'info' : 'primary'}
                    variant={voteFilter === 'all' ? 'contained' : 'outlined'}
                  >
                    Todos
                  </Button>
                </>
              );
            })()}
          </ButtonGroup>
        )}
      </Box>

      {currentVotingRecord ? (
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            {currentVotingRecord.warning && <Chip label={currentVotingRecord.warning} color="warning" sx={{ ml: 2 }} />}
          </Typography>
        </Box>
      ) : (
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom color="error">
            No hay registros de votación para esta selección
          </Typography>
        </Box>
      )}

      <RepresentativesList
        representatives={filteredRepresentatives}
        getVoteStatus={getVoteStatus}
        showParty={selectedParty === 'ALL'}
        getPartyName={getPartyName}
      />
    </Container>
  );
};

export default VotingFilters;
