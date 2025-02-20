import { Box, Typography } from '@mui/material';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import PropTypes from 'prop-types';

const Chart = ({ data }) => {
  const height = data.length * 40;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" label={{ value: 'Peso en el resultado (%)', position: 'insideBottom', offset: -5 }} />
        <YAxis dataKey="name" type="category" width={200} />
        <Tooltip formatter={(value, name) => [`${value.toFixed(2)}%`, `${name}`]} labelFormatter={(value) => `${value}`} />
        <Bar dataKey="weight" name="Peso en resultado (%)">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

Chart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      weight: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired,
    })
  ).isRequired,
};

const PartyWeightChart = ({ data }) => (
  <Box>
    <Chart data={data} />
    {/* <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ width: 16, height: 16, bgcolor: '#4caf50', borderRadius: '50%' }} />
        <Typography variant="body2">A favor</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ width: 16, height: 16, bgcolor: '#ff9800', borderRadius: '50%' }} />
        <Typography variant="body2">Neutral</Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ width: 16, height: 16, bgcolor: '#f44336', borderRadius: '50%' }} />
        <Typography variant="body2">En contra</Typography>
      </Box>
    </Box> */}
  </Box>
);

PartyWeightChart.propTypes = Chart.propTypes;

export default PartyWeightChart;
