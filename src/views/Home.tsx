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
import Button from '@mui/material/Button';
import RestartAlt from '@mui/icons-material/RestartAlt';
import useTheme from '@mui/material/styles/useTheme';
import useMediaQuery from '@mui/material/useMediaQuery';
// import Slider from '@mui/material/Slider';

export default function Home() {
  const [pitches, setPitches] = React.useState<FormSchemaPitches>([])
  const [playerOption, setPlayerOption] = React.useState<number>(0)
  const [teamOption, setTeamOption] = React.useState('')
  const [atBatsOption, setAtBatsOption] = React.useState<number>(0);
  const league = 'mlr';
  const playerType = 'pitching';

  // Get a list of players on page load
  const { data: players, isLoading: isLoading, isError: isError, error: apiError } = useGetPlayers();
  const { data: plateAppearances } = useGetPlayer(playerType, league, playerOption);

  const theme = useTheme();
  const notDesktop = useMediaQuery(theme.breakpoints.down('md'));

  // Seasons
  React.useEffect(() => {
    if (plateAppearances !== undefined && plateAppearances.length != 0) {

      // filter the pitches based on season + session
      let filteredPitches: FormSchemaPitches = []

      filteredPitches = (plateAppearances || []).slice((atBatsOption * -1));

      setPitches(filteredPitches);
    }
  }, [plateAppearances, setAtBatsOption]);

  const handleChangeTeam = React.useCallback((newTeamOption: string) => {
    setTeamOption(newTeamOption);
    setPitches([]);
    setPlayerOption(0);
    setAtBatsOption(15);
  }, []);

  const handleChangePlayer = React.useCallback((newPlayerOption: number) => {
    setPlayerOption(newPlayerOption);
    setPitches([]);
    setAtBatsOption(15);
  }, []);

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {isError && <p>{apiError?.message}</p>}
      {!isLoading && !isError &&
        <Grid container justifyContent="center" style={{ padding: 30 }} >
          <Grid container size={12} alignItems="center" >
            <TeamsDropdown league={league} teamOption={teamOption} handleChangeTeam={handleChangeTeam} hideLabel sx={{ maxWidth: { xs: 150, sm: 175, lg: 240 } }}  />
            <PlayersDropdown league={league} players={players || []} playerType={playerType} teamOption={teamOption} playerOption={playerOption} handleChangePlayer={handleChangePlayer} hideLabel sx={{ maxWidth: { xs: 150, sm: 175, lg: 240 } }} />
            {notDesktop ?
              <Button variant="contained" sx={{ml: 1}}><RestartAlt /></Button>
              :
              <Button variant="contained" endIcon={<RestartAlt />} sx={{ml: 1}}>Reset</Button>
            }
          </Grid>
          <Grid size={12}>
            <SessionDataTable pitches={pitches} showSeason />
          </Grid>
          <Grid container justifyContent="center" style={{ padding: 30 }} >
            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }} alignItems="center" justifyContent="center">
              <PitchSwingChart pitches={pitches} showMarkers />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }} alignItems="center" justifyContent="center" >
              <PitchByPlacementInInning pitches={pitches} />
            </Grid>

            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }} alignItems="center" justifyContent="center">
              <PitchByPitchDelta pitches={pitches} />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }} alignItems="center" justifyContent="center" >
              <PitchesByInning pitches={pitches} />
            </Grid>
          </Grid>
        </Grid>
      }
    </>
  );
}