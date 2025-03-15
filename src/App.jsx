import { Box, ThemeProvider, createTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

import { useMemo } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';

import './App.css';
import Header from './components/common/Header';
import FiscalInefficiency from './components/government-waste-tracker/FiscalInefficiency';
import VotingRecord from './components/voting-record/VotingRecord';
import VotingFilters from './components/voting-view/VotingFilters';
import CongressList from './components/congress/CongressList';
import BillsList from './components/bills/BillsList';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <Box>
        <Header />
        <HashRouter>
          <Routes>
            <Route path="/" element={<BillsList />} />
            <Route path="/reformas" element={<BillsList />} />
            <Route path="/reformas/:year/:id/votacion" element={<VotingRecord />} />
            <Route path="/voting-record" element={<VotingRecord />} />
            <Route path="/filtros" element={<VotingFilters />} />
            <Route path="/congresistas" element={<CongressList />} />
            <Route path="/despilfarro" element={<FiscalInefficiency />} />
          </Routes>
        </HashRouter>
      </Box>
    </ThemeProvider>
  );
}

export default App;
