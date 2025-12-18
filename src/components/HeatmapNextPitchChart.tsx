import { FormSchemaPitches } from "../types/schemas/pitches-schema";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { HeatmapTableColumnGenerate } from "../utils/rUtils";
import { createBins, getBinIndex, sortIntoBins, sortResultPitchesInBins } from "../utils/utils";

// Function to determine the background color based on the value
function getBackgroundColor(value: number): string {
  if (value < 5) return  "#fde5df";  // lightest
  if (value < 10) return "#f7a192";
  if (value < 15) return "#ff6e54";
  if (value < 20) return "#dd5182";
  if (value < 25) return "#b55192";
  if (value < 30) return "#955196";
  if (value < 35) return "#7d4f92";
  if (value < 40) return "#6e4a8e";
  if (value < 45) return "#674a8c";
  return                 "#5f4a8b";  // darkest
}

const HeatmapNextPitchChart: React.FC<HeatmapTooChartProps> = ({ pitches }) => {
  if (pitches.length == 0) {
    return null;
  }

  const numberOfPitches = pitches.length;
  const currentPitchNumber = pitches[numberOfPitches-1].pitch;

  const bins = createBins();
  const chartData = sortIntoBins(pitches, bins);
  const currentPitchBinIndex = getBinIndex(currentPitchNumber);
  const currentBin = chartData[currentPitchBinIndex].label;

  const pitchAfterData = chartData[currentPitchBinIndex];
  const pitchAfterCharts = sortResultPitchesInBins(pitchAfterData.nextPitches, createBins());

  const firstColumnData = pitchAfterCharts.slice(0, 5);
  const secondColumnData = pitchAfterCharts.slice(5, 10);

  return (
    <Grid
      container
      className="heatmap-pitches"
      sx={{ backgroundColor: "#f5f5f5", paddingY: 2 }}
    >
      <Box sx={{ width: "100%", textAlign: "center", padding: 0.5 }}>
        <Typography variant="h6" gutterBottom sx={{ paddingBottom: 1 }}>
          Pitches After {currentBin} (Pitch {currentPitchNumber})
        </Typography>
        <Grid container spacing={2}>
          {HeatmapTableColumnGenerate(firstColumnData, getBackgroundColor)}
          {HeatmapTableColumnGenerate(secondColumnData, getBackgroundColor)}
        </Grid>
      </Box>
    </Grid>
  );
};

interface HeatmapTooChartProps {
  pitches: FormSchemaPitches;
}

export default HeatmapNextPitchChart;
