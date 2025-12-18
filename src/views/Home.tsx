import * as React from 'react'

import { FormSchemaPitches } from '../types/schemas/pitches-schema';

import { useGetPlayers } from '../api/use-get-players';
import { useGetPlayer } from '../api/use-get-player';
import useRefetchQuery from '../api/use-refetch-query';

import PitchSwingChart from '../components/PitchSwingChart';
import SessionDataTable from '../components/SessionDataTable';
// import PitchByPlacementInInning from '../components/PitchByPlacementInInning';
import PitchByPitchDelta from '../components/PitchByPitchDelta';
// import PitchesByInning from '../components/PitchesByInning';
import TeamsDropdown from '../components/TeamsDropdown';
import PlayersDropdown from '../components/PlayersDropdown';
import HistogramPitchChart from '../components/HistogramPitchChart';
import NumberOfPitchesDropdown from '../components/NumberOfPitchesDropdown';
// import useGoogleAnalytics from '../hooks/google-analytics';

import Grid from '@mui/material/Grid2';
import Button from '@mui/material/Button';
import RestartAlt from '@mui/icons-material/RestartAlt';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import useTheme from '@mui/material/styles/useTheme';
import useMediaQuery from '@mui/material/useMediaQuery';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

import { useLocalStorage } from '@mantine/hooks';
import HeatmapNextPitchChart from '../components/HeatmapNextPitchChart';
import HeatmapPitchChart from '../components/HeatmapPitchChart';
import HeatmapPitchDeltaChart from '../components/HeatmapPitchDeltaChart';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export default function Home() {
  const [pitches, setPitches] = React.useState<FormSchemaPitches>([])
  const [filteredPitches, setFilteredPitches] = React.useState<FormSchemaPitches>([])
  const [playerOption, setPlayerOption, removePlayerOption] = useLocalStorage<number>({ key: 'playerId', defaultValue: 0 })
  const [teamOption, setTeamOption, removeTeamOption] = useLocalStorage<string>({ key: 'teamId', defaultValue: '' })
  const [numberOfAtBatsOption, setNumberofAtBatsOption, removeNumberOfAtBatsOption] = useLocalStorage<number>({ key: 'numberOfAtBats', defaultValue: 10 }); // how many at bats to show
  const [tabOption, setTabOption, removeTabOption] = useLocalStorage<number>({ key: 'tabOption', defaultValue: 0 })
  const league = 'mlr';
  const playerType = 'pitching';

  // Get a list of players on page load
  const { data: players, isLoading: isLoading, isError: isError, error: apiError } = useGetPlayers();
  const { data: plateAppearances } = useGetPlayer(playerType, league, playerOption);
  const handleRefreshPlayer = useRefetchQuery(['player']);
  // useGoogleAnalytics("Home");

  const theme = useTheme();
  const notDesktop = useMediaQuery(theme.breakpoints.down('md'));

  // Seasons
  React.useEffect(() => {
    if (plateAppearances !== undefined && plateAppearances.length != 0) {
      // filter the pitches based on season + session
      let filteredPitches: FormSchemaPitches = [];

      setPitches(plateAppearances);

      filteredPitches = (plateAppearances || []).slice((numberOfAtBatsOption * -1));

      setFilteredPitches(filteredPitches);
    }
  }, [numberOfAtBatsOption, plateAppearances]);

  const handleChangeTeam = React.useCallback((newTeamOption: string) => {
    setTeamOption(newTeamOption);
    setPitches([]);
    setFilteredPitches([]);
    setPlayerOption(0);
  }, [setPlayerOption, setTeamOption]);

  const handleChangePlayer = React.useCallback((newPlayerOption: number) => {
    setPlayerOption(newPlayerOption);
    setPitches([]);
    setFilteredPitches([]);
  }, [setPlayerOption]);

  const handleResetLocalStorage = function () {
    removePlayerOption();
    removeTeamOption();
    removeNumberOfAtBatsOption();
    removeTabOption();
    setPitches([]);
    setFilteredPitches([]);
  }

  const handleChangeNumberOfPitches = React.useCallback((nopOption: number) => {
    setNumberofAtBatsOption(nopOption);
  }, [setNumberofAtBatsOption])

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabOption(newValue);
  };

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {isError && <p>{apiError?.message}</p>}
      {!isLoading && !isError &&
        <Grid container justifyContent="center" style={{ padding: 30 }} >
          <Grid container size={12} alignItems="center" sx={{ pb: 1 }}>
            <TeamsDropdown league={league} teamOption={teamOption} handleChangeTeam={handleChangeTeam} sx={{ maxWidth: { xs: 150, sm: 175, lg: 240 } }} />
            <PlayersDropdown league={league} players={players || []} playerType={playerType} teamOption={teamOption} playerOption={playerOption} handleChangePlayer={handleChangePlayer} hideLabel sx={{ maxWidth: { xs: 150, sm: 175, lg: 240 } }} />
            <NumberOfPitchesDropdown nopOption={numberOfAtBatsOption} handleChangeNumberOfPitches={handleChangeNumberOfPitches} hideLabel />
            {notDesktop ?
              <><Button variant="contained" onClick={handleRefreshPlayer} sx={{ ml: 1 }} ><AutorenewIcon /></Button><Button variant="contained" sx={{ ml: 1 }} onClick={handleResetLocalStorage}><RestartAlt /></Button></>
              :
              <><Button variant="contained" onClick={handleRefreshPlayer} sx={{ ml: 1 }}>Refresh</Button><Button variant="contained" onClick={handleResetLocalStorage} sx={{ ml: 1 }}>Reset</Button></>
            }
          </Grid>
          <Grid size={12} sx={{ pb: 2 }}>
            <SessionDataTable pitches={filteredPitches} showSeason />
          </Grid>
          {pitches && pitches.length > 0 &&
            <Box sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabOption} onChange={handleTabChange} aria-label="Tabs">
                  <Tab label="One" {...a11yProps(0)} />
                  <Tab label="Two" {...a11yProps(1)} />
                  <Tab label="Career" {...a11yProps(2)} />
                </Tabs>
              </Box>
              <CustomTabPanel value={tabOption} index={0}>
                <Grid container justifyContent="center">
                  <Grid size={{ xs: 12, lg: 6 }} alignItems="center" justifyContent="center">
                    <PitchSwingChart pitches={filteredPitches} showMarkers />
                  </Grid>
                  <Grid size={{ xs: 12, lg: 6 }} alignItems="center" justifyContent="center">
                    <PitchByPitchDelta pitches={filteredPitches} showMarkers />
                  </Grid>
                </Grid>
              </CustomTabPanel>
              <CustomTabPanel value={tabOption} index={1}>
                <Grid container justifyContent="center">
                  <Grid size={{ xs: 12, lg: 6 }} alignItems="center" justifyContent="center">
                    <HistogramPitchChart pitches={filteredPitches} />
                  </Grid>
                </Grid>
              </CustomTabPanel>
              <CustomTabPanel value={tabOption} index={2}>
                <Grid container justifyContent="center"spacing={1}>
                  <Grid size={{ xs: 6, lg: 3 }} alignItems="center" justifyContent="center">
                    <HeatmapNextPitchChart pitches={pitches} />
                  </Grid>
                  <Grid size={{ xs: 6, lg: 3 }} alignItems="center" justifyContent="center">
                    <HeatmapPitchChart pitches={pitches} />
                  </Grid>
                </Grid>
              </CustomTabPanel>
            </Box>
          }
        </Grid>
      }
    </>
  );
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}