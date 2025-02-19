import { Warning as WarningIcon } from '@mui/icons-material';
import { Alert, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const WarningAlert = ({ message, mb = 2 }) => (
  <Alert
    icon={<WarningIcon />}
    severity="warning"
    sx={{
      mb: mb,
      mt: 2,
      '& .MuiAlert-message': {
        width: '100%',
      },
    }}
  >
    <Stack
      sx={{
        display: 'flex',
        width: '100%',
        alignItems: 'flex-start',
      }}
    >
      <Typography>{message}</Typography>
    </Stack>
  </Alert>
);
WarningAlert.propTypes = {
  message: PropTypes.string.isRequired,
  mb: PropTypes.number,
};

export default WarningAlert;