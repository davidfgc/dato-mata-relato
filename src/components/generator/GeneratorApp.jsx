import { CircularProgress, Container, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import RepresentativesVoting from './RepresentativesVoting';

import { fetchParties, fetchRepresentatives } from '../../api/api';

const GeneratorApp = () => {
  const [representatives, setRepresentatives] = useState([]);
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [representativesData, partiesData] = await Promise.all([
          fetchRepresentatives(),
          fetchParties(),
        ]);
              
        setRepresentatives(representativesData);
        setParties(partiesData);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle voting data export
  const handleVotingDataGenerated = (votingData) => {
    // In a real app, you might want to save this to a file or send to a server
    console.log('Voting data generated:', votingData);

    // Example: Download as JSON file
    const dataStr = JSON.stringify(votingData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'voting_data.json';
    link.click();

    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', mt: 5 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading representatives data...
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
      <RepresentativesVoting representatives={representatives} parties={parties} onVotingDataGenerated={handleVotingDataGenerated} />
    </Container>
  );
};

export default GeneratorApp;
