import { Box, Container, ThemeProvider, createTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

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
          }}
        >
          {/* Header fixed at the top */}
          <Box
            component="header"
            sx={{
              width: '100%',
              position: 'sticky',
              top: 0,
              zIndex: 1100,
            }}
          >
            <Header />
          </Box>

          {/* Main content area */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              py: { xs: 2, sm: 3 },
              px: { xs: 1, sm: 2, md: 3 },
            }}
          >
            <Container maxWidth="lg" disableGutters sx={{ height: '100%' }}>
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
        </Box>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
