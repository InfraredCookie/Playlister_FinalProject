import React, { Fragment } from 'react';
import YouTube from 'react-youtube';
import { useContext, useState } from 'react'
import GlobalStoreContext from '../store';
import Box from '@mui/material/Box';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import FastForwardIcon from '@mui/icons-material/FastForward';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import IconButton from '@mui/material/IconButton';
import PauseIcon from '@mui/icons-material/Pause';

export default function YouTubePlayer() {
    // THIS EXAMPLE DEMONSTRATES HOW TO DYNAMICALLY MAKE A
    // YOUTUBE PLAYER AND EMBED IT IN YOUR SITE. IT ALSO
    // DEMONSTRATES HOW TO IMPLEMENT A PLAYLIST THAT MOVES
    // FROM ONE SONG TO THE NEXT
    const { store } = useContext(GlobalStoreContext);
    const [player, setPlayer] = useState(null);
    const [status, setStatus] = useState(-2);
    const [currentSong, setCurrentSong] = useState(0);
    const [prevList, setPrevList] = useState([]);

    // THIS HAS THE YOUTUBE IDS FOR THE SONGS IN OUR PLAYLIST

    let playlist = [];

    if(store.currentList !== null) {
        playlist = store.currentList.songs;
    }

    if(prevList !== playlist) {
        if(player) {
            player.stopVideo()
            player.playVideo()
        }
        setCurrentSong(0);
        setPrevList(playlist);
    }  


    // THIS IS THE INDEX OF THE SONG CURRENTLY IN USE IN THE PLAYLIST
    //let currentSong = 0;
    
    const playerOptions = {
        height: '360',
        width: '640',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 1,
            start: 0
        },
    };

    // THIS FUNCTION LOADS THE CURRENT SONG INTO
    // THE PLAYER AND PLAYS IT
    function loadAndPlayCurrentSong(player) {
        let song = playlist[currentSong].youTubeId;
        player.loadVideoById(song);
        player.playVideo();
    }

    // THIS FUNCTION INCREMENTS THE PLAYLIST SONG TO THE NEXT ONE
    function incSong() {
        setCurrentSong(currentSong+1);
        //setCurrentSong(currentSong % playlist.length);
    }

    function onPlayerReady(event) {
        setPlayer(event.target);
        loadAndPlayCurrentSong(event.target);
        event.target.playVideo();
    }

    // THIS IS OUR EVENT HANDLER FOR WHEN THE YOUTUBE PLAYER'S STATE
    // CHANGES. NOTE THAT playerStatus WILL HAVE A DIFFERENT INTEGER
    // VALUE TO REPRESENT THE TYPE OF STATE CHANGE. A playerStatus
    // VALUE OF 0 MEANS THE SONG PLAYING HAS ENDED.
    function onPlayerStateChange(event) {
        let playerStatus = event.data;
        let player = event.target;
        if (playerStatus === -1) {
            // VIDEO UNSTARTED
            console.log("-1 Video unstarted");
            setStatus(-1);
        } else if (playerStatus === 0) {
            // THE VIDEO HAS COMPLETED PLAYING
            console.log("0 Video ended");
            setStatus(0);
            if(currentSong !== playlist.length-1) {
                incSong();
                loadAndPlayCurrentSong(player);
            }
        } else if (playerStatus === 1) {
            // THE VIDEO IS PLAYED
            console.log("1 Video played");
            setStatus(1);
        } else if (playerStatus === 2) {
            // THE VIDEO IS PAUSED
            console.log("2 Video paused");
            setStatus(2);
        } else if (playerStatus === 3) {
            // THE VIDEO IS BUFFERING
            console.log("3 Video buffering");
            setStatus(3);
        } else if (playerStatus === 5) {
            // THE VIDEO HAS BEEN CUED
            console.log("5 Video cued");
            setStatus(5);
        }
    }

    function handlePlay() {
        player.playVideo();
    }

    function handlePause() {
        player.pauseVideo();
    }

    function handleStop() {
        player.stopVideo();
    }

    function handlePrevious() {
        if(currentSong !== 0) {
            setCurrentSong(currentSong-1);
            let song = playlist[currentSong].youTubeId;
            player.loadVideoById(song);
        }
    }

    function handleSkip() {
        if(currentSong !== playlist.length-1) {
            setCurrentSong(currentSong+1);
            let song = playlist[currentSong].youTubeId;
            player.loadVideoById(song);
        }
    }

    function renderPlayOrPause() {
        if(player !== null) {
            if(status === 1) {
                return(
                    <Box sx={{ p: 1 }}>
                        <IconButton onClick={handlePause}>
                            <PauseIcon style={{fontSize:'24pt'}} />
                        </IconButton>
                    </Box>
                )
            } else {
                return(
                    <Box sx={{ p: 1 }}>
                        <IconButton onClick={handlePlay}>
                            <PlayArrowIcon style={{fontSize:'24pt'}} />
                        </IconButton>
                    </Box>
                )
            }
        }
    }

    function renderYouTube() {
        if(currentSong + 1 > playlist.length) {
            setCurrentSong(0);
        } else {
            return(
                <YouTube
                    videoId={playlist[currentSong].youTubeId}
                    opts={playerOptions}
                    onReady={onPlayerReady}
                    onStateChange={onPlayerStateChange} />
            )
        }
    }
    
    function renderPlayerControls() {
        if(currentSong + 1 > playlist.length) {
            setCurrentSong(0);
        } else {
            return(
                <div class="playerControls">
                <center>Now Playing</center> <br/>
                Playlist: {store.currentList.name} <br/>
                Song #: {currentSong+1} <br/>
                Title: {playlist[currentSong].title} <br/>
                Artist: {playlist[currentSong].artist}
                <Box 
                sx={{ display: 'flex' }}
                justifyContent="center"
                >
                    <Box sx={{ p: 1 }}>
                        <IconButton onClick={handlePrevious}>
                            <FastRewindIcon style={{fontSize:'24pt'}} />
                        </IconButton>
                    </Box>
                    {renderPlayOrPause()}
                    <Box sx={{ p: 1 }}>
                        <IconButton onClick={handleStop}>
                            <StopIcon style={{fontSize:'24pt'}} />
                        </IconButton>
                    </Box>
                    <Box sx={{ p: 1 }}>
                        <IconButton onClick={handleSkip}>
                            <FastForwardIcon style={{fontSize:'24pt'}} />
                        </IconButton>
                    </Box>
                </Box>
            </div>
            )
        }
    }

    return (
        <Fragment>
            <Box 
                sx={{ display: 'flex' }}
                justifyContent="center"
            >
                {renderYouTube()}
            </Box>
            {renderPlayerControls()}
        </Fragment>
    );
}