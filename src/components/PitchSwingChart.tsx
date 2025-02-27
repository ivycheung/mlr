import { LineChart } from '@mui/x-charts/LineChart';
import { FormSchemaPitches } from '../types/schemas/pitches-schema';
import Container from '@mui/material/Container';
import React from 'react';
import { CircleMarkElement } from '../utils/rUtils';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';


interface PitchSwingChartProps {
  pitches: FormSchemaPitches;
  showMarkers?: boolean
}

const PitchSwingChart: React.FC<PitchSwingChartProps> = ({ pitches, showMarkers = false }) => {
  const pitchNumbers: number[] = []
  const swingNumbers: number[] = []
  const pitchCount: number[] = []
  const abResult: string[] = []

  const theme = useTheme();
  const notDesktop = useMediaQuery(theme.breakpoints.down('md'));

  if (pitches.length != 0) {
    pitches.forEach((pitch, i) => {
      pitchNumbers.push(pitch.pitch)
      swingNumbers.push(pitch.swing)
      pitchCount.push(i + 1)
      abResult.push(`${i + 1} - ${pitch.exactResult}`)
    })

    return (
      <Container sx={{
        height: { xs: document.documentElement.clientHeight, md: document.documentElement.clientHeight * 0.5, lg: document.documentElement.clientHeight * 0.45 },
        width: { xs: document.documentElement.clientWidth * 0.9, lg: document.documentElement.clientWidth * 0.45 }
      }}>
        <LineChart
          xAxis={[{
            data: abResult, scaleType: 'band', tickPlacement: 'middle',
            tickLabelStyle: {
              angle: -25,
              textAnchor: 'end',
              fontSize: 12,
            }
          }]}
          grid={{ horizontal: (pitchCount.length <= 10) ? false : true }}
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
          slots={{ mark: showMarkers || (pitchCount.length <= 10 || notDesktop) ? CircleMarkElement : undefined }}
        />
      </Container>

    );
  }
}

export default PitchSwingChart;
