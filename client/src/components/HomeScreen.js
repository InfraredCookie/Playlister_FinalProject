import React, { useContext, useEffect, useState } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'

import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab'
import List from '@mui/material/List';
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button';
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const [view, setView] = useState("");

    const style = {
        width: 100,
        padding: 1.5, 
        margin: .5,
        fontSize: 12
    };

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    function handleCreateNewList() {
        store.createNewList();
    }

    function handleViewPlayer() {
        setView("Player");
    }


    function handleViewComments() {
        setView("Comments");
    }


    function handleSidescreen() {
        if(view === "Player") {
            return (
                <div>
                    "Player"
                </div>
            )
        }
        if(view === "Comments") {
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
            <Fab 
                color="primary" 
                aria-label="add"
                id="add-list-button"
                onClick={handleCreateNewList}
            >
                <AddIcon />
            </Fab>
                <Typography variant="h2">Your Lists</Typography>
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