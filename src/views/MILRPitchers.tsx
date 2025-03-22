import * as React from 'react'

import { FormSchemaPitches } from '../types/schemas/pitches-schema';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Grid from '@mui/material/Grid2';

import PitchSwingChart from '../components/PitchSwingChart';
import SessionDataTable from '../components/SessionDataTable';
import PitchByPlacementInInning from '../components/PitchByPlacementInInning';
import PitchByPitchDelta from '../components/PitchByPitchDelta';
import PitchesByInning from '../components/PitchesByInning';
import { useGetPlayers } from '../api/use-get-players';
import TeamsDropdown from '../components/TeamsDropdown';
import PlayersDropdown from '../components/PlayersDropdown';
import { useGetPlayer } from '../api/use-get-player';
import { useLocalStorage } from '@mantine/hooks';
import useGoogleAnalytics from '../hooks/google-analytics';

export default function MILRPitchers() {
  const [playerOption, setPlayerOption] = useLocalStorage<number>({ key: 'milrPlayerId', defaultValue: 0 })
  const [teamOption, setTeamOption] = useLocalStorage<string>({ key: 'milrTeamId', defaultValue: '' })

  const [mlrSeasons, setMlrSeasons] = React.useState<number[]>([]);
  const [mlrSeasonOption, setMlrSeasonOption] = React.useState<number>(0)
  const [milrSeasons, setMilrSeasons] = React.useState<number[]>([]);
  const [milrSeasonOption, setMilrSeasonOption] = React.useState<number>(0)
  const [combinedPitches, setCombinedPitches] = React.useState<FormSchemaPitches>([])
  const [mlrpitches, setMlrPitches] = React.useState<FormSchemaPitches>([])
  const [milrpitches, setMilrPitches] = React.useState<FormSchemaPitches>([])

  const league = 'milr';
  const leagueMLR = 'mlr';
  const playerType = 'pitching';

  // Get a list of players on page load
  const { data: players, isLoading: isLoading, isError: isError, error: apiError } = useGetPlayers();
  const { data: plateAppearancesMLR } = useGetPlayer(playerType, leagueMLR, playerOption);
  const { data: plateAppearancesMiLR } = useGetPlayer(playerType, league, playerOption);

  useGoogleAnalytics("MiLR Pitchers");

  // Update Player Data based on fetched data
  React.useEffect(() => {
    if (Array.isArray(players)) {
      for (const league of ['mlr', 'milr']) {
        const seasons = new Set<number>();

        if (league == 'mlr' && plateAppearancesMLR !== undefined && Array.isArray(plateAppearancesMLR)) {
          for (let i = 0; i < plateAppearancesMLR.length; i++) {
            seasons.add(plateAppearancesMLR[i].season);
          }
          setMlrPitches(plateAppearancesMLR);

          setMlrSeasons([...seasons].sort((a, b) => a - b));
          setMlrSeasonOption(0);
        }
        else if (league == 'milr' && plateAppearancesMiLR !== undefined && Array.isArray(plateAppearancesMiLR)) {
          for (let i = 0; i < plateAppearancesMiLR.length; i++) {
            seasons.add(plateAppearancesMiLR[i].season);
          }
          setMilrPitches(plateAppearancesMiLR);

          setMilrSeasons([...seasons].sort((a, b) => a - b));
          setMilrSeasonOption(Number([...seasons].slice(-1)));
        }
      }

      if (milrSeasons.length == 0 && mlrSeasons.length != 0) {
        setMlrSeasonOption(Number([...mlrSeasons].slice(-1)));
        setMilrSeasonOption(0);
      }
    }
  }, [playerOption, plateAppearancesMLR, plateAppearancesMiLR, milrSeasons.length, mlrSeasons.length]);

  // Seasons
  React.useEffect(() => {
    if (Array.isArray(players) && (mlrpitches.length > 0 || milrpitches.length > 0)) {
      let filteredPitches: FormSchemaPitches = []
      if (mlrSeasonOption != 0 && milrSeasonOption == 0) {
        filteredPitches = mlrpitches.filter(e =>
          e.season === mlrSeasonOption
        );
      }
      else if (mlrSeasonOption == 0 && milrSeasonOption != 0) {
        filteredPitches = milrpitches.filter(e =>
          e.season === milrSeasonOption
        );
      }

      setCombinedPitches(filteredPitches);
    }
  }, [players, playerOption, mlrSeasonOption, milrSeasonOption, mlrpitches, milrpitches])

  async function handleChangeMilrSeason(event: SelectChangeEvent) {
    const season = Number(event.target.value);
    setMilrSeasonOption(season);
    setMlrSeasonOption(0);
  }

  async function handleChangeMlrSeason(event: SelectChangeEvent) {
    const season = Number(event.target.value);
    setMlrSeasonOption(season);
    setMilrSeasonOption(0);
  }

  const handleChangeTeam = React.useCallback((newTeamOption: string) => {
    setTeamOption(newTeamOption);
    setPlayerOption(0);
    setMlrSeasons([]);
    setMlrSeasonOption(0);
    setMilrSeasons([]);
    setMilrSeasonOption(0);
  }, []);

  const handleChangePlayer = React.useCallback((newPlayerOption: number) => {
    setPlayerOption(newPlayerOption);
    setMlrPitches([]);
    setMilrPitches([]);
  }, []);

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {isError && <p>{apiError?.message}</p>}
      {!isLoading && !isError &&
        <Grid container justifyContent="center" style={{ padding: 30 }}>
          <Grid size={12}>
            <TeamsDropdown league={league} teamOption={teamOption} handleChangeTeam={handleChangeTeam} />
            <PlayersDropdown league={league} players={players || []} playerType={playerType} teamOption={teamOption} playerOption={playerOption} handleChangePlayer={handleChangePlayer} />
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
            <Grid size={{ xs: 12 }} alignItems="center" justifyContent="center">
              <PitchSwingChart pitches={combinedPitches} showMarkers />
            </Grid>
            <Grid size={{ xs: 12 }} alignItems="center" justifyContent="center" >
              <PitchByPlacementInInning pitches={combinedPitches} />
            </Grid>
          </Grid>
          <Grid size={{ xs: 12 }} alignItems="center" justifyContent="center">
            <PitchByPitchDelta pitches={combinedPitches} showMarkers />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }} alignItems="center" justifyContent="center" >
              <PitchesByInning pitches={combinedPitches} />
            </Grid>
        </Grid>
      }
    </>
  );
}