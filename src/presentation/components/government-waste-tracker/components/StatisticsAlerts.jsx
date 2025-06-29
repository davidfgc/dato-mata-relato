import { Error as ErrorIcon, Info as InfoIcon, Warning as WarningIcon } from '@mui/icons-material';
import { Alert, AlertTitle, Box, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { calculateDaysSince, formatCurrency, getAmountDescription } from './utils';

const StatAlert = ({ icon, severity, label, value }) => (
  <Alert icon={icon} severity={severity} sx={{ display: 'flex', flexGrow: 1 }}>
    <AlertTitle sx={{ display: 'flex', flexGrow: 1 }}>{label}</AlertTitle>
    <Box
      sx={{
        display: 'flex',
        flexGrow: 1,
        flexDirection: { xs: 'column' },
        alignItems: 'flex-start',
      }}
    >
      <Typography fontWeight="medium">{value}</Typography>
      <Typography fontSize={'12px'} color={'text.secondary'}>
        {getAmountDescription(parseFloat(value.replace(/[^\d]/g, '')))}
      </Typography>
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
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
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
