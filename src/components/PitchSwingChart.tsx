import { LineChart } from '@mui/x-charts/LineChart';
import { FormSchemaPitches } from '../types/schemas/pitches-schema';

interface PitchSwingChartProps {

  pitches: FormSchemaPitches;

}

const PitchSwingChart: React.FC<PitchSwingChartProps> = ( {pitches} ) => {
  const pitchNumbers: number[] = []
  const swingNumbers: number[] = []
  const pitchCount: number[] = []

  if (pitches.length != 0) {
    pitches.map((pitch, i) => {
      pitchNumbers.push(pitch.pitch)
      swingNumbers.push(pitch.swing)
      pitchCount.push(i)
    })

    return (
      <LineChart
        xAxis={[{ data: pitchCount }]}
        series={[
          {
            data: pitchNumbers,
            label: "Pitch",
          },
          {
            data: swingNumbers,
            label: "Swing",
          },
        ]}
        height={document.documentElement.clientHeight * 0.75}
        width={document.documentElement.clientWidth * 0.40}
      />
    );
  }  
}

export default PitchSwingChart;
