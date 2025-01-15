import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

export default function Nav() {
    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate('/r-slash-fake-baseball'); // Navigate to the  route
    };

    const handleFcbPitchersClick = () => {
        navigate('/r-slash-fake-baseball/fcb/pitchers');
    };

    const handleFcbBattersClick = () => {
        navigate('/r-slash-fake-baseball/fcb/batters');
    };
    
    return (
        <AppBar position="fixed">
            <Toolbar>
            <Typography variant="h6" component="div" sx={{flexGrow: 1}} onClick={handleLogoClick}>
                Fake Baseball
            </Typography>
            <Button onClick={handleFcbPitchersClick} color="inherit">FCB Pitchers</Button>
            <Button onClick={handleFcbBattersClick} color="inherit">FCB Batters</Button>
            </Toolbar>
        </AppBar>
    );
}