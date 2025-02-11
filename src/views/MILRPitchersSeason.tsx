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

import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import HistogramChart from '../components/HistogramChart';
import HeatmapChart from '../components/HeatmapChart';
import CssBaseline from '@mui/material/CssBaseline';
import Grid2 from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
// import Slider from '@mui/material/Slider';

export default function MILRPitchers() {
  const [players, setPlayers] = React.useState<FormSchemaPlayers>([])
  const [pitchers, setPitchers] = React.useState<FormSchemaPlayers>([])
  const [pitches, setPitches] = React.useState<FormSchemaPitches>([])
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [pitcherOption, setPitcherOption] = React.useState<number>(0)

  const [teams, setTeams] = React.useState<FormSchemaTeams>([])
  const [teamOption, setTeamOption] = React.useState('')
  const [originalPitches, setOriginalPitches] = React.useState<FormSchemaPitches>([])
  const [filteredPitches, setFilteredPitches] = React.useState<FormSchemaPitches>([]);
  const [careerOption, setCareerOption] = React.useState(false);
    const [mlrSeasons, setMlrSeasons] = React.useState<number[]>([]);
    const [mlrSeasonOption, setMlrSeasonOption] = React.useState<number>(0)
    const [milrSeasons, setMilrSeasons] = React.useState<number[]>([]);
    const [milrSeasonOption, setMilrSeasonOption] = React.useState<number>(0)
      const [combinedPitches, setCombinedPitches] = React.useState<FormSchemaPitches>([])
      const [mlrpitches, setMlrPitches] = React.useState<FormSchemaPitches>([])
      const [milrpitches, setMilrPitches] = React.useState<FormSchemaPitches>([])

  let theme = createTheme({
    palette: {
      mode: 'light',
    },
  });
  theme = responsiveFontSizes(theme);

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
        if (players[i].milr_team === teamOption)
          pitchersList.push(players[i])
      }
      pitchersList.sort((a, b) => a.playerName.localeCompare(b.playerName));
      setPitchers(pitchersList)
    }
  }, [teamOption]);

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

      setCombinedPitches(filteredPitches);
    }
  }, [players, pitcherOption, mlrSeasonOption, milrSeasonOption])

  async function handleChangeTeam(event: SelectChangeEvent) {
    const team = teams.find(team => team.teamID === event.target.value)
    if (team) {
      // reset dashboard
      setTeamOption(team.teamID);
      setPitcherOption(0);
      setMlrSeasons([]);
      setMlrSeasonOption(0);
      setMilrSeasons([]);
      setMilrSeasonOption(0);
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

  async function handleChangePitcher(event: SelectChangeEvent) {
    setPitches([])
    const player = players.find(player => player.playerID === Number(event.target.value))
    if (player) {
      setPitcherOption(player.playerID)
    }

    const league = ['mlr', 'milr'];
    const seasons = new Set<number>();

    try {
      league.map(async (league) => {
        const response = await axios.get(
          `https://api.mlr.gg/legacy/api/plateappearances/pitching/${league}/${event.target.value}`,
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
      setError('Error Fetching Pitches' + err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCareerStatsChange(event: ChangeEvent<HTMLInputElement>, checked: boolean) {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    checked ? setCareerOption(true) : setCareerOption(false);    
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
              <FormControl sx={{ m: 1, minWidth: 240, color: "blue" }}>
                
                <FormControlLabel control={<Checkbox size="small" onChange={handleCareerStatsChange} />} label="Career Stats" />
              </FormControl>
            </Grid>

            <Grid container spacing={2} justifyContent="center" style={{ padding: 30 }}>
              <Grid2 container direction="column" size={{ xs: 12, sm: 12, md: 12, lg: 6 }} alignItems="center" justifyContent="center">
                { /* histogram */ }
                <HistogramChart pitches={combinedPitches} />
              </Grid2>
              <Grid2 container direction="column" size={{ xs: 12, sm: 12, md: 12, lg: 6 }} alignItems="center" justifyContent="center" >
                { /* heatmap */}
                <Stack
                  direction={'column'}
                  sx={{
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                    height: '100%',

                  }}>
                  <HeatmapChart pitches={combinedPitches} />
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