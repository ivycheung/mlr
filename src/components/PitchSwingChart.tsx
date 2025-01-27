import { LineChart } from '@mui/x-charts/LineChart';
import { FormSchemaPitches } from '../types/schemas/pitches-schema';

export default function PitchSwingChart(pitches: FormSchemaPitches) {
  const pitchNumbers = []
  const swingNumbers = []
  const pitchCount = []
  
  for (let i = 0; i < pitches.length; i++) {
    pitchNumbers.push(pitches[i].pitch)
    swingNumbers.push(pitches[i].swing)
    pitchCount.push(i)
  }
  
  console.log(pitchNumbers)
  return (
    <LineChart
      xAxis={[{ data: pitchCount }]}
      series={[
        {
          data: pitchNumbers
        },
        {
          data: swingNumbers
        },
      ]}
      width={500}
      height={300}
    />
  );
}