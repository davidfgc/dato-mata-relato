import { Box, Container, createTheme, ThemeProvider, useMediaQuery } from '@mui/material';
import { useMemo } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';

import './App.css';
import BillsList from './presentation/components/bills/BillsList';
import BillDetail from './presentation/components/bills/BillDetail';
import BillAuthors from './presentation/components/bills/BillAuthors';
import Header from './shared/components/ui/Header';
import CongressList from './presentation/components/representatives/CongressList';
import GeneratorApp from './presentation/components/generator/GeneratorApp';
import FiscalInefficiency from './presentation/components/government-waste-tracker/FiscalInefficiency';
import VotingRecord from './presentation/components/voting/VotingRecord';
import VotingFilters from './presentation/components/filters/VotingFilters';
import ChamberMap from './presentation/components/map/ChamberMap';
import { GuerrillaEvolutionChart } from './presentation/components/guerrilla-evolution';
import { EmploymentData } from './presentation/components/employment-data';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
        // Adding responsive breakpoints for mobile-first approach
        breakpoints: {
          values: {
            xs: 0,
            sm: 600,
            md: 960,
            lg: 1280,
            xl: 1920,
          },
        },
      }),
    [prefersDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <HashRouter>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            overflow: 'hidden', // Prevent any potential overflow
            alignItems: 'stretch', // Ensure children stretch to full width
          }}
        >
          <Header />
          <Container
            maxWidth="lg"
            sx={{
              mt: 4,
              px: 2,
            }}
            disableGutters
          >
            <Routes>
              <Route path="/" element={<BillsList />} />
              <Route path="/reformas" element={<BillsList />} />
              <Route path="/reformas/:id/:year" element={<BillDetail />} />
              <Route path="/reformas/:id/:year/autores" element={<BillAuthors />} />
              <Route path="/reformas/:id/:year/votacion" element={<VotingRecord />} />
              <Route path="/voting-record" element={<VotingRecord />} />
              <Route path="/filtros" element={<VotingFilters />} />
              <Route path="/congresistas" element={<CongressList />} />
              <Route path="/despilfarro" element={<FiscalInefficiency />} />
              <Route path="/guerrilla" element={<GuerrillaEvolutionChart />} />
              <Route path="/generator" element={<GeneratorApp />} />
              <Route path="/map" element={<ChamberMap />} />
              <Route path="/grupos-armados" element={<GuerrillaEvolutionChart />} />
              <Route path="/datos-empleo" element={<EmploymentData />} />
            </Routes>
          </Container>
        </Box>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
