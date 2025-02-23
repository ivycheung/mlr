import * as React from 'react'

import { FormSchemaPitches } from '../types/schemas/pitches-schema';

import { useGetPlayers } from '../api/use-get-players';
import { useGetPlayer } from '../api/use-get-player';

import PitchSwingChart from '../components/PitchSwingChart';
import SessionDataTable from '../components/SessionDataTable';
import TeamsDropdown from '../components/TeamsDropdown';
import PlayersDropdown from '../components/PlayersDropdown';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';

export default function MLRBatters() {
  const [pitches, setPitches] = React.useState<FormSchemaPitches>([])
  const [playerOption, setPlayerOption] = React.useState<number>(0)
  // const [error, setError] = React.useState<string>('');

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

  // Update Player Data based on fetched data
  React.useEffect(() => {
    if (Array.isArray(players) && plateAppearances !== undefined && Array.isArray(plateAppearances)) {
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
    if (Array.isArray(players) && players.length != 0 && plateAppearances !== undefined && plateAppearances.length != 0) {
      // Loop through to get the sessions per season
      const numberOfSessions = new Set<number>();
      originalPitches?.map((e) => {
        if (e.season == seasonOption) {
          numberOfSessions.add(e.session);
        }
      })

      // filter the pitches based on season + session
      let filteredPitches: FormSchemaPitches = [];
      filteredPitches = originalPitches?.filter(e => {
        if (e.season == seasonOption) {
          return true;
        }
      });

      setPitches(filteredPitches);
    }
    // else {
    //   console.log('sad no players yet')
    // }
  }, [seasonOption, originalPitches])

  async function handleChangeSeason(event: SelectChangeEvent) {
    const season = Number(event.target.value);
    setSeasonOption(season)
  }

  const handleChangeTeam = React.useCallback((newTeamOption: string) => {
    setTeamOption(newTeamOption);
    setPlayerOption(0);
    setSeasons([]);
    setSeasonOption(0);
  }, []);

  const handleChangePlayer = React.useCallback((newPlayerOption: string) => {
    setPlayerOption(Number(newPlayerOption));
    setPitches([]);
  }, []);

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {isError && <p>{apiError?.message}</p>}
      {!isLoading && !isError &&
        <ThemeProvider theme={theme}>
          <Grid container justifyContent="center" style={{ padding: 30 }}>
            <Grid size={12}>
              <TeamsDropdown league={league} teamOption={teamOption} handleChangeTeam={handleChangeTeam} />
              <PlayersDropdown league={league} players={players || []} playerType={playerType} teamOption={teamOption} playerOption={playerOption} handleChangePlayer={handleChangePlayer} />

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