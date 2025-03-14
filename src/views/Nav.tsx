import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React from "react";
import CssBaseline from "@mui/material/CssBaseline/CssBaseline";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import useTheme from "@mui/material/styles/useTheme";
import Slide from "@mui/material/Slide";
import useScrollTrigger from "@mui/material/useScrollTrigger";

interface Props {
  window?: () => Window;
  children?: React.ReactElement<unknown>;
}

export default function Nav(props: Props) {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/'); // Navigate to the route
  };

  const handleMlrPitchersClick = () => {
    navigate('/mlrpitchers');
  };

  const handleMlrBattersClick = () => {
    navigate('/mlrbatters');
  };

  const handleMlrPitchersSeasonClick = () => {
    navigate('/mlrpitchersseason');
  };

  const handleMilrPitchersSeasonClick = () => {
    navigate('/milrpitchersseason');
  };

  const handleMilrBattersClick = () => {
    navigate('/milrbatters');
  };

  const handleMilrPitchersClick = () => {
    navigate('/milrpitchers');
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const notDesktop = useMediaQuery(theme.breakpoints.down('md'));

  // https://mui.com/material-ui/react-app-bar/#hide-app-bar
  function HideOnScroll(props: Props) {
    const { children, window } = props;

    const trigger = useScrollTrigger({
      target: window ? window() : undefined,
    });

    if (!isMobile) return children;

    return (
      <Slide appear={false} direction="down" in={!trigger}>
        {children ?? <div />}
      </Slide>
    );
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <HideOnScroll {...props}>
      <AppBar position="sticky" enableColorOnDark>
        <Toolbar variant={notDesktop ? 'dense' : 'regular'} sx={{
          justifyContent: 'space-between',
        }}>
          <Box>
            {isMobile ?
              <Typography onClick={handleLogoClick} variant="h5" sx={{ ml: 0.5, }}>CIN</Typography>
              :
              <Typography onClick={handleLogoClick} sx={{ flexGrow: 1 }} variant="h5">The Big Reddit Machine</Typography>
            }
          </Box>
          <Box sx={{
            justifyContent: { xs: 'center', sm: 'left', xl: 'right' },
          }}>
            <Button onClick={handleMlrBattersClick} color="inherit">Batters</Button>
            <Button onClick={handleMlrPitchersClick} color="inherit">Pitchers</Button>
            <Button onClick={handleMlrPitchersSeasonClick} color="inherit">
              {isMobile ? 'Pitch Stats' : 'Pitchers Season'}
            </Button>
            {
              ((window.location.href.includes('milr')) ?
                <>
                  ||
                  <Button onClick={handleMilrBattersClick} color="inherit">MILR Batters</Button>
                  <Button onClick={handleMilrPitchersClick} color="inherit">MILR Pitchers</Button>
                  <Button onClick={handleMilrPitchersSeasonClick} color="inherit">MILR Pitchers Season</Button>
                </>
                : '')
            }
          </Box>
        </Toolbar>
      </AppBar>
      </HideOnScroll>
    </React.Fragment>
  );
}