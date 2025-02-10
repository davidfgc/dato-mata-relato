import {
  DoNotDisturbOnRounded as AbsentIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Cancel as NoIcon,
  CheckCircle as YesIcon,
} from '@mui/icons-material';
import { Box, Chip, Collapse, IconButton, Paper, Stack, Tooltip, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';

import { useState } from 'react';

import VotingDecisionChip from '../common/VotingDecisionChip';
import VotingTotals from './VotingTotals';

const VoteChip = ({ vote }) => {
  switch (vote) {
    case 'yes':
      return <YesIcon />;
    case 'no':
      return <NoIcon />;
    case 'absent':
    default:
      return <AbsentIcon />;
  }
};

const PartyVotingPanel = ({ party, partyInfo, votes, yes, no, absent, invertColors }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Paper
      elevation={1}
      sx={{
        '&:hover': {
          boxShadow: 2,
          cursor: 'pointer',
        },
      }}
      onClick={() => setExpanded(!expanded)}
    >
      <Box sx={{ p: 2 }}>
        <Grid container justifyContent="space-between">
          <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip
              title={
                partyInfo
                  ? `Fundado en ${partyInfo.founding_year}
                  Posición: ${partyInfo.position}
                  Ideología: ${partyInfo.ideology.join(', ')}`
                  : ''
              }
            >
              <Typography variant="subtitle1" sx={{ cursor: 'help' }}>
                {party}
              </Typography>
            </Tooltip>
            <VotingDecisionChip yes={yes} no={no} invertColors={invertColors} />
          </Stack>

          <Stack direction="row" xs="auto" spacing={1} alignItems="center">
            <VotingTotals yes={yes} no={no} absent={absent} invertColors={invertColors} />
            <IconButton size="small">{expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>
          </Stack>
        </Grid>

        <Collapse in={expanded}>
          <Box sx={{ mt: 2, ml: 2 }}>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              {votes.map((vote, index) => (
                <Chip
                  key={index}
                  icon={<VoteChip vote={vote.vote} />}
                  label={vote.representative}
                  color={vote.vote === 'yes' ? 'success' : vote.vote === 'no' ? 'error' : 'default'}
                  variant="outlined"
                  size="medium"
                />
              ))}
            </Stack>
          </Box>
        </Collapse>
      </Box>
    </Paper>
  );
};

export default PartyVotingPanel;
