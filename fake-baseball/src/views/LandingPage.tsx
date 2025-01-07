import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import { Navigate, useNavigate } from 'react-router-dom';

export default function LandingPage() {
    const navigate = useNavigate();

    const handleFCBClick = () => {
        navigate('/r-slash-fake-baseball/fcb'); // Navigate to the '/about' route
    };
    const handleMLRClick = () => {
        navigate('/r-slash-fake-baseball/mlr'); // Navigate to the '/about' route
    };
    return(
        <Grid container justifyContent="center" spacing={3}>
            <Grid size={6} alignItems="center" justifyContent="center">
                <Button variant="text" size="small" style={{display: "flex", flexDirection: "column"}} onClick={handleFCBClick}>
                    <img src="https://images.unsplash.com/photo-1529768167801-9173d94c2a42?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" width={document.documentElement.clientWidth * 0.40} alt="folder"/>
                    <h2>Fake College Baseball</h2>
                </Button>
            </Grid>
            <Grid size={6} alignItems="center" justifyContent="center">
                <Button variant="text" size="small" style={{display: "flex", flexDirection: "column"}} onClick={handleMLRClick}>
                    <img src="https://images.unsplash.com/photo-1583841609634-ce903c6c1a49?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" width={document.documentElement.clientWidth * 0.40} alt="folder"/>
                    <h2>Major League Redditball</h2>
                </Button>
            </Grid>
        </Grid>
    )
}