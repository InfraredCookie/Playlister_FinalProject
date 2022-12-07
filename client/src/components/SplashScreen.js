import Button from '@mui/material/Button'
import { useContext } from 'react'
import AuthContext from '../auth';
const style = {
    width: 200,
    padding: 1, 
    margin: 2,
    backgroundColor: "#ffffff",
    color: "#000000"
};

export default function SplashScreen() {
    const { auth } = useContext(AuthContext);

    function handleGuest() {
        auth.guest();
    }

    return (
        <div id="splash-screen">
            <img src="/playlister.png" />
            <div id="splash-screen-title">
                Welcome to the Playlister application!
            </div>
            <div id="splash-screen-body">
                Create, share, rate, and more!
            </div>
            <div id="splash-screen-buttons">
                <Button variant="contained"
                    id="dialog-no-button"
                    className="modal-button"
                    sx={style}
                    href="/login/"
                >
                    Login
                </Button>
                <Button variant="contained"
                    id="dialog-no-button"
                    className="modal-button"
                    sx={style}
                    href="/register/"
                >
                    Register
                </Button>
                <Button variant="contained"
                    id="dialog-no-button"
                    className="modal-button"
                    sx={style}
                    onClick={handleGuest}
                >
                    Continue As Guest
                </Button>
            </div>
        </div>
    )
}