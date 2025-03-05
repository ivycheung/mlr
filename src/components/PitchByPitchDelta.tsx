import { ChartsReferenceLine } from '@mui/x-charts/ChartsReferenceLine';
import { LineChart } from '@mui/x-charts/LineChart';
import React from 'react';
import { FormSchemaPitches } from '../types/schemas/pitches-schema';
import { calculatePitchCircleDelta, getResultCategory } from '../utils/utils';
import { isNumber } from 'chart.js/helpers';
import Container from '@mui/material/Container';
import { CircleMarkElement } from '../utils/rUtils';

interface PitchByPitchDeltaProps {
  pitches: FormSchemaPitches;
  showMarkers?: boolean
}

const PitchByPitchDelta: React.FC<PitchByPitchDeltaProps> = ({ pitches, showMarkers = false }) => {
  if (pitches.length != 0) {
    const pitchCount: number[] = [];
    const deltaNumbers: number[] = [];
    let delta: number = 0;
    const abResult: string[] = []
    const abResultWithAB: string[] = []
    const exactResult: string[] = []

    for (let i = 0; i < pitches.length; i++) {
      pitchCount.push(i + 1);
      abResult.push(pitches[i].exactResult)
      abResultWithAB.push(`${i + 1} - ${pitches[i].exactResult}`)
      exactResult.push(getResultCategory(pitches[i]) || '')
      delta = Number((i > 0 ? calculatePitchCircleDelta(pitches, i, false) : 0));
      if (isNumber(delta)) {
        deltaNumbers.push(delta);
      }
    }

    return (
      <Container sx={{
        height: { xs: '90vh', md: '50vh' },
        width: { xs: '90vw', lg: '45vw' },
        maxHeight: { xs: '350px' }
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
            }
          ]}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          slots={{ mark: showMarkers ? (props: any) => <CircleMarkElement {...props} customData={exactResult} /> : undefined }}
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