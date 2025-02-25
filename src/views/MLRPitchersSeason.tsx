import * as React from 'react';

import { FormSchemaPitches } from '../types/schemas/pitches-schema';

import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid2';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import HistogramChart from '../components/HistogramChart';
import FormGroup from '@mui/material/FormGroup';
// import Slider from '@mui/material/Slider';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import SessionDataTable from '../components/SessionDataTable';
import Typography from '@mui/material/Typography';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useGetPlayers } from '../api/use-get-players';
import blueGrey from '@mui/material/colors/blueGrey';
import { useGetPlayer } from '../api/use-get-player';
import TeamsDropdown from '../components/TeamsDropdown';
import PlayersDropdown from '../components/PlayersDropdown';
import SeasonsDropdown from '../components/SeasonsDropdown';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import WorkOutlinedIcon from '@mui/icons-material/WorkOutlined';
import useTheme from '@mui/material/styles/useTheme';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function MLRPitchers() {
  const [pitches, setPitches] = React.useState<FormSchemaPitches>([])
  const [playerOption, setPlayerOption] = React.useState<number>(0);
  const [teamOption, setTeamOption] = React.useState('')
  const [seasonOption, setSeasonOption] = React.useState<number>(0)
  const [careerOption, setCareerOption] = React.useState(false);
  const [showSeason, setShowSeason] = React.useState<boolean>(false);
  const league = 'mlr';
  const playerType = 'pitching';

  // Get a list of players on page load
  const { data: players, isLoading: isLoading, isError: isError, error: apiError } = useGetPlayers();
  const { data: plateAppearances } = useGetPlayer(playerType, league, playerOption);

  const theme = useTheme();
  const notDesktop = useMediaQuery(theme.breakpoints.down('md'));

  // Seasons
  React.useEffect(() => {
    if (Array.isArray(players) && players.length != 0 && plateAppearances !== undefined && plateAppearances.length != 0) {
      // filter the pitches based on season
      let filteredPitches: FormSchemaPitches = []
      if (!careerOption) {
        filteredPitches = plateAppearances.filter(e => {
          if (e.season == seasonOption) {
            return true;
          }
        });
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
  }, []);

  const handleChangePlayer = React.useCallback((newPlayerOption: number) => {
    setPlayerOption(newPlayerOption);
    setSeasonOption(0);
    setPitches([]);
  }, []);

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {isError && <p>{apiError?.message}</p>}
      {!isLoading && !isError &&
        <Grid container style={{ padding: 30 }} size={12} direction="row"
          sx={{
            justifyContent: "flex-start",
            alignItems: "center"
          }}
        >
          <Grid>
            <TeamsDropdown league={league} teamOption={teamOption} handleChangeTeam={handleChangeTeam} />
            <PlayersDropdown league={league} players={players || []} playerType={playerType} teamOption={teamOption} playerOption={playerOption} handleChangePlayer={handleChangePlayer} />
            <SeasonsDropdown seasonOption={seasonOption} plateAppearances={plateAppearances || []} handleChangeSeason={handleChangeSeason} sx={{ minWidth: { xs: 70, lg: 175 } }} />
            <FormControl sx={{ height: '100%' }}>
              <FormGroup aria-label="position" row sx={{ ml: 2, minWidth: { xs: 50, lg: 150 }, minHeight: 75 }}>
                {notDesktop ?
                  <FormControlLabel label="" labelPlacement="end"
                    control={<Checkbox onChange={handleCareerStatsChange} icon={<WorkOutlineOutlinedIcon fontSize={'large'} />} checkedIcon={<WorkOutlinedIcon fontSize={'large'} />} />}
                  />
                  :
                  <FormControlLabel control={<Checkbox size="small" onChange={handleCareerStatsChange} />} label="Career Stats" labelPlacement="end" />
                }
              </FormGroup>
            </FormControl>
          </Grid>
          {
            ((!pitches || pitches.length != 0) ?
              <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }} sx={{
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
          <Grid container spacing={2} style={{ padding: 30 }} size={{ xs: 12 }}
            sx={{
              justifyContent: "flex-start",
              alignItems: "center"
            }}>
            <Grid size={{ xs: 12, lg: 6 }} >
              <HistogramChart pitches={pitches} />
            </Grid>
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