import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import { useNavigate } from 'react-router-dom';

export default function FCB() {
    const navigate = useNavigate();

    const handlePitcherClick = () => {
        navigate('/r-slash-fake-baseball/fcb/pitchers'); // Navigate to the '/pitchers' route
    };
    const handleBatterClick = () => {
        navigate('/r-slash-fake-baseball/fcb/batters'); // Navigate to the '/batters' route
    };
    return(
        <Grid container justifyContent="center" spacing={3}>
            <Grid size={6} alignItems="center" justifyContent="center">
                <Button variant="text" size="small" style={{display: "flex", flexDirection: "column"}} onClick={handlePitcherClick}>
                    <img 
                        src="https://images.unsplash.com/photo-1524626795941-2c5338f1666f?q=80&w=2500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                        width={document.documentElement.clientWidth * 0.40} 
                        height={document.documentElement.clientHeight * 0.50} 
                        alt="pitcher"/>
                    <h2>PITCHERS</h2>
                </Button>
            </Grid>
            <Grid size={6} alignItems="center" justifyContent="center">
                <Button variant="text" size="small" style={{display: "flex", flexDirection: "column"}} onClick={handleBatterClick}>
                    <img 
                        src="https://images.unsplash.com/photo-1624375664562-fff61869fe8f?q=80&w=3431&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                        width={document.documentElement.clientWidth * 0.40} 
                        height={document.documentElement.clientHeight * 0.50} 
                        alt="batter"/>
                    <h2>BATTERS</h2>
                </Button>
            </Grid>
        </Grid>
    )
}