import { Fragment, useContext } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth';
import { Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab'

/*
    Our Status bar React component goes at the bottom of our UI.
    
    @author McKilla Gorilla
*/
function Statusbar() {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);

    function handleCreateNewList() {
        store.createNewList();
    }

    function getAddIcon(){
        if(auth.loggedIn && store.currentView === "HOME") {
            return(
                <Fragment>
                    <Fab 
                    color="primary" 
                    aria-label="add"
                    id="add-list-button"
                    onClick={handleCreateNewList}
                    >
                        <AddIcon />
                    </Fab>
                    <Typography variant="h4" sx={{p: 1}}>Add List</Typography>
                </Fragment>
            )
        } else if(auth.user === "GUEST") {
            return (
                <Typography variant="h4" sx={{p: 1}}>Guest Mode</Typography>
            )
        }
    }

    return (
        <div id="playlister-statusbar">
            {getAddIcon()}
        </div>
    );
}

export default Statusbar;