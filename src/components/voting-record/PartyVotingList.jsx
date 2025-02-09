import { Stack } from '@mui/material';

import PartyVotingPanel from './PartyVotingPanel';

const PartyVotingList = ({ partyStats }) => (
  <Stack spacing={2}>
    {partyStats.map(({ party, partyInfo, votes, yes, no, absent }) => (
      <PartyVotingPanel key={party} party={party} partyInfo={partyInfo} votes={votes} yes={yes} no={no} absent={absent} />
    ))}
  </Stack>
);

export default PartyVotingList;
