import { Stack } from '@mui/material';
import PropTypes from 'prop-types';

import PartyVotingPanel from './PartyVotingPanel';

const PartyVotingList = ({ session }) => {
  const invertColors = session?.motion === 'archive';

  return (
    <Stack spacing={2}>
      {session.partyStats.map(({ party, partyInfo, votes, yes, no, absent }) => (
        <PartyVotingPanel
          key={party}
          party={party}
          partyInfo={partyInfo}
          votes={votes}
          yes={yes}
          no={no}
          absent={absent}
          invertColors={invertColors}
        />
      ))}
    </Stack>
  );
};

PartyVotingList.propTypes = {
  session: PropTypes.shape({
    motion: PropTypes.string,
    partyStats: PropTypes.arrayOf(
      PropTypes.shape({
        party: PropTypes.string.isRequired,
        partyInfo: PropTypes.object.isRequired,
        votes: PropTypes.number.isRequired,
        yes: PropTypes.number.isRequired,
        no: PropTypes.number.isRequired,
        absent: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default PartyVotingList;