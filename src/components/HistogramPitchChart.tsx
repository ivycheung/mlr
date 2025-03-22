import React from 'react';
import { BarPlot } from '@mui/x-charts/BarChart';
import { FormSchemaPitches } from '../types/schemas/pitches-schema';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ResponsiveChartContainer } from '@mui/x-charts/ResponsiveChartContainer';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import { getResultCategory } from '../utils/utils';

type HistogramPitchProps = {
  pitches: FormSchemaPitches
}

type AtBatResultData = {
  key: number;
  label: string;
  status: boolean;
}

const HistogramPitchChart: React.FC<HistogramPitchProps> = ({ pitches }) => {
  const [abResultOption, setAbResultOption] = React.useState<readonly AtBatResultData[]>([
    { key: 0, label: 'BB/1B', status: false },
    { key: 1, label: 'STEAL', status: false },
    { key: 2, label: 'XBH', status: false },
    { key: 3, label: 'HR', status: false },
    // { key: 4, label: 'OUT', status: false },
  ]);

  const [bucketSizeOption, setBucketSizeOption] = React.useState<number>(100);
  // const [obcOption, setObcResultOption] = React.useState<number>(0);
  const [abResultFilteredPitches, setAbResultFilteredPitches] = React.useState<FormSchemaPitches>(pitches);

  const handleBucketSizeChange = (_event: Event, newValue: number | number[]) => {
    setBucketSizeOption(newValue as number);
  };

  const ListItem = styled('li')(({ theme }) => ({
    margin: theme.spacing(0.5),
  }));

  const handleAbChange = (dataToChange: AtBatResultData) => () => {
    setAbResultOption(abResultOption.map(d => (d.key == dataToChange.key ? { ...d, status: !d.status } : d)));
  };

  React.useEffect(() => {
    const abPickedOptionArray = abResultOption.filter((v) => v.status === true).map(item => item.label);

    const filteredPitches = abPickedOptionArray.length
      ? pitches.filter((v) => abPickedOptionArray.includes(getResultCategory(v)))
      : pitches;

    setAbResultFilteredPitches(filteredPitches);
  }, [abResultOption, pitches]);


  if (pitches.length !== 0) {
    const bucketSizeLabel = [{ value: 50, label: 50 }, { value: 100, label: 100 }, { value: 150, label: 150 }, { value: 200, label: 200 }];

    const createBins = (pitches: FormSchemaPitches, bucketSize: number) => {
      const bins = Array.from({ length: Math.ceil(1000 / bucketSize) }, () => 0); // initialize bins
      pitches.forEach((pitch) => {
        if (pitch.pitch >= 1 && pitch.pitch <= 1000) {
          const index = Math.floor((pitch.pitch - 1) / bucketSize); // Calculate which bucket this number falls into
          bins[index]++;
        }
      });
      return bins;
    };

    const bins = createBins(abResultFilteredPitches, bucketSizeOption);
    const chartData = bins.map((count, index) => ({
      bucket: `${index * bucketSizeOption + 1}-${(index + 1) * bucketSizeOption}`,
      count
    }));

    const xArray: string[] = []
    const yArray: number[] = []
    if (chartData && chartData.length > 0) {
      chartData.forEach((y) => {
        xArray.push(y.bucket)
        yArray.push(y.count);
      });
    }

    return (
      <Grid className="histogramChart" >

        <Stack
          direction={'column'}
          sx={{
            // alignItems: 'center',
            // justifyContent: 'space-evenly',
            height: '100%',
          }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6">Histogram of Pitches</Typography>
          </Box>
          <Grid size={{ xs: 12 }}>
            <div>
              <ResponsiveChartContainer height={300}
                series={[{ type: 'bar', data: yArray, color: '#e0998f' }]}
                xAxis={[
                  {
                    data: xArray,
                    scaleType: 'band',
                    id: 'x-axis-id',
                  }
                ]}
              >
                <ChartsXAxis position="bottom" axisId="x-axis-id" />
                <ChartsYAxis />
                <BarPlot barLabel={'value'} />
                <ChartsTooltip />
              </ResponsiveChartContainer>
            </div>
          </Grid>
          <Grid container spacing={2}>
            <Grid size={6}>
              <Typography gutterBottom fontSize={14} textAlign={'center'}>
                Result
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  listStyle: 'none',
                  width: '100%',
                  p: 0.5,
                  m: 0,
                }}
                component="ul"
              >
                {abResultOption.map((data) => {
                  let icon;

                  return (
                    <ListItem key={data.key}>
                      <Chip
                        icon={icon}
                        label={data.label}
                        onClick={handleAbChange(data)}
                        variant={(data.status ? 'filled' : 'outlined')}
                        color={(data.status ? 'primary' : 'default')}
                      />
                    </ListItem>
                  );
                })}
              </Box>
            </Grid>
            <Grid size={6}>
              <Box sx={{
                textAlign: 'center', alignItems: 'center',
                // display: 'flex',       // Set the display to flex
                justifyContent: 'center', // Horizontally center the item
                // height: '100vh',          // Full viewport height
                // padding: '0 5% 0 5%',
                width: '80%'
              }}>
                <Typography id="input-slider" gutterBottom fontSize={14}>
                  Bucket Size
                </Typography>
                <Slider
                  value={bucketSizeOption}
                  onChange={handleBucketSizeChange}
                  valueLabelDisplay="auto"
                  marks={bucketSizeLabel}
                  step={50}
                  min={50}
                  max={200}
                  defaultValue={100}
                  aria-labelledby="input-slider"
                // size="small"
                />
              </Box>
            </Grid>
          </Grid>
        </Stack>
      </Grid>
    );
  }
  else {
    return null;
  }
};

export default HistogramPitchChart;