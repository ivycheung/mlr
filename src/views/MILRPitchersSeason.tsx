import * as React from 'react'
import axios from 'axios'

import { FormSchemaPitches } from '../types/schemas/pitches-schema';
import { FormSchemaPlayers } from '../types/schemas/player-schema';
import { FormSchemaTeams } from '../types/schemas/team-schema';
import teamsJson from '../utils/milrteams.json';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import HistogramChart from '../components/HistogramChart';
// import HeatmapChart from '../components/HeatmapChart';
import CssBaseline from '@mui/material/CssBaseline';
import Grid2 from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import { useGetPlayers } from '../api/use-get-players';
import FormGroup from '@mui/material/FormGroup';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import blueGrey from '@mui/material/colors/blueGrey';
import AccordionDetails from '@mui/material/AccordionDetails';
import SessionDataTable from '../components/SessionDataTable';
import { populatePlayersList } from '../utils/utils';
import { useGetPlayer } from '../api/use-get-player';

// import Slider from '@mui/material/Slider';

export default function MILRPitchers() {
  const [pitchers, setPitchers] = React.useState<FormSchemaPlayers>([])
  const [playerOption, setPlayerOption] = React.useState<number>(0)

  const [teams, setTeams] = React.useState<FormSchemaTeams>([])
  const [teamOption, setTeamOption] = React.useState('')
  const [mlrSeasons, setMlrSeasons] = React.useState<number[]>([]);
  const [mlrSeasonOption, setMlrSeasonOption] = React.useState<number>(0)
  const [milrSeasons, setMilrSeasons] = React.useState<number[]>([]);
  const [milrSeasonOption, setMilrSeasonOption] = React.useState<number>(0)
  const [pitches, setPitches] = React.useState<FormSchemaPitches>([])
  const [mlrpitches, setMlrPitches] = React.useState<FormSchemaPitches>([])
  const [milrpitches, setMilrPitches] = React.useState<FormSchemaPitches>([])
  const [careerOption, setCareerOption] = React.useState(false);
  const [error, setError] = React.useState<string>('');
  const [showSeason, setShowSeason] = React.useState<boolean>(false);
  const prevMlrSeasonOption = React.useRef<number>(0);
  const prevMilrSeasonOption = React.useRef<number>(0);
  const league = 'milr';
  const leagueMLR = 'mlr';
  const playerType = 'pitching';

  let theme = createTheme({
    palette: {
      mode: 'light',
    },
  });
  theme = responsiveFontSizes(theme);

  // Get a list of players on page load
  const { data: players, isLoading: isLoading } = useGetPlayers();
  const { data: plateAppearancesMLR } = useGetPlayer(playerType, leagueMLR, playerOption);
  const { data: plateAppearancesMiLR } = useGetPlayer(playerType, league, playerOption);


  // Teams
  React.useEffect(() => {
    const teamsList = teamsJson;
    setTeams(teamsList);
  }, [teams])

  // Players
  React.useEffect(() => {
    if (players != null) {
      const playerList = populatePlayersList(players, league, playerType, teamOption);
      setPitchers(playerList);
    }
  }, [teamOption]);

  // Update Player Data based on fetched data
  React.useEffect(() => {
    if (players != null) {
      
      
      // Determine how many seasons per league for dropdowns
      const leagues = ['mlr', 'milr'];
      leagues.map(async (l) => {
        if (l == 'mlr') {
          const seasons = new Set<number>();
          if (plateAppearancesMLR !== undefined) {
            for (let i = 0; i < plateAppearancesMLR.length; i++) {
              seasons.add(plateAppearancesMLR[i].season);
            }
            setMlrPitches(plateAppearancesMLR);

            console.log(mlrpitches)
            setMlrSeasons([...seasons].sort((a, b) => a - b))
            setMlrSeasonOption(0)
          }
        }
        else if (l == 'milr') {
          const seasons = new Set<number>();
          if (plateAppearancesMiLR !== undefined) {
            for (let i = 0; i < plateAppearancesMiLR.length; i++) {
              seasons.add(plateAppearancesMiLR[i].season);
            }
            setMilrPitches(plateAppearancesMiLR);
            setMilrSeasons([...seasons].sort((a, b) => a - b))
            setMilrSeasonOption(Number([...seasons].slice(-1))) // last season
          }
        }
      })

      if (milrSeasons.length == 0) {
        setMlrSeasonOption(Number([...mlrSeasons].slice(-1))) // last season
        setMilrSeasonOption(0) // last season
      }
    }
  }, [playerOption, players, mlrpitches, milrpitches, plateAppearancesMLR, plateAppearancesMiLR]);

  // Seasons
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

      setPitches(filteredPitches);
    }
  }, [players, playerOption, mlrSeasonOption, milrSeasonOption, mlrpitches, milrpitches]);

  React.useEffect(() => {
    const filteredPitches = mlrpitches.concat(milrpitches)
    setPitches(filteredPitches);
  }, [careerOption])

  async function handleChangeTeam(event: SelectChangeEvent) {
    const team = teams.find(team => team.teamID === event.target.value)
    if (team) {
      // reset dashboard
      setTeamOption(team.teamID);
      setPlayerOption(0);
      setMlrSeasons([]);
      setMlrSeasonOption(0);
      setMilrSeasons([]);
      setMilrSeasonOption(0);
    }
  }

  async function handleChangeMlrSeason(event: SelectChangeEvent) {
    const season = Number(event.target.value);
    setMlrSeasonOption(season)
    setMilrSeasonOption(0);
    setCareerOption(false);
    setShowSeason(false);
  }

  async function handleChangeMilrSeason(event: SelectChangeEvent) {
    const season = Number(event.target.value);
    setMilrSeasonOption(season);
    setMlrSeasonOption(0);
    setCareerOption(false);
    setShowSeason(false);
  }

  async function handleChangePitcher(event: SelectChangeEvent) {
    if (players == undefined) {
      setError('No Players Found');
      return;
    }

    const player = players.find(player => player.playerID === Number(event.target.value))
    if (!player) {
      setError('No Player Found');
      return;
    }
    setPlayerOption(player.playerID);
  }

  React.useEffect(() => {
    if (!careerOption) {
      if (prevMlrSeasonOption.current == 0) {
        setMilrSeasonOption(prevMilrSeasonOption.current);
      }
      else if (prevMilrSeasonOption.current == 0) {
        setMlrSeasonOption(prevMlrSeasonOption.current);
      }
    }
  }, [careerOption]);

  async function handleCareerStatsChange(_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) {
    setCareerOption(checked);
    setShowSeason(checked);
    if (checked) {
      prevMlrSeasonOption.current = mlrSeasonOption;
      prevMilrSeasonOption.current = milrSeasonOption;
    }

    setMilrSeasonOption(0);
    setMlrSeasonOption(0);
  }

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!isLoading && !error &&
        <ThemeProvider theme={theme}>
          <CssBaseline />
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
                    pitchers.map((pitcher) => {
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
                <InputLabel id="mlrseason-input-select-label" sx={{ color: "grey.400", }}>MLR Season</InputLabel>
                <Select
                  labelId="mlrseason-input-select-label"
                  id="mlrseason-input-select"
                  label={mlrSeasonOption}
                  onChange={handleChangeMlrSeason}
                  value={mlrSeasonOption ? mlrSeasonOption.toString() : ''
                  }
                >
                  {
                    mlrSeasons.map((season) => {
                      return (
                        <MenuItem key={season} value={(season === undefined || season === null || mlrSeasons.length === 0) ? '' : season}>
                          {season}
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
                  onChange={handleChangeMilrSeason}
                  value={milrSeasonOption ? milrSeasonOption.toString() : ''}
                >
                  {
                    milrSeasons.map((season) => {
                      return (
                        <MenuItem key={season} value={(season === undefined || season === null || milrSeasons.length === 0) ? '' : season}>
                          {season}
                        </MenuItem>
                      )
                    })
                  }
                </Select>
                <FormHelperText>{milrSeasonOption ? '' : 'Select MiLR Season'}</FormHelperText>
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