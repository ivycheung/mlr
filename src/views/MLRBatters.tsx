import * as React from 'react'

import { FormSchemaPitches } from '../types/schemas/pitches-schema';
import { FormSchemaPlayers } from '../types/schemas/player-schema';
import { FormSchemaTeams } from '../types/schemas/team-schema';

import teamsJson from '../utils/mlrteams.json';
import SessionDataTable from '../components/SessionDataTable';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
import { useGetPlayers } from '../api/use-get-players';
import { useGetPlayer } from '../api/use-get-player';
import { populatePlayersList } from '../utils/utils';
import PitchSwingChart from '../components/PitchSwingChart';

export default function MLRBatters() {
  const [batters, setBatters] = React.useState<FormSchemaPlayers>([])
  const [pitches, setPitches] = React.useState<FormSchemaPitches>([])
  const [playerOption, setPlayerOption] = React.useState<number>(0)
  const [error, setError] = React.useState<string>('');

  const [teams, setTeams] = React.useState<FormSchemaTeams>([])
  const [teamOption, setTeamOption] = React.useState('')
  const [seasons, setSeasons] = React.useState<number[]>([]);
  const [seasonOption, setSeasonOption] = React.useState<number>(0)
  const [originalPitches, setOriginalPitches] = React.useState<FormSchemaPitches>([])
  const league = 'mlr';
  const playerType = 'batting';

  const theme = createTheme({
    colorSchemes: {
      dark: true,
    },
  });

  // Get a list of players on page load
  const { data: players, isLoading: isLoading, isError: isError, error: apiError } = useGetPlayers();
  const { data: plateAppearances } = useGetPlayer(playerType, league, playerOption);
  // const { data: plateAppearances, isLoading: isPADoneLoading, isError: isPAError, error: apiPAError } = useGetPlayer(playerType, league, playerOption);

  React.useEffect(() => {
    const teamsList = teamsJson;
    setTeams(teamsList);
  }, [teams])

  React.useEffect(() => {
    if (players != null) {
      const playerList = populatePlayersList(players, league, playerType, teamOption);
      setBatters(playerList);
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
      }
    }, [playerOption, plateAppearances])
  
    // Seasons
    React.useEffect(() => {
      console.log(plateAppearances)
      if (players != undefined && players.length != 0 && plateAppearances !== undefined && plateAppearances.length != 0) {
        // Loop through to get the sessions per season
        const numberOfSessions = new Set<number>();
        originalPitches.map((e) => {
          if (e.season == seasonOption) {
            numberOfSessions.add(e.session);
          }
        })
  
        // filter the pitches based on season + session
        let filteredPitches: FormSchemaPitches = []
  
        filteredPitches = originalPitches.filter(e => {
          if (e.season == seasonOption) {
            return true;
          }
        });

        setPitches(filteredPitches);
      }
      else {
        console.log('sad no players yet')
      }
    }, [seasonOption, originalPitches])

  async function handleChangeTeam(event: SelectChangeEvent) {
    const team = teams.find(team => team.teamID === event.target.value)
    if (team) {
      setTeamOption(team.teamID)
      setPlayerOption(0);
      setSeasons([]);
      setSeasonOption(0);
      setPitches([]);
      // reset dashboard
    }
  }

  async function handleChangeBatter(event: SelectChangeEvent) {
    
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
    setPlayerOption(player.playerID);
  }

  async function handleChangeSeason(event: SelectChangeEvent) {
    const season = Number(event.target.value);
    setSeasonOption(season)
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
                <InputLabel id="batter-input-select-label">Batter</InputLabel>
                <Select
                  labelId="batter-input-select-label"
                  id="batter-input-select"
                  onChange={handleChangeBatter}
                  value={playerOption ? playerOption.toString() : ''}
                >
                  {
                    teamOption && batters.map((batter) => {
                      return (
                        <MenuItem key={batter.playerID} value={(batter === undefined || batter === null || batters.length === 0) ? '' : batter.playerID}>
                          {batter.playerName}
                        </MenuItem>
                      )
                    })
                  }
                </Select>
                <FormHelperText>{playerOption ? '' : 'Select Batter'}</FormHelperText>
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
              <SessionDataTable pitches={pitches} />
            </Grid>
            <Grid container justifyContent="center">
              <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }} alignItems="center" justifyContent="center">
                <PitchSwingChart pitches={pitches} />
              </Grid>
            </Grid>
          </Grid>
        </ThemeProvider>
      }
    </>
  );
}