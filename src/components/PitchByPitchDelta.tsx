import { ChartsReferenceLine } from '@mui/x-charts/ChartsReferenceLine';
import { LineChart } from '@mui/x-charts/LineChart';
import React from 'react';
import { FormSchemaPitches } from '../types/schemas/pitches-schema';
import { calculatePitchCircleDelta } from '../utils/utils';
import { isNumber } from 'chart.js/helpers';
import Container from '@mui/material/Container';

interface PitchByPitchDeltaProps {
  pitches: FormSchemaPitches;
}

const PitchByPitchDelta: React.FC<PitchByPitchDeltaProps> = ({ pitches }) => {
  if (pitches.length != 0) {
    const pitchCount: number[] = [];
    const deltaNumbers: number[] = [];
    let delta: number = 0;

    for (let i = 0; i < pitches.length; i++) {
      pitchCount.push(i+1);
      delta = Number((i > 0 ? calculatePitchCircleDelta(pitches, i, false) : 0));
      if (isNumber(delta)) {
        deltaNumbers.push(delta);
      }
    }

    return (
      <Container sx={{
        height: { xs: document.documentElement.clientHeight, md: document.documentElement.clientHeight * 0.5, lg: document.documentElement.clientHeight * 0.45 },
        width: { xs: '100%', lg: document.documentElement.clientWidth * 0.40 }
      }}>
        <LineChart
          title="Delta from Pitch to Pitch"
          xAxis={[{ data: pitchCount, scaleType: 'band' }]}
          yAxis={[{
            min: -500,   // Set the minimum value for Y-Axis
            max: 500,    // Set the maximum value for Y-Axis
            tickInterval: [-500, -400, -300, -200, -100, 0, 100, 200, 300, 400, 500], // Set custom tick values
          },]}
          series={[
            {
              label: "Delta", data: deltaNumbers, color: "teal"
            },
          ]}
          tooltip={{ trigger: 'item' }}
          grid={{ horizontal: true }}
        >
          <ChartsReferenceLine y={0} label="0" labelAlign="end" />
        </LineChart>
      </Container>
    )
  }
  else {
    return null;
  }

};

export default PitchByPitchDelta;