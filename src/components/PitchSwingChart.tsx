import { LineChart } from '@mui/x-charts/LineChart';
import { FormSchemaPitches } from '../types/schemas/pitches-schema';
import Container from '@mui/material/Container';
import React from 'react';
import { CircleMarkElement } from '../utils/rUtils';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';


interface PitchSwingChartProps {
  pitches: FormSchemaPitches;
}

const PitchSwingChart: React.FC<PitchSwingChartProps> = ({ pitches }) => {
  const pitchNumbers: number[] = []
  const swingNumbers: number[] = []
  const pitchCount: number[] = []

  const theme = useTheme();
  const notDesktop = useMediaQuery(theme.breakpoints.down('md'));

  if (pitches.length != 0) {
    pitches.forEach((pitch, i) => {
      pitchNumbers.push(pitch.pitch)
      swingNumbers.push(pitch.swing)
      pitchCount.push(i+1)
    })

    return (
      <Container sx={{
        height: { xs: document.documentElement.clientHeight, md: document.documentElement.clientHeight * 0.5, lg: document.documentElement.clientHeight * 0.45 },
        width: { xs: '100%', lg: document.documentElement.clientWidth * 0.45 }
      }}>
        <LineChart
          xAxis={[{ data: pitchCount, scaleType: 'band', tickPlacement: 'middle' },]}
          grid={{ horizontal: (pitchCount.length <=10) ? false: true }}
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
          slots={{ mark: (pitchCount.length <= 10 || notDesktop) ? CircleMarkElement : undefined }}
        />
      </Container>

    );
  }
}

export default PitchSwingChart;
