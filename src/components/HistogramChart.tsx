import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { FormSchemaPitches } from '../types/schemas/pitches-schema';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';

const HistogramChart: React.FC<HistogramChartProps> = ({ pitches }) => {
  const [bucketSizeOption, setBucketSizeOption] = React.useState<number>(100);

  const handleBucketSizeChange = (event: Event, newValue: number | number[]) => {
    setBucketSizeOption(newValue as number);
  };

  if (pitches.length !== 0) {
    const bucketSizeLabel = [{ value: 50, label: 50 }, { value: 100, label: 100 }, { value: 150, label: 150 }, {value: 200, label: 200}];

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

    return (
      <div className="histogram">
        <Box sx={{ width: 300 }}>
        <BarChart
          dataset={chartData}
          series={[{ dataKey: 'count' }]}
          xAxis={[{ dataKey: 'bucket', scaleType: 'band', tickPlacement: 'middle' }]}
          height={document.documentElement.clientHeight * 0.50}
          width={document.documentElement.clientWidth * 0.40}
          barLabel="value"
          
        />
        
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
      </div>
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