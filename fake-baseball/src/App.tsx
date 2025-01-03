import * as React from 'react'
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import { FormSchemaPitches } from './types/schemas/pitches-schema';
import { FormSchemaPlayers } from './types/schemas/player-schema';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import axios from 'axios'
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Grid from '@mui/material/Grid2';
import { LineChart } from '@mui/x-charts/LineChart';
import { getModel1, getModel2, getModel3, getModel4, getModel5, getModel6, getModel7, getModel8, getModel9, getModel10, getModel11, getModel12, getModel13, getModel14, getModel15, getModel16 } from './utils/utils';

export default function App() {
  const [players, setPlayers] = React.useState<FormSchemaPlayers>([])
  const [pitchers, setPitchers] = React.useState<FormSchemaPlayers>([])
  const [pitches, setPitches] = React.useState<FormSchemaPitches>([])
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [pitcherOption, setPitcherOption] = React.useState('')
  const [pitchNumbers, setPitchNumbers] = React.useState<number[]>([])
  const [swingNumbers, setSwingNumbers] = React.useState<number[]>([])
  const [pitchCount, setPitchCount] = React.useState<number[]>([])

  const theme = createTheme({
    colorSchemes: {
      dark: true,
    },
  });

  React.useEffect(() => {
    const fetchPlayerData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('https://api.mlr.gg/legacy/api/players')
        setPlayers(response.data);
      } catch (err) {
        setError('Error Fetching Data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayerData();
  }, []); 

  React.useEffect(() => {
    if (players != null) {
      const pitchersList = []
      for (let i = 0; i < players.length; i++) {
        if(players[i].pitchType != "") {
          pitchersList.push(players[i])
        }
      }
      pitchersList.sort((a, b) => a.playerName.localeCompare(b.playerName));
      setPitchers(pitchersList)
    }
  }, [players])

  async function handleChangePitcher(event: SelectChangeEvent) {
    let player = players.find(player => player.playerID === Number(event.target.value))
    if (player) {
      setPitcherOption(player.playerName)
    }
    const pNumbers = []
    const sNumbers = []
    const pCount = []
    try {
      const response = await axios.get(
        `https://api.mlr.gg/legacy/api/plateappearances/pitching/fcb/${event.target.value}`,
      )
      for (let i = 0; i < response.data.length; i++) {
        pNumbers.push(response.data[i].pitch)
        sNumbers.push(response.data[i].swing)
        pCount.push(i+1)
      }
      setPitches(response.data);
      setPitchNumbers(pNumbers)
      setSwingNumbers(sNumbers)
      setPitchCount(pCount)
      
    } catch (err) {
      setError('Error Fetching Pitches');
    } finally {
      setIsLoading(false);
    }
    console.log(pitchCount)
  }

  

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!isLoading && !error &&
        <ThemeProvider theme={theme}>
          <Grid container justifyContent="center">
            <Grid size={12}>
              <FormControl sx={{ m: 1, minWidth: 120, color: "red"}}>
                <InputLabel id="demo-simple-select-helper-label">Pitcher</InputLabel>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  label="Pitcher"
                  onChange={handleChangePitcher}
                  color="warning"
                  value={pitcherOption}
                >
                  {
                    pitchers.map((pitcher) => {
                      return (
                        <MenuItem key={pitcher.playerID} value={pitcher.playerID}>
                          <em>{pitcher.playerName}</em>
                        </MenuItem>
                      )
                    })
                  }
                </Select>
                <FormHelperText>Select Pitcher</FormHelperText>
              </FormControl>
              <TableContainer component={Paper} style={{ maxHeight: document.documentElement.clientHeight * 0.6 }}>
                <Table stickyHeader sx={{ minWidth: document.documentElement.clientWidth * 0.80}} size="small" aria-label="a dense table" >
                  <TableHead>
                    <TableRow>
                        <TableCell width={50} align="center" >Pitch</TableCell>
                        <TableCell width={50} align="center" >Swing</TableCell>
                        <TableCell width={50} align="center" >Result</TableCell>
                        <TableCell width={50} align="center" >Inning</TableCell>
                        <TableCell width={50} align="center" >Outs</TableCell>
                        <TableCell width={50} align="center" style={{borderRightWidth: 1, borderRightColor: 'red',borderRightStyle: 'solid'}}>OBC</TableCell>
                        <TableCell width={50} align="center">M 1</TableCell>
                        <TableCell width={50} align="center">M 2</TableCell>
                        <TableCell width={50} align="center">M 3</TableCell>
                        <TableCell width={50} align="center">M 4</TableCell>
                        <TableCell width={50} align="center">M 5</TableCell>
                        <TableCell width={50} align="center">M 6</TableCell>
                        <TableCell width={50} align="center">M 7</TableCell>
                        <TableCell width={50} align="center">M 8</TableCell>
                        <TableCell width={50} align="center">M 9</TableCell>
                        <TableCell width={50} align="center">M 10</TableCell>
                        <TableCell width={50} align="center">M 11</TableCell>
                        <TableCell width={50} align="center">M 12</TableCell>
                        <TableCell width={50} align="center">M 13</TableCell>
                        <TableCell width={50} align="center">M 14</TableCell>
                        <TableCell width={50} align="center">M 15</TableCell>
                        <TableCell width={50} align="center">M 16</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pitches.map((pitch, i , array) => {
                        return <TableRow
                        key={pitch.playNumber}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell colSpan= {1} component="th" scope="row" align="center">
                              {pitch.pitch}
                          </TableCell>
                          <TableCell align="center">{pitch.swing}</TableCell>
                          <TableCell align="center">{pitch.exactResult}</TableCell>
                          <TableCell align="center">{pitch.inning}</TableCell>
                          <TableCell align="center">{pitch.outs}</TableCell>
                          <TableCell align="center" style={{borderRightWidth: 1, borderRightColor: 'red',borderRightStyle: 'solid'}}>{pitch.obc}</TableCell>
                          <TableCell colSpan= {1} component="th" scope="row" align="center">
                            {getModel1(pitch)}
                          </TableCell>
                          <TableCell align="center">{getModel2(pitch, array[i-1])}</TableCell>
                          <TableCell align="center">{getModel3(pitch, array[i-1])}</TableCell>
                          <TableCell align="center">{getModel4(pitch)}</TableCell>
                          <TableCell align="center">{getModel5(pitch, array[i-1])}</TableCell>
                          <TableCell align="center">{getModel6(pitch, array[i-1])}</TableCell>
                          <TableCell align="center">{getModel7(pitch)}</TableCell>
                          <TableCell align="center">{getModel8(pitch)}</TableCell>
                          <TableCell align="center">{getModel9(pitch, array[i-1])}</TableCell>
                          <TableCell align="center">{getModel10(pitch, array[i-1])}</TableCell>
                          <TableCell align="center">{getModel11(pitch, array[i-1])}</TableCell>
                          <TableCell align="center">{getModel12(pitch, array[i-1])}</TableCell>
                          <TableCell align="center">{getModel13(pitch)}</TableCell>
                          <TableCell align="center">{getModel14(pitch, array[i-1])}</TableCell>
                          <TableCell align="center">{getModel15(pitch)}</TableCell>
                          <TableCell align="center">{getModel16(pitch, array[i-1])}</TableCell>
                        </TableRow>
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
              <Grid size={12} alignItems="center" justifyContent="center">
                {pitchCount.length != 0 && pitchNumbers.length != 0 && swingNumbers.length != 0 &&
                  <LineChart
                    xAxis={[{ data: pitchCount }]}
                    series={[
                      {
                        label: "Pitch", data: pitchNumbers, color:"red"
                      },
                      {
                        label: "Swing", data: swingNumbers
                      },
                    ]}
                    width={document.documentElement.clientWidth * 0.80}
                    height={300}
                  />
                }
              </Grid>
            </Grid>

        </ThemeProvider>
      } 
    </>
  );
}