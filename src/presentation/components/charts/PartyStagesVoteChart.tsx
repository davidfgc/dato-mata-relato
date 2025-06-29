import { Box, Typography } from '@mui/material';
import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, XAxis, YAxis } from 'recharts';

// Types for the component
interface PartyResult {
  yes: number;
  no: number;
  weight: number;
}

interface PartyStat {
  party: string;
  result: PartyResult;
}

interface Stage {
  id: number;
  motion: string;
  partyStats: PartyStat[];
}

interface RawData {
  stages: Stage[];
}

interface StageResult {
  support: 'support' | 'oppose' | 'neutral' | 'unknown';
  stageId: number;
  weight?: number;
}

interface PartyData {
  party: string;
  supportWeight: number;
  opposeWeight: number;
  supportCount: number;
  opposeCount: number;
  stageResults: StageResult[];
}

interface StackedData {
  party: string;
  supportWeight: number;
  opposeWeight: number;
  support: number;
  oppose: number;
  stageResults: StageResult[];
}

interface PartyStagesVoteChartProps {
  rawData: RawData;
}

// Props for Recharts components
interface LabelProps {
  x?: string | number;
  y?: string | number;
  width?: string | number;
  height?: string | number;
  value?: string | number;
}

interface TooltipPayload {
  payload: StackedData;
}

interface TooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

const PartyStagesVoteChart = ({ rawData }: PartyStagesVoteChartProps) => {
  const chartData = useMemo(() => {
    // Get unique parties across all stages
    const allParties = new Set<string>();
    rawData.stages.forEach((stage) => {
      stage.partyStats.forEach((partyStat) => {
        allParties.add(partyStat.party);
      });
    });

    // For each party, calculate support across stages
    return Array.from(allParties)
      .map((partyName): PartyData => {
        // Track stages and results for this party
        const partyData = { party: partyName, stageResults: [] as StageResult[] };

        // For each stage, determine if the party supported the bill
        rawData.stages.forEach((stage) => {
          const partyStats = stage.partyStats.find((p) => p.party === partyName);

          if (!partyStats) {
            // Party wasn't present in this stage
            partyData.stageResults.push({ support: 'unknown', stageId: stage.id });
            return;
          }

          // Determine if the party supported the bill in this stage
          let support: StageResult['support'] = 'unknown';

          // If yes votes are more than no votes, the party supported the bill
          if (partyStats.result.yes > partyStats.result.no) {
            support = 'support';
          } else if (partyStats.result.no > partyStats.result.yes) {
            support = 'oppose';
          } else if (partyStats.result.yes === 0 && partyStats.result.no === 0) {
            // All were absent
            support = 'unknown';
          } else {
            // Equal votes
            support = 'neutral';
          }

          // Special case for archive motion (stage 3)
          // For "archive" motion, a "yes" vote is against the bill, so we invert the support
          if (stage.motion === 'archive') {
            if (support === 'support') support = 'oppose';
            else if (support === 'oppose') support = 'support';
          }

          partyData.stageResults.push({ 
            support, 
            stageId: stage.id, 
            weight: partyStats.result.weight 
          });
        });

        const support = partyData.stageResults.filter((r) => r.support === 'support');
        const supportCount = support.length;
        const oppose = partyData.stageResults.filter((r) => r.support === 'oppose');
        const opposeCount = oppose.length;
        const supportWeight = supportCount > 0 
          ? support.reduce((sum, result) => sum + (result.weight || 0), 0) / supportCount 
          : 0;
        const opposeWeight = opposeCount > 0 
          ? oppose.reduce((sum, result) => sum + (result.weight || 0), 0) / opposeCount 
          : 0;

        return {
          party: partyName,
          supportWeight,
          opposeWeight,
          supportCount,
          opposeCount,
          stageResults: partyData.stageResults,
        };
      })
      .filter((a) => a.supportCount > 1 || a.opposeCount > 1)
      .sort((a, b) => {
        if (a.supportCount > b.supportCount) return -1;
        if (a.supportWeight && b.supportWeight) return b.supportWeight - a.supportWeight;
        else if (a.supportWeight && !b.supportWeight) return -1;
        else if (!a.supportWeight && b.supportWeight) return 1;
        else if (a.opposeWeight && b.opposeWeight) return a.opposeWeight - b.opposeWeight;
        else return 0;
      });
  }, [rawData]);

  const stackedData = useMemo((): StackedData[] => {
    return chartData.map((party) => {
      return {
        party: party.party,
        supportWeight: party.supportWeight,
        opposeWeight: party.opposeWeight,
        support: party.supportCount,
        oppose: party.opposeCount,
        stageResults: party.stageResults,
      };
    });
  }, [chartData]);

  const height = (stackedData.length + 1) * 40;

  const renderCustomizedLabel = (props: LabelProps) => {
    // eslint-disable-next-line react/prop-types
    const { x, y, width, value } = props;

    // Convert to numbers and validate
    const numValue = typeof value === 'number' ? value : parseFloat(value?.toString() || '0');
    const numX = typeof x === 'number' ? x : parseFloat(x?.toString() || '0');
    const numY = typeof y === 'number' ? y : parseFloat(y?.toString() || '0');
    const numWidth = typeof width === 'number' ? width : parseFloat(width?.toString() || '0');

    if (isNaN(numValue) || numValue === 0) {
      return null;
    }
    return (
      <g>
        <text x={numX + numWidth - 33} y={numY + 14} fill="#fff" textAnchor="middle" dominantBaseline="middle">
          {`${numValue.toFixed(2)} %`}
        </text>
      </g>
    );
  };

  // Note: CustomTooltip is currently unused but kept for potential future use
  const CustomTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      const party = payload[0].payload;
      return (
        <div className="custom-tooltip bg-white p-4 shadow-md rounded-md border">
          <p className="font-semibold">{party.party}</p>
          <div className="mt-2">
            {party.stageResults.map((result, index) => (
              <div key={index} className="flex items-center gap-2">
                <span>Etapa {result.stageId}:</span>
                <span
                  className={`font-medium ${
                    result.support === 'support' ? 'text-green-600' : result.support === 'oppose' ? 'text-red-600' : 'text-gray-500'
                  }`}
                >
                  {result.support === 'support' ? 'A favor' : result.support === 'oppose' ? 'En contra' : 'Neutral/Ausente'}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  // Silence the unused variable warning
  void CustomTooltip;

  return (
    <Box>
      <Typography variant="h6">Cantidad debates a favor por partido</Typography>
      <Typography variant="h6" component="p" sx={{ fontSize: '0.875rem' }}>
        y peso promedio sobre el resultado final
      </Typography>
      <ResponsiveContainer width={'100%'} height={height}>
        <BarChart layout="vertical" data={stackedData} margin={{ top: 20, right: 30, left: 20, bottom: 15 }}>
          <CartesianGrid strokeDasharray="1 1" />
          <XAxis
            type="number"
            domain={[0, rawData.stages.length]}
            allowDataOverflow
            allowDecimals={false}
            tickFormatter={(value) => {
              if (value === 0) return '';
              else return value.toString();
            }}
          />
          <YAxis dataKey="party" type="category" width={200} tick={{ fontSize: 14 }} />
          {/* <Tooltip content={<CustomTooltip />} /> */}
          {/* <Tooltip formatter={(value) => [`${value.toFixed(2)}%`, `Peso en resultado`]} labelFormatter={(value) => value} /> */}
          {/* <Legend /> */}
          <Bar dataKey="support" stackId="a" name="A favor" fill="#4CAF50">
            <LabelList dataKey="supportWeight" content={renderCustomizedLabel} />
          </Bar>
          <Bar dataKey="oppose" stackId="a" name="En contra" fill="#F44336">
            <LabelList dataKey="opposeWeight" content={renderCustomizedLabel} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default PartyStagesVoteChart;
