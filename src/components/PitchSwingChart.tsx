import { LineChart } from '@mui/x-charts/LineChart';
import { FormSchemaPitches } from '../types/schemas/pitches-schema';
import Container from '@mui/material/Container';

interface PitchSwingChartProps {
  pitches: FormSchemaPitches;
}

const PitchSwingChart: React.FC<PitchSwingChartProps> = ({ pitches }) => {
  const pitchNumbers: number[] = []
  const swingNumbers: number[] = []
  const pitchCount: number[] = []

  if (pitches.length != 0) {
    pitches.forEach((pitch, i) => {
      pitchNumbers.push(pitch.pitch)
      swingNumbers.push(pitch.swing)
      pitchCount.push(i)
    })

    return (
      <Container sx={{
        height: { sm: document.documentElement.clientHeight, md: document.documentElement.clientHeight * 0.5, lg: document.documentElement.clientHeight * 0.45 },
        width: { sm: '100%', lg: document.documentElement.clientWidth * 0.40 }
      }}>
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
        />
      </Container>
    );
  }
}

export default PitchSwingChart;
