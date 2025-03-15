import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { fetchChamber2, fetchParties, fetchSenators } from '../../api/api';
import CodeIcon from '@mui/icons-material/Code';

const CongressList = () => {
  // State for congress members and filters
  const [congressType, setCongressType] = useState('senate'); // 'senate' or 'chamber'
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    name: '',
    partyId: '',
  });

  // Fetch parties on component mount
  useEffect(() => {
    const loadParties = async () => {
      try {
        const partiesData = await fetchParties();
        setParties(partiesData);
      } catch (err) {
        console.error('Error loading parties:', err);
        setError('Failed to load parties data.');
      }
    };

    loadParties();
  }, []);

  // Fetch congress members based on selected type
  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      try {
        let data;
        if (congressType === 'senate') {
          data = await fetchSenators();
        } else {
          data = await fetchChamber2();
        }
        setMembers(data);
        setFilteredMembers(data);
      } catch (err) {
        console.error(`Error loading ${congressType} members:`, err);
        setError(`Failed to load ${congressType} members data.`);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [congressType]);

  // Apply filters when they change
  useEffect(() => {
    if (members.length === 0) return;

    let filtered = [...members].filter(
      (member) =>
        (!filters.name || (filters.name && filters.name.length > 2 && member.name.toLowerCase().includes(filters.name.toLowerCase()))) &&
        (!filters.partyId || (filters.partyId && member.party_id === filters.partyId))
    );

    setFilteredMembers(filtered);
  }, [filters, members]);

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle congress type change
  const handleCongressTypeChange = (event) => {
    setCongressType(event.target.value);
    // Reset filters when changing congress type
    setFilters({
      name: '',
      partyId: '',
    });
  };

  // Get party name from party ID
  const getPartyName = (partyId) => {
    if (!parties) return partyId;
    const party = parties.find((p) => p.id === partyId);
    return party ? party.name : partyId;
  };

  // Get party color based on party ID (simplified version)
  const getPartyColor = (partyId) => {
    const colorMap = {
      PL: '#cc0000', // Liberal
      PC: '#1863dc', // Conservador
      CD: '#234874', // Centro Democrático
      AV: '#008138', // Alianza Verde
      CR: '#00539b', // Cambio Radical
      PDA: '#FEEC2D', // Polo Democrático
      COM: '#cc3366', // Comunes
      PU: '#FF9900', // Partido de la U - Orange
      CH: '#660066', // Colombia Humana - Purple
      CITREP: '#009999', // CITREP - Teal
      MAIS: '#006633', // MAIS - Dark Green
      LIGA: '#FF6600', // Liga - Orange
      PH: '#CC3366', // Pacto Histórico - Pink
      VO: '#33CC33', // Verde Oxígeno - Light Green
    };

    return colorMap[partyId] || '#AAAAAA'; // Default gray
  };

  // Handle console log functionality
  const handlePrintToConsole = () => {
    // Log to console
    // console.log('Congress Members Data:', congressData.members);

    // Create a new array with only name and party_id fields
    const data = filteredMembers.map((member) => ({
      id: member.id,
      name: member.name,
      party_id: member.party_id,
      party_name: getPartyName(member.party_id),
    }));

    // console.log('Congress Members Data:', newMembers);
    console.log(JSON.stringify(data, null, 2));

    // Add a more visible message for users
    // console.log(
    //   '%c Congress Members data has been printed to console',
    //   'background: #4CAF50; color: white; padding: 5px; border-radius: 3px;'
    // );
  };

  if (loading && members.length === 0) {
    return (
      <Container sx={{ textAlign: 'center', mt: 5 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading data...
        </Typography>
      </Container>
    );
  }

  if (error && members.length === 0) {
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
          Congresistas
        </Typography>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          {/* Congress Type Selector */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id="congress-type-label">Cámara</InputLabel>
              <Select
                labelId="congress-type-label"
                id="congress-type-select"
                value={congressType}
                label="Cámara"
                onChange={handleCongressTypeChange}
              >
                <MenuItem value="senate">Senado</MenuItem>
                <MenuItem value="chamber">Cámara de Representantes</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Name Filter */}
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Por Nombre"
              variant="outlined"
              value={filters.name}
              onChange={(e) => handleFilterChange('name', e.target.value)}
              helperText="Al menos 3 caracteres"
            />
          </Grid>

          {/* Party Filter */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Por Partido</InputLabel>
              <Select value={filters.partyId} label="Filter by Party" onChange={(e) => handleFilterChange('partyId', e.target.value)}>
                <MenuItem value="">
                  <em>Todos...</em>
                </MenuItem>
                {parties &&
                  parties.map((party) => (
                    <MenuItem key={party.id} value={party.id}>
                      {party.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Statistics and Console Log Button */}
        {/* <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="subtitle1">
              Showing {filteredMembers.length} of {members.length} members
            </Typography>
            <Typography variant="subtitle1">{congressType === 'senate' ? 'Senado' : 'Cámara de Representantes'}</Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<CodeIcon />}
            onClick={handlePrintToConsole}
            disabled={filteredMembers.length === 0}
          >
            Print to Console
          </Button>
        </Box> */}
      </Paper>

      {/* Members List */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {filteredMembers.map((member) => (
            <Grid item xs={12} sm={6} md={4} key={member.id}>
              <Card
                sx={{
                  mb: 2,
                  borderLeft: `4px solid ${getPartyColor(member.party_id)}`,
                }}
              >
                <CardContent>
                  <Typography variant="h6" component="div">
                    {member.name}
                  </Typography>
                  <Chip
                    label={getPartyName(member.party_id)}
                    size="small"
                    sx={{
                      backgroundColor: getPartyColor(member.party_id),
                      color: '#FFFFFF',
                      mb: 1,
                    }}
                  />
                  {member.social_media && (
                    <Typography variant="body2" color="text.secondary">
                      {member.social_media}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default CongressList;
