import React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import Container from '@mui/material/Container';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { CircleMarkElement } from '../utils/rUtils';
import { FormSchemaPitches } from '../types/schemas/pitches-schema';
import { getResultCategory } from '../utils/utils';

type PitchSwingChartProps = {
  pitches: FormSchemaPitches;
  showMarkers?: boolean
}

const PitchSwingChart: React.FC<PitchSwingChartProps> = ({ pitches, showMarkers = false }) => {
  const pitchNumbers: number[] = []
  const swingNumbers: number[] = []
  const pitchCount: number[] = []
  const abResult: string[] = []
  const exactResult: string[] = []

  const theme = useTheme();
  const notDesktop = useMediaQuery(theme.breakpoints.down('md'));

  if (pitches.length != 0) {
    pitches.forEach((pitch, i) => {
      pitchNumbers.push(pitch.pitch)
      swingNumbers.push(pitch.swing)
      pitchCount.push(i + 1)
      abResult.push(`${i + 1} - ${pitch.exactResult}`)
      exactResult.push(getResultCategory(pitch) || '')
    })

    return (
      <Container sx={{
        height: { xs: '90vh', md: '50vh' },
        width: { xs: '90vw', lg: '50vw' },
        maxHeight: { xs: '350px' },
        px: {xs: 0, md: 3}
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
          grid={{ horizontal: true }}
          series={[
            {
              data: pitchNumbers,
              label: "Pitch",
              id: 'pitchNumbers'
            },
            {
              data: swingNumbers,
              label: "Swing",
              id: 'swingNumbers'
            },
          ]}
          sx={{
            '.MuiLineElement-series-swingNumbers': {
              strokeDasharray: '3 3',
            },

          }}
          slots={{
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            mark: showMarkers || (pitchCount.length <= 10 || notDesktop) ? (props: any) => <CircleMarkElement {...props} customData={exactResult} /> : undefined,
          }}
          slotProps={{
            legend: {
              position: { vertical: 'top', horizontal: 'middle' },
              padding: 0,
              labelStyle: {
                fontSize: 14,
              },
            }
          }}
        >
          </LineChart>
      </Container>
    );
  }
}

export default PitchSwingChart;
