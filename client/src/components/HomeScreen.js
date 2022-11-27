import React, { Fragment, useContext, useEffect, useState } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'
import MUIEditSongModal from './MUIEditSongModal'
import MUIRemoveSongModal from './MUIRemoveSongModal'
import SideScreen from './SideScreen'

import List from '@mui/material/List';
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button';
import apis from '../store/store-request-api';
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);

    let modalJSX = "";
    if (store.isEditSongModalOpen()) {
        modalJSX = <MUIEditSongModal />;
    }
    else if (store.isRemoveSongModalOpen()) {
        modalJSX = <MUIRemoveSongModal />;
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
        store.loadIdNamePairs();
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
                        selected={false}
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