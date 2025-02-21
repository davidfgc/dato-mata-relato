import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const Chart = ({ data }) => {
  const height = (data.length + 1) * 40;
  const processedData = useMemo(() => {
    let cumulative = 0;
    let thresholdIndex = -1;

    return data.map((item, index) => {
      cumulative += item.weight;

      if (cumulative >= 50 && thresholdIndex === -1) {
        thresholdIndex = index;
      }

      return {
        ...item,
        cumulative,
        isThreshold: thresholdIndex === index,
      };
    });
  }, [data]);

  const thresholdPosition = useMemo(() => {
    const threshold = processedData.find((item) => item.isThreshold);

    return threshold ? threshold.name : null;
  }, [processedData]);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 15 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" label={{ value: 'Peso en el resultado (%)', position: 'insideBottom', offset: -5 }} />
        <YAxis dataKey="name" type="category" width={200} />
        {thresholdPosition && (
          <ReferenceLine
            y={thresholdPosition}
            stroke="#ff0000"
            strokeWidth={2}
            strokeDasharray="3 3"
            label={{
              value: '50% necesario',
              fill: '#ff0000',
              position: 'insideTopRight',
              fontSize: 12,
            }}
          />
        )}
        <Tooltip formatter={(value) => [`${value.toFixed(2)}%`, `Peso en resultado`]} labelFormatter={(value) => value} />
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
