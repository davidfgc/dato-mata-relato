import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HelpIcon from '@mui/icons-material/Help';
import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material';

const RepresentativeCard = ({
  representative,
  vote, // 'yes', 'no', 'absent', or null
  showParty = false,
  partyName,
}) => {
  // Get color based on vote status
  const getVoteColor = (status) => {
    switch (status) {
      case 'yes':
        return 'success.main';
      case 'no':
        return 'error.main';
      case 'absent':
        return 'text.disabled';
      default:
        return 'text.secondary';
    }
  };

  // Get icon based on vote status
  const getVoteIcon = (status) => {
    switch (status) {
      case 'yes':
        return <CheckCircleIcon color="success" />;
      case 'no':
        return <CancelIcon color="error" />;
      case 'absent':
        return <HelpIcon color="disabled" />;
      default:
        return null;
    }
  };

  // Get vote text based on status
  const getVoteText = (status) => {
    switch (status) {
      case 'yes':
        return 'A favor';
      case 'no':
        return 'En contra';
      case 'absent':
        return 'Ausente';
      default:
        return '';
    }
  };

  return (
    <Card
      sx={{
        display: 'flex',
        height: '100%',
        border: 1,
        borderColor: getVoteColor(vote),
      }}
    >
      <CardMedia
        component="img"
        sx={{ width: 80, height: 80, objectFit: 'cover' }}
        image={representative.thumbnail || 'https://via.placeholder.com/80'}
        alt={representative.name}
      />
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography variant="body2" gutterBottom>
          {representative.name}
        </Typography>
        {showParty && (
          <Typography variant="caption" color="text.secondary" display="block">
            {partyName}
          </Typography>
        )}
        {vote && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            {getVoteIcon(vote)}
            <Typography variant="caption" sx={{ ml: 1 }}>
              {getVoteText(vote)}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default RepresentativeCard;
