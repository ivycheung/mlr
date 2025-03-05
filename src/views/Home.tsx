import * as React from 'react'

import { FormSchemaPitches } from '../types/schemas/pitches-schema';

import { useGetPlayers } from '../api/use-get-players';
import { useGetPlayer } from '../api/use-get-player';

import PitchSwingChart from '../components/PitchSwingChart';
import SessionDataTable from '../components/SessionDataTable';
// import PitchByPlacementInInning from '../components/PitchByPlacementInInning';
import PitchByPitchDelta from '../components/PitchByPitchDelta';
// import PitchesByInning from '../components/PitchesByInning';
import TeamsDropdown from '../components/TeamsDropdown';
import PlayersDropdown from '../components/PlayersDropdown';

import Grid from '@mui/material/Grid2';
import Button from '@mui/material/Button';
import RestartAlt from '@mui/icons-material/RestartAlt';
import useTheme from '@mui/material/styles/useTheme';
import useMediaQuery from '@mui/material/useMediaQuery';

import { useLocalStorage } from '@mantine/hooks';
import NumberOfPitchesDropdown from '../components/NumberOfPitchesDropdown';
// import Switch from '@mui/material/Switch';
// import FormGroup from '@mui/material/FormGroup';
// import FormControlLabel from '@mui/material/FormControlLabel';

export default function Home() {
  const [pitches, setPitches] = React.useState<FormSchemaPitches>([])
  const [playerOption, setPlayerOption, removePlayerOption] = useLocalStorage<number>({ key: 'playerId', defaultValue: 0 })
  const [teamOption, setTeamOption, removeTeamOption] = useLocalStorage<string>({ key: 'teamId', defaultValue: '' })
  const [numberOfAtBatsOption, setNumberofAtBatsOption, removeNumberOfAtBatsOption] = useLocalStorage<number>({ key: 'numberOfAtBats', defaultValue: 10 }); // how many at bats to show
  // const [reverseOption, setReverseOption, removeReverseOption] = useLocalStorage<boolean>({ key: 'isReverse', defaultValue: false })
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

      filteredPitches = (plateAppearances || []).slice((numberOfAtBatsOption * -1));

      // if (reverseOption) {
      //   filteredPitches.reverse();
      // }

      setPitches(filteredPitches);
    }
  }, [numberOfAtBatsOption, plateAppearances]);

  const handleChangeTeam = React.useCallback((newTeamOption: string) => {
    setTeamOption(newTeamOption);
    setPitches([]);
    setPlayerOption(0);
  }, [setPlayerOption, setTeamOption]);

  const handleChangePlayer = React.useCallback((newPlayerOption: number) => {
    setPlayerOption(newPlayerOption);
    setPitches([]);
  }, [setPlayerOption]);

  function handleResetLocalStorage() {
    removePlayerOption();
    removeTeamOption();
    removeNumberOfAtBatsOption();
    setPitches([]);
    // removeReverseOption();
  }

  const handleChangeNumberOfPitches = React.useCallback((nopOption: number) => {
    setNumberofAtBatsOption(nopOption);
  }, [setNumberofAtBatsOption])

  // function handleReverseChange() {
  //   setReverseOption(!reverseOption);
  // }

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {isError && <p>{apiError?.message}</p>}
      {!isLoading && !isError &&
        <Grid container justifyContent="center" style={{ padding: 30 }} >
          <Grid container size={12} alignItems="center" sx={{ pb: 1 }}>
            <TeamsDropdown league={league} teamOption={teamOption} handleChangeTeam={handleChangeTeam} hideLabel sx={{ maxWidth: { xs: 150, sm: 175, lg: 240 } }} />
            <PlayersDropdown league={league} players={players || []} playerType={playerType} teamOption={teamOption} playerOption={playerOption} handleChangePlayer={handleChangePlayer} hideLabel sx={{ maxWidth: { xs: 150, sm: 175, lg: 240 } }} />
            <NumberOfPitchesDropdown nopOption={numberOfAtBatsOption} handleChangeNumberOfPitches={handleChangeNumberOfPitches} hideLabel />
            {/* <FormGroup sx={{ ml: 2 }}>
              <FormControlLabel control={<Switch size="small" onChange={handleReverseChange} checked={reverseOption} sx={{ mr: 1 }} />} disableTypography sx={{ fontSize: '0.85rem' }} label="Reverse" />
            </FormGroup> */}
            {notDesktop ?
              <Button variant="contained" sx={{ ml: 1 }}><RestartAlt /></Button>
              :
              <Button variant="contained" endIcon={<RestartAlt />} onClick={handleResetLocalStorage}>Reset</Button>
            }
          </Grid>
          <Grid size={12} sx={{ pb: 2 }}>
            <SessionDataTable pitches={pitches} showSeason />
          </Grid>
          <Grid container justifyContent="center" >
            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }} alignItems="center" justifyContent="center">
              <PitchSwingChart pitches={pitches} showMarkers />
            </Grid>
            {/* {!reverseOption &&
              <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }} alignItems="center" justifyContent="center" >
                <PitchByPlacementInInning pitches={pitches} />
              </Grid>
            } */}
            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }} alignItems="center" justifyContent="center">
              <PitchByPitchDelta pitches={pitches} showMarkers />
            </Grid>
            {/* {!reverseOption &&
              <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }} alignItems="center" justifyContent="center" >
                <PitchesByInning pitches={pitches} />
              </Grid>
            } */}
          </Grid>

        </Grid>
      }
    </>
  );
}