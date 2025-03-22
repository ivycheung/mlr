import * as React from 'react'

import { FormSchemaPitches } from '../types/schemas/pitches-schema';

import { useGetPlayers } from '../api/use-get-players';
import { useGetPlayer } from '../api/use-get-player';
import useRefetchQuery from '../api/use-refetch-query';

import PitchSwingChart from '../components/PitchSwingChart';
import SessionDataTable from '../components/SessionDataTable';
import PitchByPlacementInInning from '../components/PitchByPlacementInInning';
import PitchByPitchDelta from '../components/PitchByPitchDelta';
import PitchesByInning from '../components/PitchesByInning';
import TeamsDropdown from '../components/TeamsDropdown';
import PlayersDropdown from '../components/PlayersDropdown';
import SeasonsDropdown from '../components/SeasonsDropdown';
import SessionsDropdown from '../components/SessionsDropdown';

import { useLocalStorage } from '@mantine/hooks';
import useGoogleAnalytics from '../hooks/google-analytics';

import Grid from '@mui/material/Grid2';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import RestartAlt from '@mui/icons-material/RestartAlt';
import AutorenewIcon from '@mui/icons-material/Autorenew';

export default function MLRPitchers() {
  const [pitches, setPitches] = React.useState<FormSchemaPitches>([])
  const [playerOption, setPlayerOption, removePlayerOption] = useLocalStorage<number>({ key: 'playerId', defaultValue: 0 })
  const [teamOption, setTeamOption, removeTeamOption] = useLocalStorage<string>({ key: 'teamId', defaultValue: '' })
  const [seasonOption, setSeasonOption] = React.useState<number>(0)
  const [sessionOption, setSessionOption] = React.useState<number>(0)
  const league = 'mlr';
  const playerType = 'pitching';

  // Get a list of players on page load
  const { data: players, isLoading: isLoading, isError: isError, error: apiError } = useGetPlayers();
  const { data: plateAppearances } = useGetPlayer(playerType, league, playerOption);
  const handleRefreshPlayer = useRefetchQuery(['player']);

  const theme = useTheme();
  const notDesktop = useMediaQuery(theme.breakpoints.down('md'));

  useGoogleAnalytics("MLR Pitchers");

  // Seasons
  React.useEffect(() => {
    if (plateAppearances !== undefined && plateAppearances.length != 0) {
      // filter the pitches based on season + session
      let filteredPitches: FormSchemaPitches = []

      filteredPitches = (plateAppearances || []).filter(
        e => e.season === seasonOption && e.session === sessionOption
      );

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

  const handleResetLocalStorage = function () {
    removePlayerOption();
    removeTeamOption();
    setPitches([]);
  }

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {isError && <p>{apiError?.message}</p>}
      {!isLoading && !isError &&
        <Grid container justifyContent="center" style={{ padding: 30 }} >
          <Grid container size={12} alignItems="center" sx={{ pb: 1 }}>
            <TeamsDropdown league={league} teamOption={teamOption} handleChangeTeam={handleChangeTeam} sx={{ maxWidth: { xs: 150, sm: 155, lg: 240 } }} />
            <PlayersDropdown league={league} players={players || []} playerType={playerType} teamOption={teamOption} playerOption={playerOption} handleChangePlayer={handleChangePlayer} sx={{ maxWidth: { xs: 150, sm: 175, lg: 240 } }} />
            <SeasonsDropdown seasonOption={seasonOption} plateAppearances={plateAppearances || []} handleChangeSeason={handleChangeSeason} sx={{ minWidth: { xs: 70, lg: 175 } }} />
            <SessionsDropdown seasonOption={seasonOption} sessionOption={sessionOption} plateAppearances={plateAppearances || []} handleChangeSession={handleChangeSession} sx={{ minWidth: { xs: 70, lg: 175 } }} />
            {notDesktop ?
              <><Button variant="contained" onClick={handleRefreshPlayer} sx={{ ml: 1 }} ><AutorenewIcon /></Button><Button variant="contained" sx={{ ml: 1 }} onClick={handleResetLocalStorage}><RestartAlt /></Button></>
              :
              <><Button variant="contained" onClick={handleRefreshPlayer} sx={{ ml: 1 }}>Refresh</Button><Button variant="contained" onClick={handleResetLocalStorage} sx={{ ml: 1 }}>Reset</Button></>
            }
          </Grid>
          <Grid size={12} sx={{ pb: 3 }}>
            <SessionDataTable pitches={pitches} />
          </Grid>
          <Grid container justifyContent="center" >
            <Grid size={{ xs: 12, lg: 6 }} alignItems="center" justifyContent="center">
              <PitchSwingChart pitches={pitches} />
            </Grid>
            <Grid size={{ xs: 12, lg: 6 }} alignItems="center" justifyContent="center" >
              <PitchByPlacementInInning pitches={pitches} />
            </Grid>

            <Grid size={{ xs: 12, lg: 6 }} alignItems="center" justifyContent="center">
              <PitchByPitchDelta pitches={pitches} />
            </Grid>
            <Grid size={{ xs: 12, lg: 6 }} alignItems="center" justifyContent="center" >
              <PitchesByInning pitches={pitches} />
            </Grid>
          </Grid>
        </Grid>
      }
    </>
  );
}