import * as React from 'react';

import { FormSchemaPitches } from '../types/schemas/pitches-schema';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import HistogramChart from '../components/HistogramChart';
import CssBaseline from '@mui/material/CssBaseline';
import Grid2 from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import FormGroup from '@mui/material/FormGroup';
// import Slider from '@mui/material/Slider';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import SessionDataTable from '../components/SessionDataTable';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useGetPlayers } from '../api/use-get-players';
import blueGrey from '@mui/material/colors/blueGrey';
import { useGetPlayer } from '../api/use-get-player';
import TeamsDropdown from '../components/TeamsDropdown';
import PlayersDropdown from '../components/PlayersDropdown';

export default function MLRPitchers() {
  const [pitches, setPitches] = React.useState<FormSchemaPitches>([])
  const [playerOption, setPlayerOption] = React.useState<number>(0);
  const [teamOption, setTeamOption] = React.useState('')
  const [seasons, setSeasons] = React.useState<number[]>([]);
  const [seasonOption, setSeasonOption] = React.useState<number>(0)
  const [careerOption, setCareerOption] = React.useState(false);
  // const [error, setError] = React.useState<string>('');
  const [showSeason, setShowSeason] = React.useState<boolean>(false);
  const league = 'mlr';
  const playerType = 'pitching';

  let theme = createTheme({
    palette: {
      mode: 'light',
    },
  });
  theme = responsiveFontSizes(theme);

  // Get a list of players on page load
  const { data: players, isLoading: isLoading, isError: isError, error: apiError } = useGetPlayers();
  const { data: plateAppearances } = useGetPlayer(playerType, league, playerOption);

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
      setPitches(plateAppearances);
    }
  }, [playerOption, plateAppearances, players]);

  // Seasons
  React.useEffect(() => {
    if (Array.isArray(players) && players.length != 0 && plateAppearances !== undefined && plateAppearances.length != 0) {
      // filter the pitches based on season
      let filteredPitches: FormSchemaPitches = []
      if (!careerOption) {
        filteredPitches = plateAppearances.filter(e => {
          if (e.season == seasonOption) {
            return true;
          }
        });
      }
      else {
        filteredPitches = plateAppearances;
      }

      setPitches(filteredPitches);
    }
  }, [careerOption, plateAppearances, players, seasonOption])

  async function handleChangeSeason(event: SelectChangeEvent) {
    const season = Number(event.target.value);
    setSeasonOption(season)
  }

  async function handleCareerStatsChange(_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) {
    setCareerOption(checked);
    setShowSeason(checked);
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
          <CssBaseline />
          <Grid container style={{ padding: 30 }} size={12} direction="row"
            sx={{
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <Grid>
              <TeamsDropdown league={league} teamOption={teamOption} handleChangeTeam={handleChangeTeam} />
              <PlayersDropdown league={league} players={players || []} playerType={playerType} teamOption={teamOption} playerOption={playerOption} handleChangePlayer={handleChangePlayer} />
              <FormControl sx={{ m: 1, minWidth: 240 }}>
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
              <FormControl sx={{ m: 1, minWidth: 240 }}>
                <FormGroup aria-label="position" row>
                  <FormControlLabel
                    control={<Checkbox size="small" onChange={handleCareerStatsChange} />} label="Career Stats" labelPlacement="end" />
                </FormGroup>
              </FormControl>

            </Grid>
            {
              ((!pitches || pitches.length != 0) ?
                <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }} sx={{
                  justifyContent: "flex-start",
                  alignItems: "center"
                }}>
                  <Accordion style={{ maxHeight: '500px' }}>
                    <AccordionSummary
                      expandIcon={<ArrowDropDownIcon />}
                      aria-controls="panel2-content"
                      id="panel2-header"
                      style={{ backgroundColor: blueGrey[50] }}>
                      <Typography component="span">Data Table</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <SessionDataTable pitches={pitches} showSeason={showSeason} />
                    </AccordionDetails>
                  </Accordion>
                </Grid>
                : '')
            }

            <Grid container spacing={2} style={{ padding: 30 }} size={{ lg: 12 }}
              sx={{
                justifyContent: "flex-start",
                alignItems: "center"
              }}>
              <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 6 }} >
                { /* histogram */}
                <HistogramChart pitches={pitches} />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 6 }} >
                { /* heatmap */}
                <Stack
                  direction={'column'}
                  sx={{
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                    height: '100%',

                  }}>
                  {/* <HeatmapChart pitches={pitches} /> */}
                </Stack>
              </Grid2>
            </Grid>
            {/* <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }} alignItems="center" justifyContent="center">
              <PitchByPitchDelta pitches={pitches} />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }} alignItems="center" justifyContent="center" >
                <PitchesByInning pitches={pitches} />
            </Grid> */}
          </Grid>
        </ThemeProvider>
      }
    </>
  );
}