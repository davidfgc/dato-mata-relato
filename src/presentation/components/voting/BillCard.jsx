import { Card, CardContent, Link, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import PropTypes from 'prop-types';
import StatusChip from '../../../shared/components/ui/StatusChip';

const BillCard = ({ bill }) => {

  // Find specs source
  const specsSource = bill.sources?.find((source) => source.type === 'specs');

  return (
    <Card elevation={2} sx={{ mb: 3 }}>
      <CardContent>
        <Grid container justifyContent={'space-between'}>
          <Grid justifyItems={'flex-start'}>
            <Typography variant="h5" component="h1" gutterBottom>
              {bill.shortTitle}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {bill.type} • {bill.legislature}
            </Typography>
            <Typography variant="body2">{bill.author}</Typography>
            <Typography variant="body2" color="text.secondary">
              {bill.authorRole}
            </Typography>
          </Grid>
          <Grid>
            <Stack spacing={1} alignItems="flex-end">
              <StatusChip status={bill.status} />
              <Typography variant="body2" color="text.secondary">
                {bill.date}
              </Typography>
              <Link href={`/#/reformas/${bill.id}/autores`} underline="hover" variant="body2">
                Ver autores
              </Link>
              {specsSource && (
                <Link href={specsSource.url} underline="hover" variant="body2" target="_blank" rel="noopener noreferrer">
                  {specsSource.title}
                </Link>
              )}
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

BillCard.propTypes = {
  bill: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    shortTitle: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    legislature: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    authorRole: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string),
    committee: PropTypes.string,
    origin: PropTypes.string,
    sources: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        type: PropTypes.string,
        url: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
};

export default BillCard;
