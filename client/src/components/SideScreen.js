import React, { Fragment, useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import List from '@mui/material/List';
import YouTubePlayer from './YouTubePlayer';

const SideScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
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
        if (store.currentList !== null && store.currentList.isPublished ) {
            store.comment(comment);
        }
        setComment("");
    }

    function handleUpdateText(event) {
        setComment(event.target.value);
    }
    
    function handleKeyPress(event) {
        if (event.code === "Enter") {
            handleComment();
        }
    }

    function handleSidescreen() {
        if(sideView === "Player") {
            return (
                <Fragment>
                <Box>
                    {player}
                </Box>
                </Fragment>
            )
        }
        if(sideView === "Comments") {
            return (
                <Fragment>
                <Box>
                    {comments}
                </Box>
                </Fragment>
            )
        }
    }

    let comments = "";
    let index = 0
    if (store.currentList !== null && store.currentList.isPublished) {
        comments = 
            <List sx={{ width: '90%', left: '5%' }}>
            {
                store.currentList.comments.map((comment) => (
                    <div
                        key={'comment-' + index}
                        id={'song-' + index++ + '-card'}
                        className='comment-card'
                    >
                        <u>{comment.author}</u> <br/>
                        {(comment.comment === "pogg") ? <img src="/pogg.webp" alt="pogg"/> :
                        (comment.comment === "pepeD") ? <img src="/pepeD.webp" alt="pepeD"/> :
                        (comment.comment === "muted") ? <img src="/muted.webp" alt="muted"/> :
                        (comment.comment === "catJAM") ? <img src="/catJAM.webp" alt="catJAM"/> :
                        (comment.comment === "ratJAM") ? <img src="/ratJAM.webp" alt="ratJAM"/> :
                        comment.comment }
                    </div>
                ))
            }
            </List>;
    } else if (store.currentList !== null) {
        comments = 
        <List sx={{ width: '90%', left: '5%' }}> 
            <div
                key={'comment-' + index}
                id={'song-' + index++ + '-card'}
                className='comment-card-unpublished'
            >
                Cannot comment on unpublished list
            </div>
        </List>;
    } else {
        comments = 
        <List sx={{ width: '90%', left: '5%' }}> 
            <div
                key={'comment-' + index}
                id={'song-' + index++ + '-card'}
                className='comment-card-unpublished'
            >
                Select a list!
            </div>
        </List>;
    }

    let player = ""
    if (store.currentList !== null && store.currentList.songs.length > 0) {
        player = <YouTubePlayer />
    } else if (store.currentList !== null) {
        player = 
            <List sx={{ width: '90%', left: '5%' }}> 
                <div
                    key={'comment-' + index}
                    id={'song-' + index++ + '-card'}
                    className='comment-card-unpublished'
                >
                    No Songs!
                </div>
            </List>
    } else {
        player = 
            <List sx={{ width: '90%', left: '5%' }}> 
                <div
                    key={'comment-' + index}
                    id={'song-' + index++ + '-card'}
                    className='comment-card-unpublished'
                >
                    Select a list!
                </div>
            </List>
    }


    function handleCommentField() {
        if(sideView === "Comments" && store.currentList !== null && store.currentList.isPublished && auth.user !== "GUEST") {
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
                                onClick={handleComment}
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