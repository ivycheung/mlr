import { ChartsReferenceLine } from '@mui/x-charts/ChartsReferenceLine';
import { LineChart } from '@mui/x-charts/LineChart';
import React from 'react';
import { FormSchemaPitches } from '../types/schemas/pitches-schema';
import { calculatePitchCircleDelta, getResultCategory } from '../utils/utils';
import { isNumber } from 'chart.js/helpers';
import Container from '@mui/material/Container';
import { CircleMarkElement } from '../utils/rUtils';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

interface PitchByPitchDeltaProps {
  pitches: FormSchemaPitches;
  showMarkers?: boolean
}

type DataPoint = number | null;

const PitchByPitchDelta: React.FC<PitchByPitchDeltaProps> = ({ pitches, showMarkers = false }) => {
  const theme = useTheme();
  const notDesktop = useMediaQuery(theme.breakpoints.down('md'));

  if (pitches.length != 0) {
    const pitchCount: number[] = [];
    const deltaNumbers: DataPoint[] = [];
    let delta: number = 0;
    const abResult: string[] = []
    const abResultWithAB: string[] = []
    const exactResult: string[] = []

    for (let i = 0; i < pitches.length; i++) {
      abResultWithAB.push(`${i + 1} - ${pitches[i].exactResult}`)
      exactResult.push(getResultCategory(pitches[i]) || '')
      if (i == 0) {
        deltaNumbers.push(null);
      }
      else {
        pitchCount.push(i + 1);
        abResult.push(pitches[i].exactResult)
        delta = Number((i > 0 ? calculatePitchCircleDelta(pitches, i, false) : 0));
        if (isNumber(delta)) {
          deltaNumbers.push(delta);
        }
      }
    }

    return (
      <Container sx={{
        height: { xs: '90vh', md: '50vh' },
        width: { xs: '90vw', lg: '100%' },
        maxHeight: { xs: '350px' },
        px: { xs: 0, md: 3 }
      }}>
        <LineChart
          // title="Delta from Pitch to Pitch"
          xAxis={[{
            data: abResultWithAB, scaleType: 'band', tickPlacement: 'middle',
            // https://mui.com/x/react-charts/axis/#text-customization
            tickLabelStyle: {
              angle: -25,
              textAnchor: 'end',
              fontSize: 12,
            }
          }]}
          yAxis={[{
            min: -500,   // Set the minimum value for Y-Axis
            max: 500,    // Set the maximum value for Y-Axis
            tickInterval: [-500, -400, -300, -200, -100, 0, 100, 200, 300, 400, 500], // Set custom tick values
          },]}
          series={[
            {
              label: "Delta", data: deltaNumbers, color: "#b36200",
              // valueFormatter: (value) => (value == null ? 'NaN' : value.toString()),
            }
          ]}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          slots={{ mark: showMarkers || (pitchCount.length <= 10 || notDesktop) ? (props: any) => <CircleMarkElement {...props} customData={exactResult} /> : undefined }}
          slotProps={{
            legend: {
              position: { vertical: 'top', horizontal: 'middle' },
              labelStyle: {
                fontSize: 14,
              },
            }
          }}
        >
          <ChartsReferenceLine y={0} />
        </LineChart>
      </Container>
    )
  }
  else {
    return null;
  }
};

export default PitchByPitchDelta;