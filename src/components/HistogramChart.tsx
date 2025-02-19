import React from 'react';
import { BarPlot } from '@mui/x-charts/BarChart';
import { FormSchemaPitches } from '../types/schemas/pitches-schema';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import Grid2 from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ResponsiveChartContainer } from '@mui/x-charts/ResponsiveChartContainer';
// import { ResponsiveContainer } from '@mui/x-charts/ResponsiveContainer';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';

const HistogramChart: React.FC<HistogramChartProps> = ({ pitches }) => {
  const [bucketSizeOption, setBucketSizeOption] = React.useState<number>(100);

  const handleBucketSizeChange = (_event: Event, newValue: number | number[]) => {
    setBucketSizeOption(newValue as number);
  };

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

    const bins = createBins(pitches, bucketSizeOption);
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
      <Grid2 className="histogramChart" >
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
          {/* </Stack>
        <Stack> */}
          <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
            <div>
              <ResponsiveChartContainer height={300}
                series={[{ type: 'bar', data: yArray }]}
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
                <BarPlot />
                <ChartsTooltip />

                {/* <BarChart
            dataset={chartData}
            series={[{ dataKey: 'count' }]}
            xAxis={[{ dataKey: 'bucket', scaleType: 'band', tickPlacement: 'middle' }]}
            height={document.documentElement.clientHeight * 0.50}
            width={document.documentElement.clientWidth}
            barLabel="value"

          /> */}
              </ResponsiveChartContainer>
            </div>
          </Grid2>
          <Box sx={{
            textAlign: 'center', alignItems: 'center',
            // display: 'flex',       // Set the display to flex
            justifyContent: 'center', // Horizontally center the item
            // height: '100vh',          // Full viewport height
            padding: '0 20% 0 20%'
          }}>
            <Typography id="input-slider" gutterBottom>
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
            />
          </Box>
        </Stack>
      </Grid2>
    );
  }
  else {
    return null;
  }

};

interface HistogramChartProps {

  pitches: FormSchemaPitches

}

export default HistogramChart;