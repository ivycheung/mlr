import * as React from 'react'
import axios from 'axios'

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';

import { FormSchemaPitches } from '../types/schemas/pitches-schema';
import { FormSchemaPlayers } from '../types/schemas/player-schema';
import { FormSchemaTeams } from '../types/schemas/team-schema';

import teamsJson from '../utils/milrteams.json';
import PitchSwingChart from '../components/PitchSwingChart';
import SessionDataTable from '../components/SessionDataTable';
import { useGetPlayers } from '../api/use-get-players';

export default function MILRBatters() {
  const [batters, setBatters] = React.useState<FormSchemaPlayers>([])
  const [combinedPitches, setCombinedPitches] = React.useState<FormSchemaPitches>([])
  const [mlrpitches, setMlrPitches] = React.useState<FormSchemaPitches>([])
  const [milrpitches, setMilrPitches] = React.useState<FormSchemaPitches>([])
  const [batterOption, setBatterOption] = React.useState<number>(0);
  const [error, setError] = React.useState<string>('');

  const [teams, setTeams] = React.useState<FormSchemaTeams>([])
  const [teamOption, setTeamOption] = React.useState('')
  const [mlrSeasons, setMlrSeasons] = React.useState<number[]>([]);
  const [mlrSeasonOption, setMlrSeasonOption] = React.useState<number>(0)
  const [milrSeasons, setMilrSeasons] = React.useState<number[]>([]);
  const [milrSeasonOption, setMilrSeasonOption] = React.useState<number>(0)

  const theme = createTheme({
    colorSchemes: {
      dark: true,
    },
  });

  // Get a list of players on page load
  const { data: players, isLoading: isLoading } = useGetPlayers();

  React.useEffect(() => {
    const teamsList = teamsJson;
    setTeams(teamsList);
  }, [teams])

  React.useEffect(() => {
    if (players != null) {
      const battersList = []
      for (let i = 0; i < players.length; i++) {
        if (players[i].milr_team === teamOption) {
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
    if (players == undefined) {
      setError('No Player Found');
      return;
    }

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
      setError('Error Fetching Swings ' + err);
    }
  }

  async function handleChangeMlrSeason(event: SelectChangeEvent) {
    const season = Number(event.target.value);
    setMlrSeasonOption(season);
    setMilrSeasonOption(0);
  }

  async function handleChangeMilrSeason(event: SelectChangeEvent) {
    const season = Number(event.target.value);
    setMilrSeasonOption(season);
    setMlrSeasonOption(0);
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
                          {batter.playerName}
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