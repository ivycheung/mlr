import { LineChart } from '@mui/x-charts/LineChart';
import React from 'react';
import { FormSchemaPitches } from '../types/schemas/pitches-schema';

interface PitchesByInningProps {
  pitches: FormSchemaPitches;
}

  const colors: { [key: number]: string } = {
    1: 'red',
    2: 'orange',
    3: '#8B8000',
    4: 'green',
    5: 'blue',
    6: 'indigo',
    7: 'violet',
    8: 'gray',
    9: '#B47ADC',
    10: 'crimson',
    11: 'coral',
    12: 'khaki',
    13: 'mediumseagreen',
    14: 'aqua',
    15: 'mediumslateblue',
  };

const PitchesByInning: React.FC<PitchesByInningProps> = ({ pitches }) => {
  if (pitches.length != 0) {
    let seriesArray: { data: number[]; label: string; color: string }[] = [];
    // const inningNumbers: { inning: number; pitches: number[] }[] = [];
    const pitchCount: number[] = [];
    const pitchNumbers: number[] = [];
    const swingNumbers: number[] = [];
    let currentChunk: number[] = []
    const inningPitches = []
    const innings = []
    const inningObject: { inning: number, pitches: number[] }[] = [];

    for(let i = 0; i < pitches.length; i++) {
      pitchCount.push(i);
      pitchNumbers.push(pitches[i].pitch);
      swingNumbers.push(pitches[i].swing);

      if (currentChunk.length === 0 || pitches[i - 1].inning === pitches[i].inning) {
        currentChunk.push(pitches[i].pitch);
      } else {
        inningPitches.push(currentChunk);
        currentChunk = [pitches[i].pitch];
      }
    }

    
  

  if (currentChunk.length > 0) {
    inningPitches.push(currentChunk);
  }

    for (let i = 0; i < inningPitches.length; i++) {
      inningObject.push({ inning: i + 1, pitches: inningPitches[i] })
      innings.push(i + 1)
    }

    seriesArray = inningObject.map((series) => ({
      data: series.pitches,
      label: `Inn. ${series.inning.toString()}`,
      color: colors[series.inning]
    }));

      return (
        <LineChart
          title="Pitches by Inning"
          xAxis={[{ data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], label: "Pitch Number", tickNumber: 15, tickInterval: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], scaleType: 'point', min: 1, max: 10 }
          ]}
          series={seriesArray}
          height={document.documentElement.clientHeight * 0.75}
          width={document.documentElement.clientWidth * 0.40}
          margin={{ top: 100 }}
        />
      )
    }
    else {
      return null;
    }
};

export default PitchesByInning;