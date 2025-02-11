import { DoNotDisturbOnRounded as AbsentIcon, ExpandLess as ExpandLessIcon, ExpandMore as ExpandMoreIcon, Cancel as NoIcon, CheckCircle as YesIcon } from '@mui/icons-material';
import { Box, Chip, Collapse, IconButton, Paper, Stack, Tooltip, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { get } from 'lodash';
import PropTypes from 'prop-types';



import { useState } from 'react';



import VotingDecisionChip from '../common/VotingDecisionChip';
import PartyVoteBar from '../graphs/PartyVoteBar';





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

VoteChip.propTypes = {
  vote: PropTypes.oneOf(['yes', 'no', 'absent']).isRequired,
};

const PartyVotingPanel = ({ party, partyInfo, votes, yes, no, absent, maxTotal, invertColors }) => {
  const [expanded, setExpanded] = useState(false);
  const getColor = () => {
    if (yes > no) return invertColors ? 'error' : 'success';
    if (no > yes) return invertColors ? 'success' : 'error';
    return 'default';
  };
  const voteDiff = yes - no;

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
      <Box sx={{ p: 1 }}>
        <Grid container justifyContent="space-between">
          <Stack sx={{ flex: 1 }}>
            <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
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
              <Stack direction="row" spacing={1} alignItems="center">
                <VotingDecisionChip yes={yes} no={no} invertColors={invertColors} />
                <Typography
                  variant="caption"
                  color={getColor()}
                  sx={{
                    fontWeight: 'medium',
                  }}
                >
                  {voteDiff > 0 ? `+${voteDiff}` : voteDiff}
                </Typography>
              </Stack>
            </Stack>
            <PartyVoteBar
              partyStats={{ party, yes, no, absent, total: yes + no + absent }}
              maxTotal={maxTotal}
              invertColors={invertColors}
            />
          </Stack>

          {/* <Stack direction="row" xs="auto" spacing={1} alignItems="center">
            <VotingTotals yes={yes} no={no} absent={absent} invertColors={invertColors} />
            <IconButton size="small">{expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>
          </Stack> */}
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

PartyVotingPanel.propTypes = {
  party: PropTypes.string.isRequired,
  partyInfo: PropTypes.shape({
    founding_year: PropTypes.number,
    position: PropTypes.string,
    ideology: PropTypes.arrayOf(PropTypes.string),
  }),
  votes: PropTypes.arrayOf(
    PropTypes.shape({
      vote: PropTypes.oneOf(['yes', 'no', 'absent']).isRequired,
      representative: PropTypes.string.isRequired,
    })
  ).isRequired,
  yes: PropTypes.number.isRequired,
  no: PropTypes.number.isRequired,
  absent: PropTypes.number.isRequired,
  maxTotal: PropTypes.number.isRequired,
  invertColors: PropTypes.bool,
};

export default PartyVotingPanel;