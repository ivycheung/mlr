import * as React from 'react'

import { FormSchemaPitches } from '../types/schemas/pitches-schema';

import { useGetPlayers } from '../api/use-get-players';
import { useGetPlayer } from '../api/use-get-player';

import PitchSwingChart from '../components/PitchSwingChart';
import SessionDataTable from '../components/SessionDataTable';
import TeamsDropdown from '../components/TeamsDropdown';
import PlayersDropdown from '../components/PlayersDropdown';

import Grid from '@mui/material/Grid2';
import SeasonsDropdown from '../components/SeasonsDropdown';

export default function MLRBatters() {
  const [pitches, setPitches] = React.useState<FormSchemaPitches>([])
  const [playerOption, setPlayerOption] = React.useState<number>(0)

  const [teamOption, setTeamOption] = React.useState('')
  const [seasonOption, setSeasonOption] = React.useState<number>(0)
  const league = 'mlr';
  const playerType = 'batting';

  // Get a list of players on page load
  const { data: players, isLoading: isLoading, isError: isError, error: apiError } = useGetPlayers();
  const { data: plateAppearances } = useGetPlayer(playerType, league, playerOption);
  // const { data: plateAppearances, isLoading: isPADoneLoading, isError: isPAError, error: apiPAError } = useGetPlayer(playerType, league, playerOption);

  // Get pitches
  React.useEffect(() => {
    if (Array.isArray(players) && players.length != 0 && plateAppearances !== undefined && plateAppearances.length != 0) {
      // filter the pitches based on season
      let filteredPitches: FormSchemaPitches = [];
      filteredPitches = plateAppearances?.filter(e => {
        if (e.season == seasonOption) {
          return true;
        }
      });

      setPitches(filteredPitches);
    }
  }, [seasonOption, plateAppearances, players]);

  const handleChangeSeason = React.useCallback((newSeasonOption: number) => {
    setSeasonOption(newSeasonOption);
  }, []);

  const handleChangeTeam = React.useCallback((newTeamOption: string) => {
    setTeamOption(newTeamOption);
    setPlayerOption(0);
    setSeasonOption(0);
    setPitches([]);
  }, []);

  const handleChangePlayer = React.useCallback((newPlayerOption: string) => {
    setPlayerOption(Number(newPlayerOption));
    setSeasonOption(0);
    setPitches([]);
  }, []);

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {isError && <p>{apiError?.message}</p>}
      {!isLoading && !isError &&
        <Grid container style={{
          padding: 30
        }}>
          <Grid size={12} sx={{ justifyContent: 'space-evenly', }}>
            <TeamsDropdown league={league} teamOption={teamOption} handleChangeTeam={handleChangeTeam} />
            <PlayersDropdown league={league} players={players || []} playerType={playerType} teamOption={teamOption} playerOption={playerOption} handleChangePlayer={handleChangePlayer} />
            <SeasonsDropdown seasonOption={seasonOption} plateAppearances={plateAppearances || []} handleChangeSeason={handleChangeSeason} />
          </Grid>
          <Grid size={12}>
            <SessionDataTable pitches={pitches} />
          </Grid>
          <Grid container justifyContent="center" sx={{
            width: '100%', height: '500px'
          }}>
            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }} alignItems="center" justifyContent="center">
              <PitchSwingChart pitches={pitches} />
            </Grid>
          </Grid>
        </Grid>
      }
    </>
  );
}