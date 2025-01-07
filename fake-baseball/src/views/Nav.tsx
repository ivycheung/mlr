import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import './Nav.css'
import baseball from '../assets/baseball.png'

export default function Nav() {
    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate('/r-slash-fake-baseball'); // Navigate to the '/pitchers' route
    };
    
    return (
        <div className="navbarContainer">
            <Button variant="text" size="small" onClick={handleLogoClick}>
                <img 
                    src={baseball}
                    alt="pitcher"
                    height={50}
                    width={50}
                />
            </Button>
        </div>
    )
}