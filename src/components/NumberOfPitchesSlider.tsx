import Slider, { SliderMarkLabel } from "@mui/material/Slider";
// import { styled, useTheme } from "@mui/material/styles";
// import useMediaQuery from "@mui/material/useMediaQuery";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import { useCallback } from "react";

interface NumberOfPitchesSliderProps {
  handleChangeNumberOfPitches: (nopeOption: number) => void
}

const NumberOfPitchesSlider: React.FC<NumberOfPitchesSliderProps> = ({ handleChangeNumberOfPitches }) => {

  // const theme = useTheme();
  // const notDesktop = useMediaQuery(theme.breakpoints.down('md'));

  function handleSliderChange(_event: Event | null, newValue: number | number[], activeThumb: number) {
    const nopeOption = newValue as number;
    handleChangeNumberOfPitches(nopeOption);
    console.log(_event)
    console.log(nopeOption)
    console.log(activeThumb)
  }

  const NOPSlider = styled(Slider)(() => ({
    padding: '15px 0',
    '& .MuiSlider-markLabel': {
      fontSize: 12
    },
  }));

  const ClickableSliderMarkLabel = (props) => {
    const { labelOnChange, ownerState, ...restProps } = props;

    const markValue = ownerState?.marks[props?.["data-index"]]?.value;

    const noop = useCallback((event: React.SyntheticEvent) => {
      event.stopPropagation();
    }, []);

    const onClick = useCallback(
      (e: React.SyntheticEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (markValue != null) {
          labelOnChange(e, markValue);
        }
      },
      [labelOnChange, markValue],
    );

    return (
      <SliderMarkLabel
        onMouseDown={noop}
        onTouchStart={noop}
        onClick={onClick}
        ownerState={ownerState}
        {...restProps}
      />
    );
  };

  const marks = [{ label: 10, value: 10 }, { label: 15, value: 15 }, { label: 20, value: 20 }, { label: 25, value: 25 }, { label: 30, value: 30 }];
  return (
    <Box sx={{ m: 1, minWidth: { xs: 150, sm: 200, lg: 240 }, mx: { xs: 2, lg: 2 }, }}>
      <NOPSlider
        aria-label="# of Pitches"
        defaultValue={15}
        // getAriaValueText={valuetext}
        valueLabelDisplay="auto"
        // shiftStep={5}
        step={5}
        marks={marks}
        min={10}
        max={30}
        size={'small'}
        sx={{mb: 1}}
        onChange={handleSliderChange}
        slotProps={{
          markLabel: {
            onClick: (event) => {
              const markIndex = event.currentTarget.getAttribute('data-index');
              const mark = marks[Number(markIndex)];
              const { value } = mark;
              handleSliderChange(null, value, 1);
            },
          },
        }}
        slots={{
          markLabel: ClickableSliderMarkLabel,
        }}
      />
    </Box>
  )
}
export default NumberOfPitchesSlider;