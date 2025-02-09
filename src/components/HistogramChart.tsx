import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { FormSchemaPitches } from '../types/schemas/pitches-schema';

const HistogramChart: React.FC<HistogramChartProps> = ({ pitches, bucketSizeOption }) => {
  // const bucketSize : number[] = [50, 100, 200];
  const bucketSize = bucketSizeOption;

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

  const bins = createBins(pitches, bucketSize);
  const chartData = bins.map((count, index) => ({
    bucket: `${index * bucketSize + 1}-${(index + 1) * bucketSize}`,
    count
  }));

  console.log(chartData)
  return (
    <div className="histogram">
      <BarChart
        dataset={chartData}
        series={[{ dataKey: 'count' }]}
        xAxis={[{ dataKey: 'bucket', scaleType: 'band', }]}
        height={document.documentElement.clientHeight * 0.50}
        width={document.documentElement.clientWidth * 0.40}
        barLabel="value"
      />
    </div>
  );
};

interface HistogramChartProps {

  pitches: FormSchemaPitches,
  bucketSizeOption: number

}

export default HistogramChart;