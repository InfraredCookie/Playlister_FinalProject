import React, { useContext, useEffect, useState } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'

import List from '@mui/material/List';
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button';
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const [sideView, setSideView] = useState("");

    const style = {
        width: 100,
        padding: 1.5, 
        margin: .5,
        fontSize: 12
    };

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

    function handleViewPlayer() {
        setSideView("Player");
    }


    function handleViewComments() {
        setSideView("Comments");
    }


    function handleSidescreen() {
        if(sideView === "Player") {
            return (
                <div>
                    "Player"
                </div>
            )
        }
        if(sideView === "Comments") {
            return (
                <div>
                    "Comments"
                </div>
            )
        }
        return(<div></div>);
    }

    let listCard = "";
    if (store) {
        listCard = 
            <List sx={{ width: '90%', left: '5%' }}>
            {
                store.idNamePairs.map((pair) => (
                    <ListCard
                        key={pair._id}
                        idNamePair={pair}
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
            </div>
            <div id="sidescreen">
                <div id="sidescreen-buttons">
                    <Button variant="contained"
                        id="dialog-no-button"
                        className="modal-button"
                        sx={style}
                        onClick={handleViewPlayer}
                    >
                        Player
                    </Button>
                    <Button variant="contained"
                        id="dialog-no-button"
                        className="modal-button"
                        sx={style}
                        onClick={handleViewComments}
                    >
                        Comments
                    </Button>
                </div>
                <div id="sidescreen-main">
                    {handleSidescreen()}
                </div>
            </div>
        </div>
    )
}

export default HomeScreen;