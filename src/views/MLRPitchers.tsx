import * as React from 'react'

import { FormSchemaPitches } from '../types/schemas/pitches-schema';
import { FormSchemaPlayers } from '../types/schemas/player-schema';
import { FormSchemaTeams } from '../types/schemas/team-schema';
import teamsJson from '../utils/mlrteams.json';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';

import PitchSwingChart from '../components/PitchSwingChart';
import SessionDataTable from '../components/SessionDataTable';
import PitchByPlacementInInning from '../components/PitchByPlacementInInning';
import PitchByPitchDelta from '../components/PitchByPitchDelta';
import PitchesByInning from '../components/PitchesByInning';
import { useGetPlayers } from '../api/use-get-players';
import { useGetPlayer } from '../api/use-get-player';
import { populatePlayersList } from '../utils/utils';
// import Slider from '@mui/material/Slider';

export default function MLRPitchers() {
  const [pitchers, setPitchers] = React.useState<FormSchemaPlayers>([])
  const [pitches, setPitches] = React.useState<FormSchemaPitches>([])
  const [playerOption, setPlayerOption] = React.useState<number>(0)

  const [teams, setTeams] = React.useState<FormSchemaTeams>([])
  const [teamOption, setTeamOption] = React.useState('')
  const [seasons, setSeasons] = React.useState<number[]>([]);
  const [seasonOption, setSeasonOption] = React.useState<number>(0)
  const [originalPitches, setOriginalPitches] = React.useState<FormSchemaPitches>([])
  const [sessions, setSessions] = React.useState<number[]>([]);
  const [sessionOption, setSessionOption] = React.useState<number>(0)
  const [error, setError] = React.useState<string>('');
  const league = 'mlr';
  const playerType = 'pitching';

  const theme = createTheme({
    colorSchemes: {
      dark: true,
    },
  });

  // Get a list of players on page load
  const { data: players, isLoading: isLoading, isError: isError, error: apiError } = useGetPlayers();
  const { data: plateAppearances } = useGetPlayer(playerType, league, playerOption);
  // const { data: plateAppearances, isLoading: isPADoneLoading, isError: isPAError, error: apiPAError } = useGetPlayer(playerType, league, playerOption);


  // Load list of teams once
  React.useEffect(() => {
    const teamsList = teamsJson;
    setTeams(teamsList);
  }, [])

  // When Team Changes -> Populate New Players
  React.useEffect(() => {
    if (players != null) {
      const playerList = populatePlayersList(players, league, playerType, teamOption);
      setPitchers(playerList)
    }
  }, [teamOption]);

  // Update Player Data based on fetched data
  React.useEffect(() => {
    if (players != null && plateAppearances !== undefined) {
      const seasons = new Set<number>();
      for (let i = 0; i < plateAppearances.length; i++) {
        seasons.add(plateAppearances[i].season)
      }

      setSeasons([...seasons].reverse())
      const latestSeason = Number([...seasons].slice(-1));
      setSeasonOption(latestSeason) // set latest season first
      setOriginalPitches(plateAppearances);
      setSessionOption(0);
    }
  }, [plateAppearances, players])

  // Seasons
  React.useEffect(() => {
    if (players != undefined && players.length != 0 && plateAppearances !== undefined && plateAppearances.length != 0) {
      // Loop through to get the sessions per season
      const numberOfSessions = new Set<number>();
      originalPitches.map((e) => {
        if (e.season == seasonOption) {
          numberOfSessions.add(e.session);
        }
      })
      setSessions([...numberOfSessions].sort((a, b) => { return a - b }))

      // Set default session to first of the game of the season
      if (sessionOption == 0 || sessionOption == undefined) {
        const latestSession = [...numberOfSessions][0];
        setSessionOption(latestSession);
      }

      // filter the pitches based on season + session
      let filteredPitches: FormSchemaPitches = []

      filteredPitches = originalPitches.filter(e => {
        if (e.season == seasonOption) {
          if (e.session != sessionOption) {
            return false;
          }
          return true;
        }
      });

      setPitches(filteredPitches);
    }
    else {
      console.log('sad no players yet')
    }
  }, [seasonOption, sessionOption])

  async function handleChangeTeam(event: SelectChangeEvent) {
    const team = teams.find(team => team.teamID === event.target.value)
    if (team) {
      setTeamOption(team.teamID);
      // reset dashboard
      setPlayerOption(0);
      setSeasons([]);
      setSeasonOption(0);
      setSessionOption(0);
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
    if (players == undefined) {
      setError('No Player Found');
      return;
    }

    const player = players.find(player => player.playerID === Number(event.target.value))
    if (!player) {
      setError('Invalid Player.');
      return;
    }
    setPitches([]);
    setPlayerOption(Number(event.target.value));
  }

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {isError && <p>{apiError?.message}</p> && <p>{error.length > 0}</p>}
      {!isLoading && !isError &&
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
                          {team.teamName}
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
                  value={playerOption ? playerOption.toString() : ''}
                >
                  {
                    teamOption && pitchers.map((pitcher) => {
                      return (
                        <MenuItem key={pitcher.playerID} value={(pitcher === undefined || pitcher === null || pitchers.length === 0) ? '' : pitcher.playerID}>
                          {pitcher.playerName}
                        </MenuItem>
                      )
                    })
                  }
                </Select>
                <FormHelperText>{playerOption ? '' : 'Select Pitcher'}</FormHelperText>
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
                          {season}
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
                          {session}
                        </MenuItem>
                      )
                    })
                  }
                </Select>
              </FormControl>
              <SessionDataTable pitches={pitches} />
            </Grid>

            <Grid container justifyContent="center" style={{ padding: 30 }}>
              <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }} alignItems="center" justifyContent="center">
                <PitchSwingChart pitches={pitches} />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }} alignItems="center" justifyContent="center" >
                <PitchByPlacementInInning pitches={pitches} />
              </Grid>
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }} alignItems="center" justifyContent="center">
              <PitchByPitchDelta pitches={pitches} />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }} alignItems="center" justifyContent="center" >
              <PitchesByInning pitches={pitches} />
            </Grid>
          </Grid>
        </ThemeProvider>
      }
    </>
  );
}