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
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';

import PitchSwingChart from '../components/PitchSwingChart';
import SessionDataTable from '../components/SessionDataTable';
import PitchByPlacementInInning from '../components/PitchByPlacementInInning';
import PitchByPitchDelta from '../components/PitchByPitchDelta';
import PitchesByInning from '../components/PitchesByInning';
import { useGetPlayers } from '../api/use-get-players';
// import Slider from '@mui/material/Slider';

export default function MILRPitchers() {
  const [pitchers, setPitchers] = React.useState<FormSchemaPlayers>([])
  const [pitcherOption, setPitcherOption] = React.useState<number>(0)
  const [teams, setTeams] = React.useState<FormSchemaTeams>([])
  const [teamOption, setTeamOption] = React.useState('')
  const [mlrSeasons, setMlrSeasons] = React.useState<number[]>([]);
  const [mlrSeasonOption, setMlrSeasonOption] = React.useState<number>(0)
  const [milrSeasons, setMilrSeasons] = React.useState<number[]>([]);
  const [milrSeasonOption, setMilrSeasonOption] = React.useState<number>(0)
  const [combinedPitches, setCombinedPitches] = React.useState<FormSchemaPitches>([])
  const [mlrpitches, setMlrPitches] = React.useState<FormSchemaPitches>([])
  const [milrpitches, setMilrPitches] = React.useState<FormSchemaPitches>([])
  const [error, setError] = React.useState<string>('');

  const theme = createTheme({
    colorSchemes: {
      dark: true,
    },
  });

  // Get a list of players on page load
  const { data: players, isLoading: isLoading } = useGetPlayers();


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
      setTeamOption(team.teamID);
      setPitcherOption(0);
      setMlrSeasons([]);
      setMlrSeasonOption(0);
      setMilrSeasons([]);
      setMilrSeasonOption(0);
    }
  }

  async function handleChangeMilrSeason(event: SelectChangeEvent) {
    const season = Number(event.target.value);
    setMilrSeasonOption(season)
    setMlrSeasonOption(0)
  }

  async function handleChangeMlrSeason(event: SelectChangeEvent) {
    const season = Number(event.target.value);
    setMlrSeasonOption(season);
    setMilrSeasonOption(0);
  }

  async function handleChangePitcher(event: SelectChangeEvent) {
    if (players == undefined) {
      setError('No Player Found');
      return;
    }

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
                  value={pitcherOption ? pitcherOption.toString() : ''}
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
                <FormHelperText>{pitcherOption ? '' : 'Select Pitcher'}</FormHelperText>
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
              {/* <FormControl sx={{ m: 1, minWidth: 240, color: "blue" }}>
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
              </FormControl> */}
              <SessionDataTable pitches={combinedPitches} />
            </Grid>

            <Grid container justifyContent="center" style={{ padding: 30 }}>
              <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }} alignItems="center" justifyContent="center">
                <PitchSwingChart pitches={combinedPitches} />
              </Grid>
              <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }} alignItems="center" justifyContent="center" >
                <PitchByPlacementInInning pitches={combinedPitches} />
              </Grid>
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }} alignItems="center" justifyContent="center">
              <PitchByPitchDelta pitches={combinedPitches} />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }} alignItems="center" justifyContent="center" >
              <PitchesByInning pitches={combinedPitches} />
            </Grid>
          </Grid>
        </ThemeProvider>
      }
    </>
  );
}