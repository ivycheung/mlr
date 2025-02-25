import * as React from 'react'

import { FormSchemaPitches } from '../types/schemas/pitches-schema';

import { useGetPlayers } from '../api/use-get-players';
import { useGetPlayer } from '../api/use-get-player';

import PitchSwingChart from '../components/PitchSwingChart';
import SessionDataTable from '../components/SessionDataTable';
import PitchByPlacementInInning from '../components/PitchByPlacementInInning';
import PitchByPitchDelta from '../components/PitchByPitchDelta';
import PitchesByInning from '../components/PitchesByInning';
import TeamsDropdown from '../components/TeamsDropdown';
import PlayersDropdown from '../components/PlayersDropdown';

import Grid from '@mui/material/Grid2';
import SeasonsDropdown from '../components/SeasonsDropdown';
import SessionsDropdown from '../components/SessionsDropdown';
// import Slider from '@mui/material/Slider';

export default function MLRPitchers() {
  const [pitches, setPitches] = React.useState<FormSchemaPitches>([])
  const [playerOption, setPlayerOption] = React.useState<number>(0)
  const [teamOption, setTeamOption] = React.useState('')
  const [seasonOption, setSeasonOption] = React.useState<number>(0)
  const [sessionOption, setSessionOption] = React.useState<number>(0)
  const league = 'mlr';
  const playerType = 'pitching';

  // Get a list of players on page load
  const { data: players, isLoading: isLoading, isError: isError, error: apiError } = useGetPlayers();
  const { data: plateAppearances } = useGetPlayer(playerType, league, playerOption);

  // Seasons
  React.useEffect(() => {
    if (plateAppearances !== undefined && plateAppearances.length != 0) {

      // filter the pitches based on season + session
      let filteredPitches: FormSchemaPitches = []

      filteredPitches = plateAppearances?.filter(e => {
        if (e.season == seasonOption && e.session == sessionOption) {
          return true;
        }
        return false;
      });

      setPitches(filteredPitches);
    }
  }, [plateAppearances, seasonOption, sessionOption]);

  const handleChangeSeason = React.useCallback((newSeasonOption: number) => {
    setSeasonOption(newSeasonOption);
    setSessionOption(0);
  }, []);

  const handleChangeSession = React.useCallback((newSessionOption: number) => {
    setSessionOption(newSessionOption);
  }, []);

  const handleChangeTeam = React.useCallback((newTeamOption: string) => {
    setTeamOption(newTeamOption);
    setPitches([]);
    setPlayerOption(0);
    setSeasonOption(0);
    setSessionOption(0);
  }, []);

  const handleChangePlayer = React.useCallback((newPlayerOption: number) => {
    setPlayerOption(newPlayerOption);
    setPitches([]);
    setSeasonOption(0);
    setSessionOption(0);
  }, []);

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {isError && <p>{apiError?.message}</p>}
      {!isLoading && !isError &&
        <Grid container justifyContent="center" style={{ padding: 30 }}>
          <Grid size={12}>
            <TeamsDropdown league={league} teamOption={teamOption} handleChangeTeam={handleChangeTeam} sx={{ maxWidth: { xs: 150, sm: 175, lg: 240 } }} />
            <PlayersDropdown league={league} players={players || []} playerType={playerType} teamOption={teamOption} playerOption={playerOption} handleChangePlayer={handleChangePlayer} sx={{ maxWidth: { xs: 150, sm: 175, lg: 240 } }} />
            <SeasonsDropdown seasonOption={seasonOption} plateAppearances={plateAppearances || []} handleChangeSeason={handleChangeSeason} sx={{ minWidth: { xs: 70, lg: 175 } }} />
            <SessionsDropdown seasonOption={seasonOption} sessionOption={sessionOption} plateAppearances={plateAppearances || []} handleChangeSession={handleChangeSession} sx={{ minWidth: { xs: 70, lg: 175 } }} />

            <SessionDataTable pitches={pitches} />
          </Grid>

          <Grid container justifyContent="center" style={{ padding: 30 }} >
            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }} alignItems="center" justifyContent="center">
              <PitchSwingChart pitches={pitches} />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }} alignItems="center" justifyContent="center" >
              <PitchByPlacementInInning pitches={pitches} />
            </Grid>
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }} alignItems="center" justifyContent="center">
            <PitchByPitchDelta pitches={pitches} />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }} alignItems="center" justifyContent="center" >
            <PitchesByInning pitches={pitches} />
          </Grid>
        </Grid>
      }
    </>
  );
}