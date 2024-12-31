import './App.css'
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
import { FormSchemaPitch } from './types/schemas/pitch-schema';

export default function App() {
  const [players, setPlayers] = React.useState<FormSchemaPlayers>([])
  const [pitchers, setPitchers] = React.useState<FormSchemaPlayers>([])
  const [pitches, setPitches] = React.useState<FormSchemaPitches>([])
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [pitcherOption, setPitcherOption] = React.useState('')

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
      console.log(pitchersList)
      setPitchers(pitchersList)
    }
  }, [players])

  async function handleChangePitcher(event: SelectChangeEvent) {
    let player = players.find(player => player.playerID === Number(event.target.value))
    if (player) {
      setPitcherOption(player.playerName)
    }
    try {
      const response = await axios.get(
        `https://api.mlr.gg/legacy/api/plateappearances/pitching/fcb/${event.target.value}`,
      )
      setPitches(response.data);
    } catch (err) {
      setError('Error Fetching Pitches');
    } finally {
      setIsLoading(false);
    }
  }

  function getModel1(pitch: FormSchemaPitch) {
    if (pitch.swing > pitch.pitch) {
      return Math.round(pitch.swing - ((pitch.swing - pitch.pitch) / 2))
    } else {
      return Math.round(pitch.pitch - ((pitch.pitch - pitch.swing) / 2))
    }
  }

  function getModel2(pitch: FormSchemaPitch, previouspitch: FormSchemaPitch | null) {
    let diff = Math.abs(pitch.pitch - pitch.swing)
    let delta = Math.abs(pitch.pitch - (previouspitch?.pitch ?? 0))

    if (diff > delta) {
      return Math.round(diff - ((diff - delta) / 2))
    } else {
      return Math.round(delta - ((delta - diff) / 2))
    }
  }

  function getModel3(pitch: FormSchemaPitch, previouspitch: FormSchemaPitch | null) {
    let model1 = getModel1(pitch)
    let model2 = getModel2(pitch, previouspitch)

    let adjustment = Math.abs(model1 - model2) > 500 ? 500 : 0;
  
    // Apply the formula
    return Math.round(((model1 + model2) / 2 + adjustment) % 1000);
  }

  function getModel4(pitch: FormSchemaPitch) {
    let model1 = getModel1(pitch)
    
    if ((model1 + 500) > 1000) {
      return model1 - 500;
    } else {
      return model1 + 500;
    }
  }

  function getModel5(pitch: FormSchemaPitch, previouspitch: FormSchemaPitch | null) {
    let model2 = getModel2(pitch, previouspitch)
    
    if ((model2 + 500) > 1000) {
      return model2 - 500;
    } else {
      return model2 + 500;
    }
  }

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!isLoading && !error &&
        <ThemeProvider theme={theme}>
          <FormControl sx={{ m: 1, minWidth: 120, color: "red" }}>
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
            {pitches.length > 0 && 
              <Table stickyHeader sx={{ minWidth: document.documentElement.clientWidth * 0.75 }} size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                      <TableCell width={50} align="center">Pitch</TableCell>
                      <TableCell width={50} align="center">Swing</TableCell>
                      <TableCell width={50} align="center">Result</TableCell>
                      <TableCell width={50} align="center">Inning</TableCell>
                      <TableCell width={50} align="center">Outs</TableCell>
                      <TableCell width={50} align="center">OBC</TableCell>
                      <TableCell width={50} align="center">Model 1</TableCell>
                      <TableCell width={50} align="center">Model 2</TableCell>
                      <TableCell width={50} align="center">Model 3</TableCell>
                      <TableCell width={50} align="center">Model 4</TableCell>
                      <TableCell width={50} align="center">Model 5</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pitches.map((pitch, i, array) => {
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
                          <TableCell align="center">{pitch.obc}</TableCell>
                          <TableCell align="center">{getModel1(pitch)}</TableCell>
                          <TableCell align="center">{getModel2(pitch, array[i-1])}</TableCell>
                          <TableCell align="center">{getModel3(pitch, array[i-1])}</TableCell>
                          <TableCell align="center">{getModel4(pitch)}</TableCell>
                          <TableCell align="center">{getModel5(pitch, array[i-1])}</TableCell>
                      </TableRow>
                  })}
                </TableBody>
              </Table>
            }
          </TableContainer>
        </ThemeProvider>
      } 
    </>
  );
}