import * as React from 'react'
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';

import { FormSchemaPitches } from '../types/schemas/pitches-schema';
import { FormSchemaPlayers } from '../types/schemas/player-schema';
import { FormSchemaTeams } from '../types/schemas/team-schema';

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
import teamsJson  from '../utils/teams.json';

export default function MLRBatters() {
    const [players, setPlayers] = React.useState<FormSchemaPlayers>([])
    const [batters, setBatters] = React.useState<FormSchemaPlayers>([])
    const [pitches, setPitches] = React.useState<FormSchemaPitches>([])
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState('');
    const [batterOption, setBatterOption] = React.useState<number>(0)

    const [pitchNumbers, setPitchNumbers] = React.useState<number[]>([])
    const [swingNumbers, setSwingNumbers] = React.useState<number[]>([])
    const [pitchCount, setPitchCount] = React.useState<number[]>([])
    const [teams, setTeams] = React.useState<FormSchemaTeams>([])
    const [teamOption, setTeamOption] = React.useState('')
  const [seasons, setSeasons] = React.useState<number[]>([]);
  const [seasonOption, setSeasonOption] = React.useState<number>(0)
  const [originalPitches, setOriginalPitches] = React.useState<FormSchemaPitches>([])
    // const [gameOption, setGameOption] = React.useState(null);
  
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
    const teamsList = teamsJson;
      setTeams(teamsList);
  }, [teams])

  React.useEffect(() => {
    if (players != null) {
      const battersList = []
      for (let i = 0; i < players.length; i++) {
        if (players[i].priPos != 'P' && players[i].Team === teamOption) {
          battersList.push(players[i]);
        }
      }
      battersList.sort((a, b) => a.playerName.localeCompare(b.playerName));
      setBatters(battersList);
    }
  }, [teamOption])

  React.useEffect(() => {
    if (players != null) {
      const seasonPitches = originalPitches.filter(e => 
        e.season == seasonOption
      );
      setPitches(seasonPitches);

      const numberOfSessions = new Set<number>();
      const pNumbers = []
      const sNumbers = []
      const pCount = []
      const p1Numbers = []
      const p1Count = []
      const p2Numbers = []
      const p2Count = []
      const p3Numbers = []
      const p3Count = []
      let p1 = 1
      let p2 = 1
      let p3 = 1

      for (let i = 0; i < seasonPitches.length; i++) {
        numberOfSessions.add(seasonPitches[i].session);
        pNumbers.push(seasonPitches[i].pitch)
        sNumbers.push(seasonPitches[i].swing)
        pCount.push(i + 1)

        if (seasonPitches[i].inning !== (seasonPitches[i - 1]?.inning ?? '0')) {
          p1Numbers.push(seasonPitches[i].pitch)
          p1Count.push(p1)
          p1++
        }
        if (seasonPitches[i].inning === (seasonPitches[i - 1]?.inning ?? '0') && seasonPitches[i].inning !== (seasonPitches[i - 2]?.inning ?? '0')) {
          p2Numbers.push(seasonPitches[i].pitch)
          p2Count.push(p2)
          p2++
        }
        if (seasonPitches[i].inning === (seasonPitches[i - 1]?.inning ?? '0') && seasonPitches[i].inning === (seasonPitches[i - 2]?.inning ?? '0') && seasonPitches[i].inning !== (seasonPitches[i - 3]?.inning ?? '0')) {
          p3Numbers.push(seasonPitches[i].pitch)
          p3Count.push(p3)
          p3++
        }
      }

      setPitchNumbers(pNumbers)
      setSwingNumbers(sNumbers)
      setPitchCount(pCount)
    }
  }, [originalPitches, players, seasonOption])

    async function handleChangeTeam(event: SelectChangeEvent) {
      const team = teams.find(team => team.teamID === event.target.value)
      if (team) {
        setTeamOption(team.teamID)
        setBatterOption(0);
        setSeasons([]);
        setSeasonOption(0);
        // reset dashboard
      }
    }
  
    async function handleChangeBatter(event: SelectChangeEvent) {
      const player = players.find(player => player.playerID === Number(event.target.value))
      if (player) {
        setBatterOption(player.playerID)
      }


      const seasons = new Set<number>();

      try {
        const response = await axios.get(
          `https://api.mlr.gg/legacy/api/plateappearances/batting/mlr/${event.target.value}`,
        )
        for (let i = 0; i < response.data.length; i++) {

          seasons.add(response.data[i].season);
        }
        setPitches(response.data);
        setOriginalPitches(response.data);

        setSeasons([...seasons].sort((a,b) => a-b))
        setSeasonOption(Number([...seasons].slice(-1))) // last season
      } catch (err) {
        setError('Error Fetching Swings');
      } finally {
        setIsLoading(false);
      }
    }
  
  async function handleChangeSeason(event: SelectChangeEvent) {
    const season = Number(event.target.value);
    setSeasonOption(season)

  }


  
    return (
      <>
        {isLoading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {!isLoading && !error &&
          <ThemeProvider theme={theme}>
            <Grid container justifyContent="center" >
              <Grid size={12}>
                <FormControl sx={{ m: 1, minWidth: 240, color: "red" }}>
                  <InputLabel id="team-input-select-label">Team</InputLabel>
                  <Select
                    labelId="team-input-select-label"
                    id="team-input-select"
                    label={teamOption}
                    onChange={handleChangeTeam}
                    value={teamOption}
                  >
                    {
                      teams.map((team) => {
                        return (
                          <MenuItem key={team.teamID} value={team.teamID}>
                            <em>{team.teamName}</em>
                          </MenuItem>
                        )
                      })
                    }
                  </Select>
                  <FormHelperText>{teamOption ? '' : 'Select Team'}</FormHelperText>
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 240, color: "blue"}}>
                  <InputLabel id="batter-input-select-label">Batter</InputLabel>
                  <Select
                    labelId="batter-input-select-label"
                    id="batter-input-select"
                    onChange={handleChangeBatter}
                    value={batterOption ? batterOption.toString() : ''}
                  >
                    {
                      batters.map((batter) => {
                        return (
                          <MenuItem key={batter.playerID} value={(batter === undefined || batter === null || batters.length === 0) ? '' : batter.playerID}>
                            <em>{batter.playerName}</em>
                          </MenuItem>
                        )
                      })
                    }
                  </Select>
                  <FormHelperText>{batterOption ? '' : 'Select Batter'}</FormHelperText>
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 240, color: "blue" }}>
                  <InputLabel id="season-input-select-label">Season</InputLabel>
                  <Select
                    labelId="season-input-select-label"
                    id="season-input-select"
                    label={seasonOption}
                    onChange={handleChangeSeason}
                    value={seasonOption ? seasonOption.toString() : ''}
                  >
                    {
                      seasons.map((season) => {
                        return (
                          <MenuItem key={season} value={(season === undefined || season === null || seasons.length === 0) ? '' : season}>
                            <em>{season}</em>
                          </MenuItem>
                        )
                      })
                    }
                  </Select>
                  <FormHelperText>{seasonOption ? '' : 'Select Season'}</FormHelperText>
                </FormControl>
                <TableContainer component={Paper} style={{ maxHeight: document.documentElement.clientHeight * 0.3 }}>
                  <Table stickyHeader sx={{ minWidth: document.documentElement.clientWidth * 0.80 }} size="small" aria-label="a dense table" >
                    <TableHead>
                      <TableRow>
                          <TableCell width={50} align="center">Pitch</TableCell>
                          <TableCell width={50} align="center">Swing</TableCell>
                          <TableCell width={50} align="center">Result</TableCell>
                          <TableCell width={50} align="center">Inning</TableCell>
                          <TableCell width={50} align="center">Outs</TableCell>
                          <TableCell width={50} align="center">OBC</TableCell>
                        <TableCell width={50} align="center" style={{ borderRightWidth: 1, borderRightColor: 'lightgrey', borderRightStyle: 'solid' }}>Session</TableCell>
                        <TableCell width={50} align="center">Diff</TableCell>
                        <TableCell width={50} align="center">Result</TableCell>
                        <TableCell width={50} align="center">Next</TableCell>
                        <TableCell width={50} align="center">Delta</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pitches.map((pitch) => {
                          return <TableRow
                          key={pitch.paID}
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
                            <TableCell align="center" style={{ borderRightWidth: 1, borderRightColor: 'lightgrey', borderRightStyle: 'solid' }}>{pitch.session}</TableCell>
                            <TableCell align="center">{pitch.diff}</TableCell>
                            <TableCell align="center"></TableCell>
                            <TableCell align="center"></TableCell>
                            <TableCell align="center"></TableCell>
                          </TableRow>
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid container justifyContent="center">
                <Grid size={9} alignItems="center" justifyContent="center">
                  {pitchCount.length != 0 && pitchNumbers.length != 0 && swingNumbers.length != 0 &&
                    <LineChart
                      title="All Pitches"
                      xAxis={[{ data: pitchCount }]}
                      series={[
                        {
                          label: "Pitch", data: pitchNumbers, color:"red"
                        },
                        {
                          label: "Swing", data: swingNumbers
                        },
                      ]}
                      width={document.documentElement.clientWidth * 0.50}
                      height={300}
                    />
                  }
                </Grid>
              </Grid>
            </Grid>
          </ThemeProvider>
        } 
      </>
    );
}