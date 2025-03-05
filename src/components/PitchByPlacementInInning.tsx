import { LineChart } from "@mui/x-charts/LineChart";
import { FormSchemaPitches } from "../types/schemas/pitches-schema";
import Container from "@mui/material/Container";
import { CircleMarkElement } from "../utils/rUtils";

interface PitchByPlacementInInningProps {
  pitches: FormSchemaPitches;

}

const PitchByPlacementInInning: React.FC<PitchByPlacementInInningProps> = ({ pitches }) => {
  if (pitches.length != 0) {
    let p1Numbers: number[] = [] // first pitch
    let p2Numbers: number[] = [] // second pitch
    let p3Numbers: number[] = [] // third pitch
    // const p4Count: number[] = [] // # of third pitch

    const inningsPitches: Record<number, Array<number>> = {};
    pitches.forEach(entry => {
      const { inning, pitch } = entry as { inning: string, pitch: number };
      const inningInteger = Number(inning.slice(1));
      if (!inningsPitches[Number(inning.slice(1))]) {
        inningsPitches[inningInteger] = [];
      }
      inningsPitches[inningInteger].push(pitch);
    });

    const maxPitchesInInning = Math.max(...Object.values(inningsPitches).map(pitches => pitches.length));
    const groupedPitchesByPosition = [];

    for (let i = 0; i < maxPitchesInInning; i++) {
      const pitchesAtPosition : number[] = [];
      Object.values(inningsPitches).forEach(pitches => {
        pitchesAtPosition.push(pitches[i] || 0); // `0` for missing pitches in some innings
        if (pitchesAtPosition.length > 4) return;
      });

      groupedPitchesByPosition.push(pitchesAtPosition);
    }

    const length = groupedPitchesByPosition[0].length || 0;
    const maxPitchesInInningArray = Array.from({ length }, (_, index) => index+1);
    p1Numbers = groupedPitchesByPosition[0] || [];
    p2Numbers = groupedPitchesByPosition[1] || [];
    p3Numbers = groupedPitchesByPosition[2] || [];
    // p4Numbers = groupedPitchesByPosition[3] || [];

    return (
      <Container sx={{
        height: { xs: '90vh', md: '50vh' },
        width: { xs: '90vw', lg: '45vw' },
        maxHeight: { xs: '350px' }
      }}>
        <LineChart
          title="Pitches by Placement in Inning"
          xAxis={[{ label: "Inning", data: maxPitchesInInningArray, tickInterval: maxPitchesInInningArray, scaleType: 'point'}]}
          series={[
            {
              label: "First Pitches", data: p1Numbers, color: "red"
            },
            {
              label: "Second Pitches", data: p2Numbers, color: "green"
            },
            {
              label: "Third Pitches", data: p3Numbers, color: "magenta"
            },
            // {
            //   label: "Fourth Pitches", data: p4Numbers, color: "blue"
            // },
          ]}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          slots={{ mark: (props: any) => <CircleMarkElement {...props} /> }}
        />
      </Container>)
  }
  else {
    return null
  }
};

export default PitchByPlacementInInning;