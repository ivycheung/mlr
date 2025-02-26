import { MarkElementProps, unstable_useLineSeries } from '@mui/x-charts';
import { animated, useSpring } from "@react-spring/web";
import { useTheme } from '@mui/material/styles';

// from: https://codesandbox.io/p/sandbox/adoring-water-lrzsn3?file=%2Fsrc%2FDemo.tsx%3A3%2C1-3%2C57
export function CircleMarkElement(props: MarkElementProps) {
  const theme = useTheme();
  const {
    x,
    y,
    id,
    color,
    dataIndex,
    skipAnimation,
    ...other
  } = props;

  const position = useSpring({ to: { x, y }, immediate: skipAnimation });
  const series = unstable_useLineSeries()?.series[id];
  if (!series) {
    return null;
  }

  return (
    <>
      <animated.circle
        {...other}
        cx={position.x}
        cy={position.y}
        r={4}
        fill={(theme).palette.background.paper}
        stroke={color}
        strokeWidth={2}
      />
      <animated.text
        x={position.x}
        y={position.y}
        transform="translate(0, -10)"
        textAnchor="middle"
        alignmentBaseline="baseline"
        fontSize={12}
      >
        {series.data[dataIndex]}
      </animated.text>
    </>
  );
}