import { ChartsReferenceLine } from '@mui/x-charts/ChartsReferenceLine';
import { LineChart } from '@mui/x-charts/LineChart';
import React from 'react';
import { FormSchemaPitches } from '../types/schemas/pitches-schema';
import { calculatePitchCircleDelta } from '../utils/utils';
import { isNumber } from 'chart.js/helpers';

interface PitchByPitchDeltaProps {
  pitches: FormSchemaPitches;
}

const PitchByPitchDelta: React.FC<PitchByPitchDeltaProps> = ({ pitches }) => {
  if (pitches.length != 0) {
    const pitchCount: number[] = [];
    const deltaNumbers: number[] = [];
    let delta : number = 0;

    for (let i = 0; i < pitches.length; i++) {
      pitchCount.push(i);
      delta = Number((i > 0 ? calculatePitchCircleDelta(pitches, i, false) : 0));
      if (isNumber(delta)) {
        deltaNumbers.push(delta);
      }
    }

      return (
        <LineChart
          title="Delta from Pitch to Pitch"
          xAxis={[{ data: pitchCount,scaleType: 'band' }]}
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
          height={document.documentElement.clientHeight * 0.75}
          tooltip={{ trigger: 'item' }}
        >
          <ChartsReferenceLine y={0} label="0" labelAlign="end" />
        </LineChart>
      )
    }
    else {
      return null;
    }

};

export default PitchByPitchDelta;