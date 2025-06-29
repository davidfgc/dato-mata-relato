import { Cancel, CheckCircle, MoreHoriz } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import type Representative from '../../../domain/representative';
import type Party from '../../../domain/party';
import type RepresentativeVote from '../../../domain/representative-vote';

// Types specific to this component
type VoteValue = 'yes' | 'no' | 'absent';

interface VotingFilters {
  name: string;
  partyId: string;
  hideVoted: boolean;
}

// Extension of domain types for component needs
interface RepresentativeWithVote extends Representative {
  vote?: VoteValue | null;
}

// Props using domain types
interface VotingRecordGeneratorProps {
  representatives: Representative[];
  parties: Party[];
  initialVotes?: RepresentativeVote[];
}

const VotingRecordGenerator = ({ representatives, parties, initialVotes = [] }: VotingRecordGeneratorProps) => {
  // State for the representatives data and votes
  const [filteredReps, setFilteredReps] = useState<RepresentativeWithVote[]>([]);
  const [allReps, setAllReps] = useState<RepresentativeWithVote[]>([]);
  const [votes, setVotes] = useState<Record<number, VoteValue>>({});
  const [filters, setFilters] = useState<VotingFilters>({
    name: '',
    partyId: '',
    hideVoted: false,
  });

  // Initialize representatives with voting state and load initial votes
  useEffect(() => {
    if (representatives && representatives.length > 0) {
      const repsWithVoting: RepresentativeWithVote[] = representatives.map((rep) => ({
        ...rep,
        vote: null, // Initially no vote
      }));
      setAllReps(repsWithVoting);

      // Process initial votes if provided
      if (initialVotes && initialVotes.length > 0) {
        const votesObj: Record<number, VoteValue> = {};
        initialVotes.forEach((vote) => {
          if (vote.vote === 'yes' || vote.vote === 'no' || vote.vote === 'absent') {
            votesObj[vote.representativeId] = vote.vote as VoteValue;
          }
        });
        setVotes(votesObj);
      }
    }
  }, [representatives, initialVotes]);

  useEffect(() => {
    if (allReps.length === 0) return;

    let filtered = [...allReps].filter(
      (rep) =>
        (filters.name || filters.partyId) &&
        (!filters.name || (filters.name && filters.name.length > 2 && rep.name.toLowerCase().includes(filters.name.toLowerCase()))) &&
        (!filters.partyId || (filters.partyId && rep.party_id === filters.partyId)) &&
        (!filters.hideVoted || (filters.hideVoted && !votes[rep.id]))
    );

    setFilteredReps(filtered);
  }, [filters, allReps, votes]);

  // Handle vote selection
  const handleVote = (repId: number, voteValue: string) => {
    if (voteValue === 'yes' || voteValue === 'no' || voteValue === 'absent') {
      setVotes((prev) => ({
        ...prev,
        [repId]: voteValue as VoteValue,
      }));
    }
  };

  // Handle filter changes
  const handleFilterChange = (field: keyof VotingFilters, value: string | boolean) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Generate JSON with voting data
  const generateVotingData = (): RepresentativeVote[] => {
    const votingData: RepresentativeVote[] = Object.entries(votes).map(([repId, vote]) => ({
      representativeId: parseInt(repId, 10),
      vote,
    }));

    console.log(JSON.stringify(votingData, null, 2));
    return votingData;
  };

  // Get party name from party ID
  const getPartyName = (partyId: string): string => {
    if (!parties) return partyId;
    const party = parties.find((p) => p.id === partyId);
    return party ? party.name : partyId;
  };

  // Get party color based on party ID (simplified version)
  const getPartyColor = (partyId: string): string => {
    const colorMap: Record<string, string> = {
      PL: '#cc0000', // Liberal
      PC: '#1863dc', // Conservador
      CD: '#234874', // Centro Democrático
      AV: '#008138', // Alianza Verde
      CR: '#00539b', // Cambio Radical to #ce0610
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

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Representatives Voting Panel
        </Typography>

        {/* Filters Section */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Filter by Name"
              variant="outlined"
              value={filters.name}
              onChange={(e) => handleFilterChange('name', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Filter by Party</InputLabel>
              <Select 
                value={filters.partyId} 
                label="Filter by Party" 
                onChange={(e) => handleFilterChange('partyId', e.target.value as string)}
              >
                <MenuItem value="">
                  <em>All Parties</em>
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

          <Grid item xs={12} md={4}>
            <FormControlLabel
              control={<Checkbox checked={filters.hideVoted} onChange={(e) => handleFilterChange('hideVoted', e.target.checked)} />}
              label="Hide Representatives Already Voted"
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Generate JSON Button */}
        <Button variant="contained" color="primary" onClick={generateVotingData} sx={{ mb: 3 }}>
          Generate Voting Data
        </Button>

        {/* Statistics */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1">
            Showing {filteredReps.length} of {allReps.length} representatives
          </Typography>
          <Typography variant="subtitle1">Votes recorded: {Object.keys(votes).length}</Typography>
        </Box>
      </Paper>

      {/* Representatives List */}
      <Grid container spacing={2}>
        {filteredReps.map((rep) => (
          <Grid item xs={12} sm={6} md={4} key={rep.id}>
            <Card
              sx={{
                mb: 2,
                borderLeft: `4px solid ${getPartyColor(rep.party_id)}`,
                boxShadow: votes[rep.id] ? '0 0 10px rgba(0,0,0,0.2)' : 'none',
              }}
            >
              <CardContent>
                <Grid container spacing={1}>
                  <Grid item xs={8}>
                    <Typography variant="h6" component="div">
                      {rep.name}
                    </Typography>
                    <Chip
                      label={getPartyName(rep.party_id)}
                      size="small"
                      sx={{
                        backgroundColor: getPartyColor(rep.party_id),
                        color: '#FFFFFF',
                        mb: 1,
                      }}
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <FormControl component="fieldset">
                      <RadioGroup 
                        value={votes[rep.id] || ''} 
                        onChange={(e) => handleVote(rep.id, e.target.value)}
                      >
                        <FormControlLabel value="yes" control={<Radio size="small" color="success" />} label="Yes" />
                        <FormControlLabel value="no" control={<Radio size="small" color="error" />} label="No" />
                        <FormControlLabel value="absent" control={<Radio size="small" color="default" />} label="Absent" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                </Grid>

                {votes[rep.id] && (
                  <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    <Chip
                      icon={votes[rep.id] === 'yes' ? <CheckCircle /> : votes[rep.id] === 'no' ? <Cancel /> : <MoreHoriz />}
                      label={votes[rep.id].toUpperCase()}
                      color={votes[rep.id] === 'yes' ? 'success' : votes[rep.id] === 'no' ? 'error' : 'default'}
                      size="small"
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default VotingRecordGenerator;
