import { Box, Grid, Typography } from '@mui/material';
// @ts-expect-error - RepresentativeCard will be migrated to TypeScript later
import RepresentativeCard from '../../../shared/components/ui/RepresentativeCard';
import type Representative from '../../../domain/representative';

// Types for this component
type VoteStatus = 'yes' | 'no' | 'absent' | null;

interface RepresentativesListProps {
  representatives?: Representative[];
  getVoteStatus?: (representativeId: number) => VoteStatus;
  showParty?: boolean;
  getPartyName?: (partyId: string) => string;
  emptyMessage?: string;
}

const RepresentativesList = ({
  representatives = [],
  getVoteStatus = () => null,
  showParty = false,
  getPartyName = () => '',
  emptyMessage = 'No se encontraron representantes con los filtros seleccionados',
}: RepresentativesListProps) => {
  return (
    <Grid container spacing={2} alignItems="stretch">
      {representatives.length > 0 ? (
        representatives.map((rep) => {
          const vote = getVoteStatus(rep.id);
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={rep.id} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
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
