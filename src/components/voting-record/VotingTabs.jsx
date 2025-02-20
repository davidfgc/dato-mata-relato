import { Box, Checkbox, FormControlLabel, FormGroup, Switch, Tab, Tabs } from '@mui/material';
import PropTypes from 'prop-types';

import { useState } from 'react';
import WarningAlert from '../common/WarningAlert';
import PartyWeightChart from '../graphs/PartyWeightChart';
import PartyVotingList from './PartyVotingList';
import TabLabel from './TabLabel';

const VotingTabs = ({ votingStages, sessions, graphData, selectedTab, onTabChange }) => {
  const session = sessions[selectedTab];
  const invertColors = session.motion === 'archive';
  const [switchLabel, setSwitchLabel] = useState('Peso de partidos en la decisión');
  const [showChart, setShowChart] = useState(true);

  const handleShowChartChange = (event) => {
    setShowChart(event.target.checked);
    const label = event.target.checked ? 'Peso de partidos en la decisión' : 'Votos';
    setSwitchLabel(label);
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
      <Tabs value={selectedTab} onChange={onTabChange} aria-label="voting sessions">
        {votingStages.map((step) => {
          const session = sessions.find((s) => s.stepId === step.id);
          return session && <Tab key={step.id} label={<TabLabel step={step} session={session} />} />;
        })}
      </Tabs>

      {session.warning && session.warning.length > 0 && <WarningAlert message={session.warning} mb={0} />}

      <FormGroup sx={{ marginTop: 2, marginBottom: 1 }}>
        <FormControlLabel control={<Switch checked={showChart} onChange={handleShowChartChange} />} label={switchLabel} />
        {showChart && <FormControlLabel control={<Checkbox checked={true} disabled />} label="Sumar ausencias al ganador" />}
      </FormGroup>

      {showChart ? <PartyWeightChart data={graphData[selectedTab]} invertColors={invertColors} /> : <PartyVotingList session={session} />}
    </Box>
  );
};

VotingTabs.propTypes = {
  votingStages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
    })
  ).isRequired,
  sessions: PropTypes.arrayOf(
    PropTypes.shape({
      stepId: PropTypes.number.isRequired,
      warning: PropTypes.string,
    })
  ).isRequired,
  selectedTab: PropTypes.number.isRequired,
  onTabChange: PropTypes.func.isRequired,
};

export default VotingTabs;
