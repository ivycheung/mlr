import * as React from 'react'
import axios from 'axios'

import { FormSchemaPitches } from '../types/schemas/pitches-schema';
import { FormSchemaPlayers } from '../types/schemas/player-schema';
import { FormSchemaTeams } from '../types/schemas/team-schema';
import teamsJson from '../utils/mlrteams.json';

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
import { populatePlayersList } from '../utils/utils';
import blueGrey from '@mui/material/colors/blueGrey';
import { useGetPlayer } from '../api/use-get-player';

export default function MLRPitchers() {
  const [pitchers, setPitchers] = React.useState<FormSchemaPlayers>([])
  const [pitches, setPitches] = React.useState<FormSchemaPitches>([])
  const [playerOption, setPlayerOption] = React.useState<number>(0);
  const [teams, setTeams] = React.useState<FormSchemaTeams>([])
  const [teamOption, setTeamOption] = React.useState('')
  const [seasons, setSeasons] = React.useState<number[]>([]);
  const [seasonOption, setSeasonOption] = React.useState<number>(0)
  const [careerOption, setCareerOption] = React.useState(false);
  const [error, setError] = React.useState<string>('');
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

  // Teams
  React.useEffect(() => {
    const teamsList = teamsJson;
    setTeams(teamsList);
  }, [teams])

  // Get Players based on Teams
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
      setPitches(plateAppearances);
    }
  }, [playerOption, plateAppearances, players]);

  // Seasons
  React.useEffect(() => {
    if (players != undefined && players.length != 0 && plateAppearances !== undefined && plateAppearances.length != 0) {
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

  async function handleChangeTeam(event: SelectChangeEvent) {
    const team = teams.find(team => team.teamID === event.target.value)
    if (team) {
      // reset dashboard
      setTeamOption(team.teamID);
      setPlayerOption(0);
      setSeasons([]);
      setSeasonOption(0);
    }
  }

  async function handleChangeSeason(event: SelectChangeEvent) {
    const season = Number(event.target.value);
    setSeasonOption(season)
  }

  async function handleChangePitcher(event: SelectChangeEvent) {
    if (players == undefined && !Array.isArray(players)) {
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

  async function handleCareerStatsChange(_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) {
    setCareerOption(checked);
    setShowSeason(checked);
  }

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {isError && <p>{apiError?.message}</p> && <p>{error.length > 0}</p>}
      {!isLoading && !error &&
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Grid container style={{ padding: 30 }} size={12} direction="row"
            sx={{
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <Grid>
              <FormControl sx={{ m: 1, minWidth: 240 }}>
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