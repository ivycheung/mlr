import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

export default function Nav() {
    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate('/mlr'); // Navigate to the  route
    };

    const handleMlrPitchersClick = () => {
        navigate('/mlr/pitchers');
    };

    const handleMlrBattersClick = () => {
        navigate('/mlr/batters');
    };
    
    return (
        <AppBar position="fixed">
            <Toolbar>
            <Typography variant="h6" component="div" sx={{flexGrow: 1}} onClick={handleLogoClick}>
                Fake Baseball
            </Typography>
            <Button onClick={handleMlrPitchersClick} color="inherit">MLR Pitchers</Button>
            <Button onClick={handleMlrBattersClick} color="inherit">MLR Batters</Button>
            </Toolbar>
        </AppBar>
    );
}