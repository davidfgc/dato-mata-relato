import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { fetchLocations } from '../../api/api';

const ChamberMap = () => {
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedParty, setSelectedParty] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [parties, setParties] = useState([]);
  const [regions, setRegions] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchLocations();

        // Sort locations by 'category', with 'mesa' first, 'secretaria' second, and 'integrante' last
        const sortedData = [...data].sort((a, b) => {
          const categoryOrder = { mesa: 0, secretaria: 1, integrante: 2 };
          return categoryOrder[a.category] - categoryOrder[b.category];
        });

        setLocations(sortedData);
        setFilteredLocations(sortedData);

        // Extract unique parties and regions
        const uniqueParties = new Set();
        const uniqueRegions = new Set();

        data.forEach((location) => {
          if (location.about) {
            const parts = location.about.split('|');
            if (parts.length > 0) {
              uniqueRegions.add(parts[0]);
            }
            if (parts.length > 1) {
              uniqueParties.add(parts[1]);
            }
          }
        });

        setParties(Array.from(uniqueParties).sort());
        setRegions(Array.from(uniqueRegions).sort());
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...locations];

    if (searchTerm) {
      filtered = filtered.filter((location) => location.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (selectedParty) {
      filtered = filtered.filter((location) => location.about && location.about.includes(selectedParty));
    }

    if (selectedRegion) {
      filtered = filtered.filter((location) => location.about && location.about.includes(selectedRegion));
    }

    setFilteredLocations(filtered);
  }, [searchTerm, selectedParty, selectedRegion, locations]);

  // This function is no longer needed as we're using MUI's color system directly in the component

  const handleMemberClick = (member) => {
    setSelectedMember(member);
  };

  const closeModal = () => {
    setSelectedMember(null);
  };

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Cámara de Representantes de Colombia
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            placeholder="Buscar representante..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            variant="outlined"
            size="small"
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel id="party-select-label">Partido político</InputLabel>
                <Select
                  labelId="party-select-label"
                  id="party-select"
                  value={selectedParty}
                  label="Partido político"
                  onChange={(e) => setSelectedParty(e.target.value)}
                >
                  <MenuItem value="">Todos los partidos</MenuItem>
                  {parties.map((party) => (
                    <MenuItem key={party} value={party}>
                      {party}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel id="region-select-label">Circunscripción</InputLabel>
                <Select
                  labelId="region-select-label"
                  id="region-select"
                  value={selectedRegion}
                  label="Circunscripción"
                  onChange={(e) => setSelectedRegion(e.target.value)}
                >
                  <MenuItem value="">Todas las circunscripciones</MenuItem>
                  {regions.map((region) => (
                    <MenuItem key={region} value={region}>
                      {region}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'primary.main', mr: 1 }}></Box>
            <Typography variant="body2">Mesa Directiva</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'success.main', mr: 1 }}></Box>
            <Typography variant="body2">Secretaría</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'grey.400', mr: 1 }}></Box>
            <Typography variant="body2">Integrantes</Typography>
          </Box>
        </Box>
      </Box>

      <Paper
        elevation={2}
        sx={{
          position: 'relative',
          width: '100%',
          height: 600,
          borderRadius: 2,
          bgcolor: 'grey.50',
          overflow: 'hidden',
        }}
      >
        {filteredLocations.map((location) => {
          // Only render locations with valid x and y coordinates
          if (location.x === '0' && location.y === '0') return null;

          const x = parseFloat(location.x) * 100;
          const y = parseFloat(location.y) * 100;

          let bgColor;
          switch (location.category) {
            case 'mesa':
              bgColor = 'primary.main';
              break;
            case 'secretaria':
              bgColor = 'success.main';
              break;
            default:
              bgColor = 'grey.400';
          }

          return (
            <Box
              key={location.id}
              sx={{
                position: 'absolute',
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translate(-50%, -50%) scale(1.1)',
                },
                zIndex: location.category === 'mesa' ? 20 : location.category === 'secretaria' ? 15 : 10,
              }}
              onClick={() => handleMemberClick(location)}
              title={location.title}
            >
              <Box sx={{ position: 'relative' }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    border: '2px solid white',
                    boxShadow: 2,
                    overflow: 'hidden',
                    bgcolor: bgColor,
                  }}
                >
                  {location.thumbnail && (
                    <Box
                      component="img"
                      src={location.thumbnail}
                      alt={location.title}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                      onError={(e) => {
                        e.target.src = '/api/placeholder/40/40';
                      }}
                    />
                  )}
                </Box>
              </Box>
            </Box>
          );
        })}
      </Paper>

      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Total representantes mostrados: {filteredLocations.filter((l) => l.x !== '0' || l.y !== '0').length}
        </Typography>
      </Box>

      {/* Modal for member details */}
      <Modal
        open={selectedMember !== null}
        onClose={closeModal}
        aria-labelledby="member-details-modal"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Paper
          sx={{
            maxWidth: 500,
            width: '100%',
            p: 3,
            outline: 'none',
            borderRadius: 2,
            position: 'relative',
            maxHeight: '90vh',
            overflow: 'auto',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {selectedMember && (
            <>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      overflow: 'hidden',
                      mr: 2,
                      border: '1px solid',
                      borderColor: 'grey.300',
                    }}
                  >
                    <Box
                      component="img"
                      src={selectedMember.thumbnail || '/api/placeholder/64/64'}
                      alt={selectedMember.title}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                      onError={(e) => {
                        e.target.src = '/api/placeholder/64/64';
                      }}
                    />
                  </Box>
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                    {selectedMember.title}
                  </Typography>
                </Box>
                <IconButton size="small" onClick={closeModal} aria-label="cerrar">
                  <CloseIcon />
                </IconButton>
              </Box>

              <Divider sx={{ mb: 2 }} />

              {selectedMember.about && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'medium', color: 'text.secondary', mb: 0.5 }}>
                    Información:
                  </Typography>
                  <Typography variant="body2" color="text.primary">
                    {selectedMember.about.replace('|', ' - ')}
                  </Typography>
                </Box>
              )}

              {selectedMember.category && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'medium', color: 'text.secondary', mb: 0.5 }}>
                    Categoría:
                  </Typography>
                  <Chip
                    label={selectedMember.category.charAt(0).toUpperCase() + selectedMember.category.slice(1)}
                    color={
                      selectedMember.category === 'mesa' ? 'primary' : selectedMember.category === 'secretaria' ? 'success' : 'default'
                    }
                    size="small"
                  />
                </Box>
              )}

              {selectedMember.link && (
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    component="a"
                    href={selectedMember.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver perfil completo
                  </Button>
                </Box>
              )}
            </>
          )}
        </Paper>
      </Modal>
    </Box>
  );
};

export default ChamberMap;
