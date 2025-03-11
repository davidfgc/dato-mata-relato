import { Error as ErrorIcon, Info as InfoIcon, Warning as WarningIcon } from '@mui/icons-material';
import { Alert, Box, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { calculateDaysSince, formatCurrency } from './utils';

const StatAlert = ({ icon, severity, label, value }) => (
  <Alert
    icon={icon}
    severity={severity}
    sx={{
      width: '100%',
      '& .MuiAlert-message': {
        width: '100%',
      },
    }}
  >
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        width: '100%',
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: { xs: 0.5, sm: 1 },
      }}
    >
      <Typography>{label}</Typography>
      <Typography fontWeight="medium">{value}</Typography>
    </Box>
  </Alert>
);

StatAlert.propTypes = {
  icon: PropTypes.node.isRequired,
  severity: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.node.isRequired,
};

const StatisticsAlerts = ({ totalWaste }) => {
  const daysSince = calculateDaysSince();

  return (
    <>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
        <StatAlert icon={<ErrorIcon />} severity="error" label="Total Dinero Desperdiciado:" value={formatCurrency(totalWaste)} />

        <StatAlert icon={<WarningIcon />} severity="warning" label="Promedio diario:" value={formatCurrency(totalWaste / daysSince)} />
      </Stack>

      <StatAlert icon={<InfoIcon />} severity="info" label="Días desde inicio de gobierno:" value={`${daysSince} días`} />
    </>
  );
};

StatisticsAlerts.propTypes = {
  totalWaste: PropTypes.number.isRequired,
};

export default StatisticsAlerts;
