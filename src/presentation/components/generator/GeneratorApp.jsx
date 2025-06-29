import { Box, CircularProgress, Container, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import VotingRecordGenerator from './RepresentativesVoting';

import { fetchBills, fetchParties, fetchRepresentatives, fetchVotingRecords, fetchVotingStages } from '../../../infrastructure/api/api';

const GeneratorApp = () => {
  const [representatives, setRepresentatives] = useState([]);
  const [parties, setParties] = useState([]);
  const [bills, setBills] = useState([]);
  const [stages, setStages] = useState([]);
  const [votingRecords, setVotingRecords] = useState([]);
  const [initialVotes, setInitialVotes] = useState([]);
  const [selectedBill, setSelectedBill] = useState('');
  const [selectedStage, setSelectedStage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch initial data - representatives, parties, bills, stages, and voting records
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [representativesData, partiesData, bills, stages, votingRecords] = await Promise.all([
          fetchRepresentatives(),
          fetchParties(),
          fetchBills(),
          fetchVotingStages(),
          fetchVotingRecords(),
        ]);

        setRepresentatives(representativesData);
        setParties(partiesData);
        setBills(bills || []);
        setStages(stages || []);
        setVotingRecords(votingRecords || []);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle bill selection change
  const handleBillChange = (event) => {
    setSelectedBill(event.target.value);
    setSelectedStage(''); // Reset stage when bill changes
    setInitialVotes([]); // Clear votes when bill changes
  };

  // Handle stage selection change
  const handleStageChange = (event) => {
    const stageId = parseInt(event.target.value, 10);
    setSelectedStage(stageId);

    // Find votes for the selected bill and stage
    if (selectedBill && stageId) {
      const record = votingRecords.find((record) => record.billId === selectedBill && record['voting-stage'] === stageId);

      if (record && record.votes) {
        setInitialVotes(record.votes);
      } else {
        setInitialVotes([]);
      }
    }
  };

  // Handle voting data export
  const handleVotingDataGenerated = (votingData) => {
    // In a real app, you might want to save this to a file or send to a server

    // Example: Download as JSON file
    const dataStr = JSON.stringify(
      {
        billId: selectedBill,
        'voting-stage': selectedStage,
        date: new Date().toISOString().split('T')[0],
        votes: votingData,
      },
      null,
      2
    );

    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `voting_data_${selectedBill}_stage${selectedStage}.json`;
    link.click();

    URL.revokeObjectURL(url);
  };

  // Get bill title from ID
  const getBillTitle = (billId) => {
    const bill = bills.find((b) => b.id === billId);
    return bill ? bill.shortTitle : billId;
  };

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', mt: 5 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading data...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 5 }}>
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center', backgroundColor: '#fff0f0' }}>
          <Typography variant="h6" color="error">
            {error}
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Voting Record Management
        </Typography>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          {/* Bill Selector */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="bill-select-label">Select Bill</InputLabel>
              <Select labelId="bill-select-label" id="bill-select" value={selectedBill} label="Select Bill" onChange={handleBillChange}>
                <MenuItem value="">
                  <em>Select a bill</em>
                </MenuItem>
                {bills.map((bill) => (
                  <MenuItem key={bill.id} value={bill.id}>
                    {bill.id} - {bill.shortTitle.length > 50 ? bill.title.substring(0, 50) + '...' : bill.shortTitle}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Stage Selector */}
          <Grid item xs={12} md={6}>
            <FormControl fullWidth disabled={!selectedBill}>
              <InputLabel id="stage-select-label">Select Voting Stage</InputLabel>
              <Select
                labelId="stage-select-label"
                id="stage-select"
                value={selectedStage}
                label="Select Voting Stage"
                onChange={handleStageChange}
              >
                <MenuItem value="">
                  <em>Select a voting stage</em>
                </MenuItem>
                {stages.map((stage) => (
                  <MenuItem key={stage.id} value={stage.id}>
                    {stage.name} - {stage.description || ''}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {selectedBill && selectedStage ? (
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6">Current Selection:</Typography>
            <Typography variant="body1">
              Bill: {selectedBill} - {getBillTitle(selectedBill)}
            </Typography>
            <Typography variant="body1">Stage: {stages.find((s) => s.id === selectedStage)?.name || selectedStage}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {initialVotes.length > 0
                ? `Loaded ${initialVotes.length} existing votes for this bill and stage.`
                : 'No existing votes found for this bill and stage. Starting with a clean slate.'}
            </Typography>
          </Box>
        ) : (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
            Please select both a bill and a voting stage to continue.
          </Typography>
        )}
      </Paper>

      {selectedBill && selectedStage && (
        <VotingRecordGenerator
          representatives={representatives}
          parties={parties}
          initialVotes={initialVotes}
          onVotingDataGenerated={handleVotingDataGenerated}
        />
      )}
    </Container>
  );
};

export default GeneratorApp;
