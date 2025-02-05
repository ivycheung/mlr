import * as React from 'react'
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import { FormSchemaPitches } from '../types/schemas/pitches-schema';
import { FormSchemaPlayers } from '../types/schemas/player-schema';
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
import { getModel1, getModel2, getModel3, getModel4, getModel5, getModel6, getModel7, getModel8, getModel9, getModel10, getModel11, getModel12, getModel13, getModel14, getModel15, getModel16 } from '../utils/utils';
import { FormSchemaPitchInInning } from '../types/schemas/pitch-in-inning-schema';
import { FormSchemaTeams } from '../types/schemas/team-schema';
import teamsJson from '../utils/teams.json';

export default function MLRPitchers() {
  const [players, setPlayers] = React.useState<FormSchemaPlayers>([])
  const [pitchers, setPitchers] = React.useState<FormSchemaPlayers>([])
  const [pitches, setPitches] = React.useState<FormSchemaPitches>([])
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [pitcherOption, setPitcherOption] = React.useState<number>(0)
  const [pitchNumbers, setPitchNumbers] = React.useState<number[]>([])
  const [swingNumbers, setSwingNumbers] = React.useState<number[]>([])
  const [pitchCount, setPitchCount] = React.useState<number[]>([])
  const [pitch1Numbers, setPitch1Numbers] = React.useState<number[]>([])
  const [pitch1Count, setPitch1Count] = React.useState<number[]>([])
  const [pitch2Numbers, setPitch2Numbers] = React.useState<number[]>([])
  const [pitch3Numbers, setPitch3Numbers] = React.useState<number[]>([])
  const [inningNumbers, setInningNumbers] = React.useState<FormSchemaPitchInInning>([])
  const [innings, setInnings] = React.useState<number[]>([])

  const [teams, setTeams] = React.useState<FormSchemaTeams>([])
  const [teamOption, setTeamOption] = React.useState('')
  const [seasons, setSeasons] = React.useState<number[]>([]);
  const [seasonOption, setSeasonOption] = React.useState<number>(0)
  const [originalPitches, setOriginalPitches] = React.useState<FormSchemaPitches>([])
  const [sessions, setSessions] = React.useState<number[]>([]);
  const [sessionOption, setSessionOption] = React.useState<number>(0)

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

  // Teams
  React.useEffect(() => {
    const teamsList = teamsJson;
    setTeams(teamsList);
  }, [teams])

  // Players
  React.useEffect(() => {
    if (players != null) {
      const pitchersList = []
      for (let i = 0; i < players.length; i++) {
        if (players[i].priPos == 'P' && players[i].Team === teamOption)
          pitchersList.push(players[i])
      }
      pitchersList.sort((a, b) => a.playerName.localeCompare(b.playerName));
      setPitchers(pitchersList)
    }
  }, [teamOption]);

  // Seasons
  React.useEffect(() => {
    if (players != null) {
      // Loop through to get the sessions per season
      const numberOfSessions = new Set<number>();
      originalPitches.map((e)=> {
        if (e.season == seasonOption) {
          numberOfSessions.add(e.session);
        }
      })
      
      // Set default session to first of the game
      // TODO: show all sessions in a season
      if (sessionOption == 0 || sessionOption == undefined) {
        const latestSession: number = [...numberOfSessions][0];
        setSessionOption(latestSession);//latest season but first session
      }
      setSessions([...numberOfSessions])

      // filter the pitches based on season + session
      // const seasonPitches = filterPitchesBySeasonSession(seasonOption, sessionOption)
      const filteredPitches = originalPitches.filter(e => {
        if (e.season == seasonOption) {
          if (e.session != sessionOption) {
            return false;
          }
          return true;
        }
      }

      );
      setPitches(filteredPitches)
      const seasonPitches = originalPitches

      const pNumbers = []
      const sNumbers = []
      const pCount = []
      const p1Numbers = []
      const p1Count = []
      const p2Numbers = []
      const p2Count = []
      const p3Numbers = []
      const p3Count = []
      let inningPitches = []
      let currentChunk = []
      let p1 = 1
      let p2 = 1
      let p3 = 1
      let inningObject: { inning: number, pitches: number[] }[] = [];
      let innings = []
      

      for (let i = 0; i < seasonPitches.length; i++) {
        

        // if (seasonPitches[i].session !== sessionOption) {
        //   continue;
        // }
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
        if (currentChunk.length === 0 || seasonPitches[i - 1].inning === seasonPitches[i].inning) {
          currentChunk.push(seasonPitches[i].pitch);
        } else {
          inningPitches.push(currentChunk);
          currentChunk = [seasonPitches[i].pitch];
        }
      }

      if (currentChunk.length > 0) {
        inningPitches.push(currentChunk);
      }

      for (let i = 0; i < inningPitches.length; i++) {
        inningObject.push({ inning: i + 1, pitches: inningPitches[i] })
        innings.push(i + 1)
      }


      setPitchNumbers(pNumbers)
      setSwingNumbers(sNumbers)
      setPitchCount(pCount)
      setPitch1Numbers(p1Numbers)
      setPitch1Count(p1Count)
      setPitch2Numbers(p2Numbers)
      setPitch3Numbers(p3Numbers)
      setInnings(innings)
      setInningNumbers(inningObject)
      
      // setPitches(seasonPitches)

    }
  }, [originalPitches, players, seasonOption, sessionOption])

  // Sessions
  React.useEffect(() => {
    if (players != null) {
      const pitchersList = []
      for (let i = 0; i < players.length; i++) {
        if (players[i].priPos == 'P' && players[i].Team === teamOption)
          pitchersList.push(players[i])
      }
      pitchersList.sort((a, b) => a.playerName.localeCompare(b.playerName));
      setPitchers(pitchersList)
    }
  }, [sessions]);

  const colors: { [key: number]: string } = {
    1: 'red',
    2: 'orange',
    3: 'yellow',
    4: 'green',
    5: 'blue',
    6: 'indigo',
    7: 'violet',
    8: 'gray',
    9: 'white',
    10: 'crimson',
    11: 'coral',
    12: 'khaki',
    13: 'mediumseagreen',
    14: 'aqua',
    15: 'mediumslateblue',
  };

  async function handleChangeTeam(event: SelectChangeEvent) {
    const team = teams.find(team => team.teamID === event.target.value)
    if (team) {
      setTeamOption(team.teamID);
      setPitcherOption(0);
      setSeasons([]);
      setSeasonOption(0);
      setSessionOption(0);
      // reset dashboard
    }
  }

  async function handleChangeSeason(event: SelectChangeEvent) {
    const season = Number(event.target.value);
    setSeasonOption(season)
    setSessionOption(0);
  }

  async function handleChangeSession(event: SelectChangeEvent) {
    const session = Number(event.target.value);
    setSessionOption(session);
  }


  async function handleChangePitcher(event: SelectChangeEvent) {
    setPitches([])
    const player = players.find(player => player.playerID === Number(event.target.value))
    if (player) {
      setPitcherOption(player.playerID)
    }

    const seasons = new Set<number>();

    try {
      const response = await axios.get(
        `https://api.mlr.gg/legacy/api/plateappearances/pitching/mlr/${event.target.value}`,
      )
      


      for (let i = 0; i < response.data.length; i++) {
        seasons.add(response.data[i].season)
      }

      setSeasons([...seasons].reverse())
      const latestSeason = Number([...seasons].slice(-1));
      setSeasonOption(latestSeason) // latest season

      setOriginalPitches(response.data)
      


    } catch (err) {
      setError('Error Fetching Pitches');
    } finally {
      setIsLoading(false);
    }
  }



  return (
    <>
      {isLoading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!isLoading && !error &&
        <ThemeProvider theme={theme}>
          <Grid container justifyContent="center" style={{ padding: 100 }}>
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
              <FormControl sx={{ m: 1, minWidth: 240, color: "blue" }}>
                <InputLabel id="pitcher-input-select-label">Pitcher</InputLabel>
                <Select
                  labelId="pitcher-input-select-label"
                  id="pitcher-input-select"
                  onChange={handleChangePitcher}
                  value={pitcherOption ? pitcherOption.toString() : ''}
                >
                  {
                    pitchers.map((pitcher) => {
                      return (
                        <MenuItem key={pitcher.playerID} value={(pitcher === undefined || pitcher === null || pitchers.length === 0) ? '' : pitcher.playerID}>
                          <em>{pitcher.playerName}</em>
                        </MenuItem>
                      )
                    })
                  }
                </Select>
                <FormHelperText>{pitcherOption ? '' : 'Select Pitcher'}</FormHelperText>
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
              <FormControl sx={{ m: 1, minWidth: 240, color: "blue" }}>
                <InputLabel id="season-input-select-label">Session</InputLabel>
                <Select
                  labelId="season-input-select-label"
                  id="season-input-select"
                  label={sessionOption}
                  onChange={handleChangeSession}
                  value={sessionOption ? sessionOption.toString() : ''}
                >
                  {
                    sessions.map((session) => {
                      return (
                        <MenuItem key={session} value={(session === undefined || session === null || sessions.length === 0) ? '' : session}>
                          <em>{session}</em>
                        </MenuItem>
                      )
                    })
                  }
                </Select>
                {/* <FormHelperText>{sessionOption ? '' : 'Select Session'}</FormHelperText> */}
              </FormControl>
              <TableContainer component={Paper} style={{ maxHeight: document.documentElement.clientHeight * 0.4 }}>
                <Table stickyHeader sx={{ minWidth: document.documentElement.clientWidth * 0.80 }} size="small" aria-label="a dense table" >
                  <TableHead>
                    <TableRow>
                      <TableCell width={50} align="center" >Pitch</TableCell>
                      <TableCell width={50} align="center" >Swing</TableCell>
                      <TableCell width={50} align="center" >Result</TableCell>
                      <TableCell width={50} align="center" >Inning</TableCell>
                      <TableCell width={50} align="center" >Outs</TableCell>
                      <TableCell width={50} align="center">OBC</TableCell>
                      <TableCell width={50} align="center">Season</TableCell>
                      <TableCell width={50} align="center" style={{ borderRightWidth: 1, borderRightColor: 'lightgrey', borderRightStyle: 'solid' }}>Session</TableCell>
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
                    {pitches.map((pitch, i, array) => {
                      return <TableRow
                        key={pitch.paID}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell colSpan={1} component="th" scope="row" align="center">
                          {pitch.pitch}
                        </TableCell>
                        <TableCell align="center">{pitch.swing}</TableCell>
                        <TableCell align="center">{pitch.exactResult}</TableCell>
                        <TableCell align="center">{pitch.inning}</TableCell>
                        <TableCell align="center">{pitch.outs}</TableCell>
                        <TableCell align="center">{pitch.obc}</TableCell>
                        <TableCell align="center">{pitch.season}</TableCell>
                        <TableCell align="center" style={{ borderRightWidth: 1, borderRightColor: 'lightgrey', borderRightStyle: 'solid' }}>{pitch.session}</TableCell>
                        <TableCell colSpan={1} component="th" scope="row" align="center">
                          {getModel1(pitch)}
                        </TableCell>
                        <TableCell align="center">{getModel2(pitch, array[i - 1])}</TableCell>
                        <TableCell align="center">{getModel3(pitch, array[i - 1])}</TableCell>
                        <TableCell align="center">{getModel4(pitch)}</TableCell>
                        <TableCell align="center">{getModel5(pitch, array[i - 1])}</TableCell>
                        <TableCell align="center">{getModel6(pitch, array[i - 1])}</TableCell>
                        <TableCell align="center">{getModel7(pitch)}</TableCell>
                        <TableCell align="center">{getModel8(pitch)}</TableCell>
                        <TableCell align="center">{getModel9(pitch, array[i - 1])}</TableCell>
                        <TableCell align="center">{getModel10(pitch, array[i - 1])}</TableCell>
                        <TableCell align="center">{getModel11(pitch, array[i - 1])}</TableCell>
                        <TableCell align="center">{getModel12(pitch, array[i - 1])}</TableCell>
                        <TableCell align="center">{getModel13(pitch)}</TableCell>
                        <TableCell align="center">{getModel14(pitch, array[i - 1])}</TableCell>
                        <TableCell align="center">{getModel15(pitch)}</TableCell>
                        <TableCell align="center">{getModel16(pitch, array[i - 1])}</TableCell>
                      </TableRow>
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            {/* <Grid container justifyContent="center">
              <Grid size={6} alignItems="center" justifyContent="center">
                {pitchCount.length != 0 && pitchNumbers.length != 0 && swingNumbers.length != 0 &&
                  <LineChart
                    title="All Pitches"
                    xAxis={[{ data: pitchCount }]}
                    series={[
                      {
                        label: "Pitch", data: pitchNumbers, color: "red"
                      },
                      {
                        label: "Swing", data: swingNumbers
                      },
                    ]}
                    // width={document.documentElement.clientWidth * 0.50}
                    height={document.documentElement.clientHeight * 0.40}
                  />
                }
              </Grid>
              <Grid size={6} alignItems="center" justifyContent="center" >
                  {pitchCount.length != 0 && pitchNumbers.length != 0 && swingNumbers.length != 0 &&
                    <LineChart
                      title="Pitches by Placement in Inning"
                      xAxis={[{ label: "Inning", data: pitch1Count }]}
                      series={[
                        {
                          label: "First Pitches", data: pitch1Numbers, color:"red"
                        },
                        {
                          label: "Second Pitches", data: pitch2Numbers, color:"green"
                        },
                        {
                          label: "Third Pitches", data: pitch3Numbers, color:"white"
                        },
                      ]}
                      width={document.documentElement.clientWidth * 0.40}
                      height={document.documentElement.clientHeight * 0.40}
                    />
                  }
              </Grid>
            </Grid> */}
            {/* <Grid container justifyContent="center" >
                <Grid size={12} alignItems="center" justifyContent="center">
                  {pitchCount.length != 0 && pitchNumbers.length != 0 && swingNumbers.length != 0 && inningNumbers.length != 0 &&
                    <LineChart
                      title="Pitches by Inning"
                      xAxis={[{ data: innings, label: "Pitch Number", tickInterval: [1,2,3,4,5,6,7,8,9,10] }]}
                      series={inningNumbers.map((series) =>({
                        data: series.pitches,
                        label: `Inning ${series.inning.toString()}`,
                        color: colors[series.inning]
                      }))}
                      width={document.documentElement.clientWidth * 0.90}
                      height={document.documentElement.clientHeight * 0.50}
                    />
                  }
                </Grid>
              </Grid> */}
          </Grid>

        </ThemeProvider>
      }
    </>
  );
}