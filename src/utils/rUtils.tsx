import { MarkElementProps, unstable_useLineSeries } from '@mui/x-charts';
import { animated, useSpring } from "@react-spring/web";
import { useTheme } from '@mui/material/styles';
import Grid from "@mui/material/Grid2";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";

// from: https://codesandbox.io/p/sandbox/adoring-water-lrzsn3?file=%2Fsrc%2FDemo.tsx%3A3%2C1-3%2C57

interface CircleMarkElementProps {
  customData?: string[];
}
export function CircleMarkElement(props: CircleMarkElementProps & MarkElementProps) {
  const theme = useTheme();
  const {
    x,
    y,
    id,
    color,
    dataIndex,
    skipAnimation,
    customData,
    ...other
  } = props;
  let strokeWidth = 2;
  let circleColor = color;
  let fill = (theme).palette.background.paper;
  let radius = 3;

  const position = useSpring({ to: { x, y }, immediate: skipAnimation });
  const series = unstable_useLineSeries()?.series[id];
  if (!series) {
    return null;
  }

  if (customData) {
    switch (customData[dataIndex]) {
      case 'BB/1B':
      case 'STEAL':
        circleColor = '#df1c44'
        fill = circleColor;
        strokeWidth = 2;
        radius = 3;
        break;
      case 'XBH':
        circleColor = '#fdbc2e'
        strokeWidth = 2;
        fill = circleColor;
        radius = 4;
        break;
      case 'HR':
        strokeWidth = 2;
        circleColor = '#288810';
        fill = circleColor
        radius = 4;
        break;
      case 'OUT':
        circleColor = '#9e9e9e'
        strokeWidth = 1;
        // fill = circleColor
        break;
      default:
        circleColor = ''
        fill = color
        break;
    }
  }

  return (
    <>
      <animated.circle
        {...other}
        cx={position.x}
        cy={position.y}
        r={radius}
        fill={fill}
        stroke={circleColor}
        strokeWidth={strokeWidth}
      />
      <animated.text
        x={position.x}
        y={position.y}
        transform="translate(0, -10)"
        textAnchor="middle"
        alignmentBaseline="baseline"
        fontSize={12}
        fill={(theme).palette.primary.dark}
      >
        {series.data[dataIndex]}
      </animated.text>
    </>
  );
}

interface HeatmapColumnDataProps {
  label: string;
  percentage: number;
}

export function HeatmapTableColumnGenerate(columnData : HeatmapColumnDataProps[], getBackgroundColorFn : (n: number) => string) {
  return (
    <Grid size={6}>
      <TableContainer>
        <Table size="small">
          <TableBody>
            {columnData.map((row: HeatmapColumnDataProps) => (
              <TableRow key={row.label}>
                <TableCell sx={{ textAlign: "center", border: 1 }}>
                  {row.label}
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: getBackgroundColorFn(row.percentage),
                    textAlign: "center",
                    border: 1,
                    padding: 1,
                  }}
                >
                  {row.percentage}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
}