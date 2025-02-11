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
import teamsJson from '../utils/milrteams.json';
import PitchSwingChart from '../components/PitchSwingChart';
import SessionDataTable from '../components/SessionDataTable';

export default function MILRBatters() {
  const [players, setPlayers] = React.useState<FormSchemaPlayers>([])
  const [batters, setBatters] = React.useState<FormSchemaPlayers>([])
  const [combinedPitches, setCombinedPitches] = React.useState<FormSchemaPitches>([])
  const [mlrpitches, setMlrPitches] = React.useState<FormSchemaPitches>([])
  const [milrpitches, setMilrPitches] = React.useState<FormSchemaPitches>([])
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [batterOption, setBatterOption] = React.useState<number>(0)

  const [pitchNumbers, setPitchNumbers] = React.useState<number[]>([])
  const [swingNumbers, setSwingNumbers] = React.useState<number[]>([])
  const [pitchCount, setPitchCount] = React.useState<number[]>([])
  const [teams, setTeams] = React.useState<FormSchemaTeams>([])
  const [teamOption, setTeamOption] = React.useState('')
  const [mlrSeasons, setMlrSeasons] = React.useState<number[]>([]);
  const [mlrSeasonOption, setMlrSeasonOption] = React.useState<number>(0)
  const [milrSeasons, setMilrSeasons] = React.useState<number[]>([]);
  const [milrSeasonOption, setMilrSeasonOption] = React.useState<number>(0)
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
        if (players[i].priPos != 'P' && players[i].milr_team === teamOption) {
          battersList.push(players[i]);
        }
      }
      battersList.sort((a, b) => a.playerName.localeCompare(b.playerName));
      setBatters(battersList);
    }
  }, [teamOption])

  // Season
  React.useEffect(() => {
    if (players != null) {
      let filteredPitches: FormSchemaPitches = []
      if (mlrSeasonOption != 0 && milrSeasonOption == 0) {
        filteredPitches = mlrpitches.filter(e => {
          if (e.season == mlrSeasonOption) {
            return true;
          }
        });
      }
      else if (mlrSeasonOption == 0 && milrSeasonOption != 0) {
        filteredPitches = milrpitches.filter(e => {
          if (e.season == milrSeasonOption) {
            return true;
          }
        });
      }

      setCombinedPitches(filteredPitches);
    }
  }, [players, batterOption, mlrSeasonOption, milrSeasonOption])

  async function handleChangeTeam(event: SelectChangeEvent) {
    const team = teams.find(team => team.teamID === event.target.value)
    if (team) {
      setTeamOption(team.teamID)
      setBatterOption(0);
      setMlrSeasons([]);
      setMlrSeasonOption(0);
      setMilrSeasons([]);
      setMilrSeasonOption(0);
      // reset dashboard
    }
  }

  async function handleChangeBatter(event: SelectChangeEvent) {
    const player = players.find(player => player.playerID === Number(event.target.value))
    if (player) {
      setBatterOption(player.playerID)
    }

    const league = ['mlr', 'milr'];
    const seasons = new Set<number>();

    try {
      league.map(async (league) => {
        const response = await axios.get(
          `https://api.mlr.gg/legacy/api/plateappearances/batting/${league}/${event.target.value}`,
        )
        if (league == 'mlr') {
          for (let i = 0; i < response.data.length; i++) {
            seasons.add(response.data[i].season);
          }
          setMlrPitches(response.data);
          // setOriginalPitches(response.data);

          setMlrSeasons([...seasons].sort((a, b) => a - b))
          setMlrSeasonOption(0)
        }
        else if (league == 'milr') {
          for (let i = 0; i < response.data.length; i++) {
            seasons.add(response.data[i].season);
          }
          setMilrPitches(response.data);
          // setOriginalPitches(response.data);

          setMilrSeasons([...seasons].sort((a, b) => a - b))
          setMilrSeasonOption(Number([...seasons].slice(-1))) // last season
        }
      })


    } catch (err) {
      setError('Error Fetching Swings');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleMlrChangeSeason(event: SelectChangeEvent) {
    const season = Number(event.target.value);
    setMlrSeasonOption(season)
    setMilrSeasonOption(0)
  }

  async function handleMilrChangeSeason(event: SelectChangeEvent) {
    const season = Number(event.target.value);
    setMilrSeasonOption(season)
    setMlrSeasonOption(0)
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
              <FormControl sx={{ m: 1, minWidth: 240, color: "blue" }}>
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
                <InputLabel id="mlrseason-input-select-label" sx={{ color: "grey.400", }}>MLR Season</InputLabel>
                <Select
                  labelId="mlrseason-input-select-label"
                  id="mlrseason-input-select"
                  label={mlrSeasonOption}
                  onChange={handleMlrChangeSeason}
                  value={mlrSeasonOption ? mlrSeasonOption.toString() : ''
                  }
                >
                  {
                    mlrSeasons.map((season) => {
                      return (
                        <MenuItem key={season} value={(season === undefined || season === null || mlrSeasons.length === 0) ? '' : season}>
                          <em>{season}</em>
                        </MenuItem>
                      )
                    })
                  }
                </Select>
                <FormHelperText>{mlrSeasonOption ? '' : 'Select MLR Season'}</FormHelperText>
              </FormControl>
              <FormControl sx={{ m: 1, minWidth: 240, color: "blue" }}>
                <InputLabel id="milrseason-input-select-label" sx={{ color: "red[500]", }}>MiLR Season</InputLabel>
                <Select
                  labelId="milrseason-input-select-label"
                  id="milrseason-input-select"
                  label={milrSeasonOption}
                  onChange={handleMilrChangeSeason}
                  value={milrSeasonOption ? milrSeasonOption.toString() : ''}
                >
                  {
                    milrSeasons.map((season) => {
                      return (
                        <MenuItem key={season} value={(season === undefined || season === null || milrSeasons.length === 0) ? '' : season}>
                          <em>{season}</em>
                        </MenuItem>
                      )
                    })
                  }
                </Select>
                <FormHelperText>{milrSeasonOption ? '' : 'Select MiLR Season'}</FormHelperText>
              </FormControl>
              <SessionDataTable pitches={combinedPitches} />
            </Grid>
            <Grid container justifyContent="center">
              <Grid size={9} alignItems="center" justifyContent="center">
                <PitchSwingChart pitches={combinedPitches} />
              </Grid>
            </Grid>
          </Grid>
        </ThemeProvider>
      }
    </>
  );
}