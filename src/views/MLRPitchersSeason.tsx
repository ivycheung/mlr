import * as React from 'react';

import { FormSchemaPitches } from '../types/schemas/pitches-schema';

import { useGetPlayer } from '../api/use-get-player';
import { useGetPlayers } from '../api/use-get-players';
import useRefetchQuery from '../api/use-refetch-query';

import SessionDataTable from '../components/SessionDataTable';
import TeamsDropdown from '../components/TeamsDropdown';
import PlayersDropdown from '../components/PlayersDropdown';
import SeasonsDropdown from '../components/SeasonsDropdown';
import HistogramPitchChart from '../components/HistogramPitchChart';
// import HistogramDeltaChartByResult from '../components/HistogramDeltaChartByResult';
// import HistogramPitchChartByResult from '../components/HistogramPitchChartByResult';

import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid2';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import blueGrey from '@mui/material/colors/blueGrey';
import useTheme from '@mui/material/styles/useTheme';
import useMediaQuery from '@mui/material/useMediaQuery';
import RestartAlt from '@mui/icons-material/RestartAlt';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';

import { useLocalStorage } from '@mantine/hooks';
// import useGoogleAnalytics from '../hooks/google-analytics';
import HeatmapPitchChart from '../components/HeatmapPitchChart';
import HeatmapPitchDeltaChart from '../components/HeatmapPitchDeltaChart';

export default function MLRPitchers() {
  const [pitches, setPitches] = React.useState<FormSchemaPitches>([])
  const [playerOption, setPlayerOption, removePlayerOption] = useLocalStorage<number>({ key: 'playerId', defaultValue: 0 })
  const [teamOption, setTeamOption, removeTeamOption] = useLocalStorage<string>({ key: 'teamId', defaultValue: '' })
  const [seasonOption, setSeasonOption] = React.useState<number>(0)
  const [careerOption, setCareerOption] = React.useState(false);
  const [showSeason, setShowSeason] = React.useState<boolean>(false);
  const league = 'mlr';
  const playerType = 'pitching';

  // Get a list of players on page load
  const { data: players, isLoading: isLoading, isError: isError, error: apiError } = useGetPlayers();
  const { data: plateAppearances } = useGetPlayer(playerType, league, playerOption);
  const handleRefreshPlayer = useRefetchQuery(['player']);

  const theme = useTheme();
  const notDesktop = useMediaQuery(theme.breakpoints.down('md'));

  // useGoogleAnalytics("MLR Pitchers Seasons");

  // Seasons
  React.useEffect(() => {
    if (Array.isArray(players) && players.length != 0 && plateAppearances !== undefined && plateAppearances.length != 0) {
      // filter the pitches based on season
      let filteredPitches: FormSchemaPitches = []
      if (!careerOption) {
        filteredPitches = (plateAppearances || []).filter(e => e.season === seasonOption);
      }
      else {
        filteredPitches = plateAppearances;
      }

      setPitches(filteredPitches);
    }
  }, [careerOption, plateAppearances, players, seasonOption])

  const handleChangeSeason = React.useCallback((newSeasonOption: number) => {
    setSeasonOption(newSeasonOption);
  }, []);

  async function handleCareerStatsChange(_event: React.ChangeEvent<HTMLInputElement>, checked: boolean) {
    setCareerOption(checked);
    setShowSeason(checked);
  }

  const handleChangeTeam = React.useCallback((newTeamOption: string) => {
    setTeamOption(newTeamOption);
    setPlayerOption(0);
    setSeasonOption(0);
    setPitches([]);
  }, [setPlayerOption, setTeamOption]);

  const handleChangePlayer = React.useCallback((newPlayerOption: number) => {
    setPlayerOption(newPlayerOption);
    setSeasonOption(0);
    setPitches([]);
  }, [setPlayerOption]);

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
            <TeamsDropdown league={league} teamOption={teamOption} handleChangeTeam={handleChangeTeam} sx={{ maxWidth: { xs: 150, sm: 175, lg: 240 } }} />
            <PlayersDropdown league={league} players={players || []} playerType={playerType} teamOption={teamOption} playerOption={playerOption} handleChangePlayer={handleChangePlayer} sx={{ maxWidth: { xs: 150, sm: 175, lg: 240 } }} />
            <SeasonsDropdown seasonOption={seasonOption} plateAppearances={plateAppearances || []} handleChangeSeason={handleChangeSeason} sx={{ minWidth: { xs: 70, lg: 175 } }} />
            <FormControl >
              <FormGroup aria-label="position" row>
                <FormControlLabel disableTypography control={<Android12Switch onChange={handleCareerStatsChange} checked={careerOption} />} label={<Typography sx={{ fontSize: 12, fontWeight: 600, mb: '-5px' }}>
                  Career
                </Typography>} labelPlacement="top" />
              </FormGroup>
            </FormControl>
            {notDesktop ?
              <><Button variant="contained" onClick={handleRefreshPlayer} sx={{ ml: 1 }} ><AutorenewIcon /></Button><Button variant="contained" sx={{ ml: 1 }} onClick={handleResetLocalStorage}><RestartAlt /></Button></>
              :
              <><Button variant="contained" onClick={handleRefreshPlayer} sx={{ ml: 1 }}>Refresh</Button><Button variant="contained" onClick={handleResetLocalStorage} sx={{ ml: 1 }}>Reset</Button></>
            }
          </Grid>
          {
            ((!pitches || pitches.length != 0) ?
              <Grid size={{ xs: 12 }} sx={{
                justifyContent: "flex-start",
                alignItems: "center"
              }}>
                <Accordion style={{ maxHeight: '500px' }} >
                  <AccordionSummary
                    expandIcon={<ArrowDropDownIcon />}
                    aria-controls="panel2-content"
                    id="panel2-header"
                    sx={
                      [
                        (theme) =>
                          theme.applyStyles('light', {
                            backgroundColor: blueGrey[50]
                          }),]
                    }
                  >
                    <Typography component="span">Data Table</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <SessionDataTable pitches={pitches} showSeason={showSeason} />
                  </AccordionDetails>
                </Accordion>
              </Grid>
              : '')
          }
          <Grid container spacing={2} size={{ xs: 12 }}
            sx={{
              justifyContent: "flex-start",
              alignItems: "center",
              pt: 3
            }}>
            <Grid size={{ xs: 12, lg: 6 }} >
              <HistogramPitchChart pitches={pitches} />
            </Grid>
            <Grid size={{ xs: 6, lg: 3 }} alignItems="center" justifyContent="center">
              <HeatmapPitchChart pitches={pitches} />
            </Grid>
            <Grid size={{ xs: 6, lg: 3 }} alignItems="center" justifyContent="center">
              <HeatmapPitchDeltaChart pitches={pitches} />
            </Grid>
            {/* <Grid size={{ xs: 12, lg: 6 }} alignItems="center" justifyContent="center">
              <HistogramDeltaChartByResult pitches={pitches} />
            </Grid> */}
          </Grid>
          {/* <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }} alignItems="center" justifyContent="center">
              <PitchByPitchDelta pitches={pitches} />
            </Grid>
            <Grid size={{ xs: 12, sm: 12, md: 12, lg: 6 }} alignItems="center" justifyContent="center" >
                <PitchesByInning pitches={pitches} />
            </Grid> */}
        </Grid>
      }
    </>
  );
}

const Android12Switch = styled(Switch)(() => ({
  padding: 8,
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    '&::before, &::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16,
    },
    // '&::before': {
    //   backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
    //     theme.palette.getContrastText(theme.palette.primary.main),
    //   )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
    //   left: 12,
    // },
    // '&::after': {
    //   backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
    //     theme.palette.getContrastText(theme.palette.primary.main),
    //   )}" d="M19,13H5V11H19V13Z" /></svg>')`,
    //   right: 12,
    // },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2,
  },
}));