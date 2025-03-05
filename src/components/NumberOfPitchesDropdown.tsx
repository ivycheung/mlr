import React from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';


interface NumberOfPitchesDropdownProps {
  handleChangeNumberOfPitches: (nopOption: number) => void;
  nopOption: number;
  hideLabel: boolean;
}

const NumberOfPitchesDropdown: React.FC<NumberOfPitchesDropdownProps> = ({ handleChangeNumberOfPitches, nopOption, hideLabel = false }) => {

  const theme = useTheme();
  const notDesktop = useMediaQuery(theme.breakpoints.down('md'));

  const handleDropdownChange = ((e: { target: { value: string } }) => {
    const nopOption = Number(e.target.value);
    handleChangeNumberOfPitches(nopOption);
  }
  );

  const nopOptionsArray = [10, 15, 20];

  return (<FormControl sx={{ m: 1, minWidth: { xs: 100 }, ml: { lg: 0 }} }>
    {hideLabel || notDesktop ?
      <InputLabel id="nop-input-select-label" shrink># of Pitches</InputLabel> :
      <InputLabel id="nop-input-select-label"># of Pitches</InputLabel>
      }
    <Select
      labelId="nop-input-select-label"
      id="nop-input-select"
      // label={teamOption}
      onChange={handleDropdownChange}
      value={nopOption ? nopOption.toString() : ''}
    >
      {
        nopOptionsArray.map((option) => {
          return (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          )
        })
      }
    </Select>
    {/* {hideLabel || notDesktop ? '' : <FormHelperText>{teamOption ? '' : 'Select Team'}</FormHelperText>} */}
  </FormControl>

  );
}

export default NumberOfPitchesDropdown;
