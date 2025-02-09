import { Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';

const BillCard = ({ bill }) => {
  return (
    <Card elevation={2} sx={{ mb: 3 }}>
      <CardContent>
        <Grid container justifyContent={'space-between'}>
          <Grid xs justifyItems={'flex-start'}>
            <Typography variant="h5" component="h1" gutterBottom>
              {bill.title}
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
              <Chip label={bill.status} size="small" color="error" variant="outlined" />
              <Typography variant="body2" color="text.secondary">
                {bill.date}
              </Typography>
            </Stack>
          </Grid>
        </Grid>

        <Typography variant="body1" sx={{ my: 2 }} textAlign={'justify'}>
          {bill.description}
        </Typography>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {bill.tags?.map((tag) => (
            <Chip key={tag} label={tag} size="small" sx={{ mb: 1 }} />
          ))}
          {bill.committee && <Chip label={bill.committee} size="small" color="primary" variant="outlined" sx={{ mb: 1 }} />}
          {bill.origin && <Chip label={bill.origin} size="small" color="secondary" variant="outlined" sx={{ mb: 1 }} />}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default BillCard;
