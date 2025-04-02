import { Box, Grid, Typography } from '@mui/material';
import RepresentativeCard from '../common/RepresentativeCard';

const RepresentativesList = ({
  representatives = [],
  getVoteStatus = () => null,
  showParty = false,
  getPartyName = () => '',
  emptyMessage = 'No se encontraron representantes con los filtros seleccionados',
}) => {
  return (
    <Grid container spacing={2}>
      {representatives.length > 0 ? (
        representatives.map((rep) => {
          const vote = getVoteStatus(rep.id);
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={rep.id}>
              <RepresentativeCard
                representative={rep}
                vote={vote}
                showParty={showParty}
                partyName={showParty ? getPartyName(rep.party_id) : ''}
              />
            </Grid>
          );
        })
      ) : (
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Typography variant="body1" color="text.secondary">
              {emptyMessage}
            </Typography>
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

export default RepresentativesList;
