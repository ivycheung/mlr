import { LineChart } from "@mui/x-charts/LineChart";
import { FormSchemaPitches } from "../types/schemas/pitches-schema";
import Container from "@mui/material/Container";
import { CircleMarkElement } from "../utils/rUtils";

type PitchByPlacementInInningProps = {
  pitches: FormSchemaPitches;
}

type DataPoint = number | null;

const PitchByPlacementInInning: React.FC<PitchByPlacementInInningProps> = ({ pitches }) => {
  if (pitches.length != 0) {
    let p1Numbers: DataPoint[] = [] // first pitch
    let p2Numbers: DataPoint[] = [] // second pitch
    let p3Numbers: DataPoint[] = [] // third pitch
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
      const pitchesAtPosition: DataPoint[] = [];
      Object.values(inningsPitches).forEach(pitches => {
        pitchesAtPosition.push(pitches[i] || null); // `0` for missing pitches in some innings
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
        width: { xs: '90vw', lg: '100%' },
        maxHeight: { xs: '350px' },
        px: { xs: 0, md: 3 },
        pt: {xs: 2 }
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
          slotProps={{
            legend: {
              position: { vertical: 'top', horizontal: 'middle' },
              padding: -2,
              labelStyle: {
                fontSize: 14,
              },
            },
          }}
        />
      </Container>)
  }
  else {
    return null
  }
};

export default PitchByPlacementInInning;