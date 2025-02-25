import * as React from 'react'

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Grid from '@mui/material/Grid2';

import { FormSchemaPitches } from '../types/schemas/pitches-schema';

import PitchSwingChart from '../components/PitchSwingChart';
import SessionDataTable from '../components/SessionDataTable';
import { useGetPlayers } from '../api/use-get-players';
import { useGetPlayer } from '../api/use-get-player';
import TeamsDropdown from '../components/TeamsDropdown';
import PlayersDropdown from '../components/PlayersDropdown';

export default function MILRBatters() {
  const [combinedPitches, setCombinedPitches] = React.useState<FormSchemaPitches>([])
  const [mlrpitches, setMlrPitches] = React.useState<FormSchemaPitches>([])
  const [milrpitches, setMilrPitches] = React.useState<FormSchemaPitches>([])
  const [playerOption, setPlayerOption] = React.useState<number>(0);

  const [teamOption, setTeamOption] = React.useState('')
  const [mlrSeasons, setMlrSeasons] = React.useState<number[]>([]);
  const [mlrSeasonOption, setMlrSeasonOption] = React.useState<number>(0)
  const [milrSeasons, setMilrSeasons] = React.useState<number[]>([]);
  const [milrSeasonOption, setMilrSeasonOption] = React.useState<number>(0);

  const league = 'milr';
  const leagueMLR = 'mlr';
  const playerType = 'batting';

  // Get a list of players on page load
  const { data: players, isLoading: isLoading, isError: isError, error: apiError } = useGetPlayers();
  const { data: plateAppearancesMLR } = useGetPlayer(playerType, leagueMLR, playerOption);
  const { data: plateAppearancesMiLR } = useGetPlayer(playerType, league, playerOption);

  // Update Player Data based on fetched data
  React.useEffect(() => {
    if (Array.isArray(players)) {
      // const league = ['mlr', 'milr'];
      for (const league of ['mlr', 'milr']) {
        const seasons = new Set<number>();
        if (league == 'mlr' && plateAppearancesMLR !== undefined && Array.isArray(plateAppearancesMLR)) {
          for (let i = 0; i < plateAppearancesMLR.length; i++) {
            seasons.add(plateAppearancesMLR[i].season);
          }
          setMlrPitches(plateAppearancesMLR);

          setMlrSeasons([...seasons].sort((a, b) => a - b))
          setMlrSeasonOption(0)
        }
        else if (league == 'milr' && plateAppearancesMiLR !== undefined && Array.isArray(plateAppearancesMiLR)) {
          for (let i = 0; i < plateAppearancesMiLR.length; i++) {
            seasons.add(plateAppearancesMiLR[i].season);
          }
          setMilrPitches(plateAppearancesMiLR);

          setMilrSeasons([...seasons].sort((a, b) => a - b))
          setMilrSeasonOption(Number([...seasons].slice(-1))) // last season
        }
      }
    }
  }, [playerOption, plateAppearancesMLR, plateAppearancesMiLR]);

  // Season
  React.useEffect(() => {
    if (Array.isArray(players)) {
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
  }, [players, playerOption, mlrSeasonOption, milrSeasonOption, mlrpitches, milrpitches])

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
            <FormControl sx={{ m: 1, minWidth: 150 }}>
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
            <Grid size={12} alignItems="center" justifyContent="center">
              <PitchSwingChart pitches={combinedPitches} />
            </Grid>
          </Grid>
        </Grid>
      }
    </>
  );
}