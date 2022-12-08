import React, { useContext, useEffect } from 'react'
import AuthContext from '../auth'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'
import MUIEditSongModal from './MUIEditSongModal'
import MUIRemoveSongModal from './MUIRemoveSongModal'
import MUINameErrorModal from './MUINameErrorModal'
import SideScreen from './SideScreen'

import List from '@mui/material/List';
import Typography from '@mui/material/Typography'

/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);

    let modalJSX = "";
    if (store.isEditSongModalOpen()) {
        modalJSX = <MUIEditSongModal />;
    }
    else if (store.isRemoveSongModalOpen()) {
        modalJSX = <MUIRemoveSongModal />;
    }
    else if (store.isNameErrorModalOpen()) {
        modalJSX = <MUINameErrorModal />;
    }

    function getHomeView() {
        if(store.currentView === "HOME"){
            return("Home")
        }
        if(store.currentView === "ALL"){
            return("All Lists")
        }
        if(store.currentView === "USERS"){
            return("Seach By User")
        }
    }

    useEffect(() => {
        if (auth.user === "GUEST") {
            store.loadPublishedIdNamePairs("ALL");
        } else {
            store.loadIdNamePairs();
        }
    }, []);

    let listCard = "";
    if (store) {
        listCard = 
            <List sx={{ width: '90%', left: '5%' }}>
            {
                store.currentViewPlaylists.map((pair) => (
                    <ListCard
                        key={pair._id}
                        pair={pair}
                    />
                ))
            }
            </List>;
    }
    return (
        <div id="playlist-selector">
            <div id="list-selector-heading">
                <Typography variant="h2">{getHomeView()}</Typography>
            </div>
            <div id="list-selector-list">
                {
                    listCard
                }
                <MUIDeleteModal />
                { modalJSX }
            </div>
            {
                <SideScreen />
            }
        </div>
    )
}

export default HomeScreen;