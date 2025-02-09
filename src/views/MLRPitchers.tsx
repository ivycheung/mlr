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
import { getNextPitch, getDelta } from '../utils/utils';
import { FormSchemaPitchInInning } from '../types/schemas/pitch-in-inning-schema';
import { FormSchemaTeams } from '../types/schemas/team-schema';
import teamsJson from '../utils/teams.json';
import { calculateCircleDelta } from '../utils/utils';
import { ChartsReferenceLine } from '@mui/x-charts/ChartsReferenceLine';
// import { BarChart } from '@mui/x-charts';
// import Slider from '@mui/material/Slider';

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
  // const [innings, setInnings] = React.useState<number[]>([])
  const [deltaNumbers, setDeltaNumbers] = React.useState<number[]>([])

  const [teams, setTeams] = React.useState<FormSchemaTeams>([])
  const [teamOption, setTeamOption] = React.useState('')
  const [seasons, setSeasons] = React.useState<number[]>([]);
  const [seasonOption, setSeasonOption] = React.useState<number>(0)
  const [originalPitches, setOriginalPitches] = React.useState<FormSchemaPitches>([])
  const [sessions, setSessions] = React.useState<number[]>([]);
  const [sessionOption, setSessionOption] = React.useState<number>(0)

  // const histogramRange = [1, 51, 101, 151, 201, 251, 301, 351, 401, 451, 501, 551, 601, 651, 701, 751, 801, 851, 901, 951, 1000];
  // type HistogramType = { bucket: string, count: number};
  // const [histogramValue, setHistogramValue] = React.useState<HistogramType[]>();

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
      originalPitches.map((e) => {
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
      // numberOfSessions.add(-1);
      setSessions([...numberOfSessions].sort((a, b) => {return a - b}))

      // filter the pitches based on season + session
      // const seasonPitches = filterPitchesBySeasonSession(seasonOption, sessionOption)
      let filteredPitches = []
      if (sessionOption != -1) {
        filteredPitches = originalPitches.filter(e => {
          if (e.season == seasonOption) {
            if (e.session != sessionOption) {
              return false;
            }
            return true;
          }
        });
      }
      else {
        filteredPitches = originalPitches;
      }


      // filteredPitches.sort((a,b) => a.playNumber - b.playNumber);

      setPitches(filteredPitches)
      const seasonPitches = filteredPitches

      const pNumbers = []
      const sNumbers = []
      const dNumbers = []
      const pCount = []
      const p1Numbers = [] // first pitch
      const p1Count = [] // # of first pitch
      const p2Numbers = [] // second pitch
      const p2Count = [] // # of second pitch
      const p3Numbers = [] // third pitch
      const p3Count = [] // # of third pitch
      const inningPitches = []
      let currentChunk: number[] = []
      let p1 = 1
      let p2 = 1
      let p3 = 1
      let inningObject: { inning: number, pitches: number[] }[] = [];
      const innings = []


      for (let i = 0; i < seasonPitches.length; i++) {
        pNumbers.push(seasonPitches[i].pitch)
        sNumbers.push(seasonPitches[i].swing)
        pCount.push(i + 1)
        dNumbers.push(calculateCircleDelta(filteredPitches[i], filteredPitches[i - 1]))

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

      // Histogram
      // const bucketSize = 50;
      // console.log(pitches)
      // const bins: number[] = calculateHistogram(pitches, bucketSize);

      // const chartData = bins.map((count, index) => ({
      //   bucket: `${index * bucketSize + 1}-${(index + 1) * bucketSize}`,
      //   count
      // }));
      // console.log(chartData)
      // setHistogramValue(chartData);

      setPitchNumbers(pNumbers)
      setSwingNumbers(sNumbers)
      setPitchCount(pCount)
      setDeltaNumbers(dNumbers)
      setPitch1Numbers(p1Numbers)
      setPitch1Count(p1Count)
      setPitch2Numbers(p2Numbers)
      setPitch3Numbers(p3Numbers)
      // setInnings(innings)
      setInningNumbers(inningObject)

      // setPitches(seasonPitches)

    }
  }, [originalPitches, players, seasonOption, sessionOption])

  // Sessions
  // React.useEffect(() => {
  //   if (players != null) {
  //     const pitchersList = []
  //     for (let i = 0; i < players.length; i++) {
  //       if (players[i].Team === teamOption && (players[i].priPos == 'P' || players[i].priPos == 'PH') )
  //         pitchersList.push(players[i])
  //     }
  //     pitchersList.sort((a, b) => a.playerName.localeCompare(b.playerName));
  //     setPitchers(pitchersList)
  //   }
  // }, [sessions]);

  const colors: { [key: number]: string } = {
    1: 'red',
    2: 'orange',
    3: '#8B8000',
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
      setSessionOption(0);


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
          <Grid container justifyContent="center" style={{ padding: 30 }}>
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
                      <TableCell width={50} align="center" style={{ borderRightWidth: 1, borderRightColor: 'lightgrey', borderRightStyle: 'solid' }}>Session</TableCell>
                      <TableCell width={50} align="center">Diff</TableCell>
                      <TableCell width={50} align="center">Result</TableCell>
                      <TableCell width={50} align="center">Next</TableCell>
                      <TableCell width={50} align="center">Delta</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pitches.map((pitch, i, array) => {
                      return <TableRow
                        key={pitch.paID}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        // style={{ backgroundColor: colors[(pitch.inning).toString().slice(-1)]}}
                      >
                        <TableCell colSpan={1} component="th" scope="row" align="center">{pitch.pitch}</TableCell>
                        <TableCell align="center">{pitch.swing}</TableCell>
                        <TableCell align="center">{pitch.exactResult}</TableCell>
                        <TableCell align="center">{pitch.inning}</TableCell>
                        <TableCell align="center">{pitch.outs}</TableCell>
                        <TableCell align="center">{pitch.obc}</TableCell>
                        <TableCell align="center" style={{ borderRightWidth: 1, borderRightColor: 'lightgrey', borderRightStyle: 'solid' }}>{pitch.session}</TableCell>
                        <TableCell align="center">{pitch.diff}</TableCell>
                        <TableCell align="center"></TableCell>
                        <TableCell align="center">{getNextPitch(array, i)}</TableCell>
                        <TableCell align="center">{getDelta(array, i) }</TableCell>
                      </TableRow>
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid container justifyContent="center">
              <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }} alignItems="center" justifyContent="center">
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
                    width={document.documentElement.clientWidth * 0.50}
                    height={document.documentElement.clientHeight * 0.50}
                  />
                }
              </Grid>
              <Grid size={6} alignItems="center" justifyContent="center" >
                {pitchCount.length != 0 && pitchNumbers.length != 0 && swingNumbers.length != 0 &&
                  <LineChart
                    title="Pitches by Placement in Inning"
                  xAxis={[{ label: "Inning", data: pitch1Count, tickInterval: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }]}
                    series={[
                      {
                        label: "First Pitches", data: pitch1Numbers, color: "red"
                      },
                      {
                        label: "Second Pitches", data: pitch2Numbers, color: "green"
                      },
                      {
                        label: "Third Pitches", data: pitch3Numbers, color: "magenta"
                      },
                    ]}
                    width={document.documentElement.clientWidth * 0.40}
                    height={document.documentElement.clientHeight * 0.50}
                  />
                }
              </Grid>
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }} alignItems="center" justifyContent="center" width='100%'>
              {deltaNumbers.length != 0 &&
                <LineChart
                  title="Delta from Pitch to Pitch"
                  xAxis={[{ data: pitchCount }]}
                  yAxis={[{
                    min: -500,   // Set the minimum value for Y-Axis
                    max: 500,    // Set the maximum value for Y-Axis
                    tickInterval: [-500, -400, -300, -200, -100, 0, 100, 200, 300, 400, 500], // Set custom tick values
                  },]}
                  series={[
                    {
                      label: "Delta", data: deltaNumbers, color: "teal"
                    },
                  ]}
                  height={document.documentElement.clientHeight * 0.50}
                  tooltip={{ trigger: 'item' }}
                >
                  <ChartsReferenceLine y={0} label="0" labelAlign="end" />
                </LineChart>
              }
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }} container justifyContent="center" >
              <Grid alignItems="center" justifyContent="center" width='100%'>
                {pitchCount.length != 0 && pitchNumbers.length != 0 && swingNumbers.length != 0 && inningNumbers.length != 0 &&
                  <LineChart
                    title="Pitches by Inning"
                    xAxis={[{ data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], label: "Pitch Number", tickNumber: 15, tickInterval: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], scaleType: 'point', min: 1, max: 10 }
                    ]}
                    series={inningNumbers.map((series) => ({
                      data: series.pitches,
                      label: `In ${series.inning.toString()}`,
                      color: colors[series.inning]
                    }))}
                    height={document.documentElement.clientHeight * 0.50}
                    width={document.documentElement.clientWidth * 0.40}
                    margin={{ top: 100 }}
                  />
                }
              </Grid>
            </Grid>
            {/* <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }} container justifyContent="center" >
              <Grid alignItems="center" justifyContent="center" width='100%'>
                <BarChart 
                dataset = {histogramValue}
                  series={[{ dataKey: 'count' }]}
                  xAxis={[{ dataKey: 'bucket', scaleType: 'band', }]}
                  />
                  
              </Grid> */}
            {/* </Grid> */}
          </Grid>

        </ThemeProvider>
      }
    </>
  );
}