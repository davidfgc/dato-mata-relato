import { Box, Container, createTheme, ThemeProvider, useMediaQuery } from '@mui/material';
import { useMemo } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';

import './App.css';
import BillsList from './components/bills/BillsList';
import Header from './components/common/Header';
import CongressList from './components/congress/CongressList';
import GeneratorApp from './components/generator/GeneratorApp';
import FiscalInefficiency from './components/government-waste-tracker/FiscalInefficiency';
import VotingRecord from './components/voting-record/VotingRecord';
import VotingFilters from './components/voting-view/VotingFilters';

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
              <Route path="/reformas/:year/:id/votacion" element={<VotingRecord />} />
              <Route path="/voting-record" element={<VotingRecord />} />
              <Route path="/filtros" element={<VotingFilters />} />
              <Route path="/congresistas" element={<CongressList />} />
              <Route path="/despilfarro" element={<FiscalInefficiency />} />
              <Route path="/generator" element={<GeneratorApp />} />
            </Routes>
          </Container>
        </Box>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
