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
            <Route path="/" element={<VotingRecord />} />
            <Route path="/voting-record" element={<VotingRecord />} />
            <Route path="/filtros" element={<VotingFilters />} />
            <Route path="/congresistas" element={<CongressList />} />
            <Route path="/despilfarro" element={<FiscalInefficiency />} />
          </Routes>
        </HashRouter>
      </Box>
    </ThemeProvider>
    // <>
    //   <div>
    //     <a href="https://vite.dev" target="_blank">
    //       <img src={viteLogo} className="logo" alt="Vite logo" />
    //     </a>
    //     <a href="https://react.dev" target="_blank">
    //       <img src={reactLogo} className="logo react" alt="React logo" />
    //     </a>
    //   </div>
    //   <h1>Vite + React</h1>
    //   <div className="card">
    //     <button onClick={() => setCount((count) => count + 1)}>
    //       count is {count}
    //     </button>
    //     <p>
    //       Edit <code>src/App.jsx</code> and save to test HMR
    //     </p>
    //   </div>
    //   <p className="read-the-docs">
    //     Click on the Vite and React logos to learn more
    //   </p>
    // </>
  );
}

export default App;
