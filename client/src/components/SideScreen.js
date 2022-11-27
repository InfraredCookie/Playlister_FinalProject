import React, { Fragment, useContext, useEffect, useState } from 'react'
import { GlobalStoreContext } from '../store'

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import List from '@mui/material/List';

const SideScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const [sideView, setSideView] = useState("Player");
    const [comment, setComment] = useState("");

    const style = {
        width: 100,
        padding: 1.5, 
        margin: .5,
        fontSize: 12
    };

    function handleViewPlayer() {
        setSideView("Player");
    }

    function handleViewComments() {
        setSideView("Comments");
    }
    
    function handleComment() {
        setComment("");
    }

    function handleUpdateText(event) {
        setComment(event.target.value);
    }
    
    function handleKeyPress(event) {
        if (event.code === "Enter") {
            setComment("");
        }
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
                <Fragment>
                <Box>
                    {
                        comments
                    }
                </Box>
                </Fragment>
            )
        }
    }

    let comments = "";
    if (store.currentList !== null && store.currentList.isPublished) {
        comments = 
            <List sx={{ width: '90%', left: '5%' }}>
            {
                store.currentList.comments.map((comment) => (
                    comment.author + comment.comment
                ))
            }
            </List>;
    }

    function handleCommentField() {
        if(sideView === "Comments") {
            return (
                <TextField 
                    id="comment-field" 
                    label="Comment"
                    variant="filled"
                    fullWidth
                    onKeyPress={handleKeyPress}
                    onChange={handleUpdateText}
                    value={comment}
                    InputProps={{
                        endAdornment: (
                            <IconButton 
                                position="end"
                                style={{color: '#1976d2'}}
                            >
                                <SendIcon/>
                            </IconButton>
                        )
                    }} 
                />
            )
        }
    }

    return (
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
            <div id="sidescreem-footer">
                {handleCommentField()}
            </div>
        </div>
    )
}

export default SideScreen;