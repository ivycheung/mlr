import { LineChart } from "@mui/x-charts/LineChart";
import { FormSchemaPitches } from "../types/schemas/pitches-schema";
import Container from "@mui/material/Container";
import { CircleMarkElement } from "../utils/rUtils";

interface PitchByPlacementInInningProps {
  pitches: FormSchemaPitches;

}

const PitchByPlacementInInning: React.FC<PitchByPlacementInInningProps> = ({ pitches }) => {
  if (pitches.length != 0) {
    let p1 = 1
    let p2 = 1
    let p3 = 1
    const p1Numbers: number[] = [] // first pitch
    const p1Count: number[] = [] // # of first pitch
    const p2Numbers: number[] = [] // second pitch
    const p2Count: number[] = [] // # of second pitch
    const p3Numbers: number[] = [] // third pitch
    const p3Count: number[] = [] // # of third pitch

    for (let i = 0; i < pitches.length; i++) {

      if (pitches[i].inning !== (pitches[i - 1]?.inning ?? '0')) {
        p1Numbers.push(pitches[i].pitch)
        p1Count.push(p1)
        p1++
      }
      if (pitches[i].inning === (pitches[i - 1]?.inning ?? '0') && pitches[i].inning !== (pitches[i - 2]?.inning ?? '0')) {
        p2Numbers.push(pitches[i].pitch)
        p2Count.push(p2)
        p2++
      }
      if (pitches[i].inning === (pitches[i - 1]?.inning ?? '0') && pitches[i].inning === (pitches[i - 2]?.inning ?? '0') && pitches[i].inning !== (pitches[i - 3]?.inning ?? '0')) {
        p3Numbers.push(pitches[i].pitch)
        p3Count.push(p3)
        p3++
      }

    }
    return (
      <Container sx={{
        height: { xs: document.documentElement.clientHeight, md: document.documentElement.clientHeight * 0.5, lg: document.documentElement.clientHeight * 0.45 },
        width: { xs: document.documentElement.clientWidth * 0.9, lg: document.documentElement.clientWidth * 0.45 }
      }}>
        <LineChart
          title="Pitches by Placement in Inning"
          xAxis={[{ label: "Inning", data: p1Count, scaleType: 'band', tickPlacement: 'middle' }]}
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
          ]}
          slots={{ mark: CircleMarkElement }}
        />
      </Container>)
  }
  else {
    return null
  }
};

export default PitchByPlacementInInning;