import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

export default function Nav() {
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

  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} onClick={handleLogoClick}>
          Fake Baseball
        </Typography>
        <Button onClick={handleMlrBattersClick} color="inherit">MLR Batters</Button>
        <Button onClick={handleMlrPitchersClick} color="inherit">MLR Pitchers</Button>
        <Button onClick={handleMlrPitchersSeasonClick} color="inherit">MLR Pitchers Season</Button>
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

      </Toolbar>
    </AppBar>
  );
}