import { Fragment, useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'
import SongCard from './SongCard.js'
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { Typography } from '@mui/material'
import Button from '@mui/material/Button';
/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");
    const { pair } = props;

    function handleLoadList(event, id) {
        console.log("handleLoadList for " + id);
        if (store.currentList == null || store.currentList._id !== pair._id) {
            if (!event.target.disabled) {
                let _id = event.target.id;
                if (_id.indexOf('list-card-text-') >= 0)
                    _id = ("" + _id).substring("list-card-text-".length);
                console.log("load " + event.target.id);
                // CHANGE THE CURRENT LIST
                store.setCurrentList(pair);
            } 
        }
        if (store.currentList !== null && store.currentList._id === pair._id) { 
            store.closeCurrentList();
        }
    }

    function handleToggleEdit(event) {
        event.stopPropagation();
        toggleEdit();
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsListNameEditActive();
        }
        setEditActive(newActive);
    }

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        store.markListForDeletion(id);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            if(text !== "") {
                let id = event.target.id.substring("list-".length);
                store.changeListName(id, text);
                toggleEdit();
            } else {
                toggleEdit();
            }
        }
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }

    function handleLike(event) {
        event.stopPropagation();
        if(pair.isPublished && auth.user !== "GUEST") {
            store.likePlaylist(pair);
        }
    }

    function handleDislike(event) {
        event.stopPropagation();
        if(pair.isPublished && auth.user !== "GUEST") {
            store.dislikePlaylist(pair);
        }
    }

    function handleDuplicate(event) {
        event.stopPropagation();
        store.duplicatePlaylist();
    }

    function handlePublish(event) {
        event.stopPropagation();
        store.publishPlaylist();
    }

    function handlePublished() {
        if(!pair.isPublished) {
            return (
                <Fragment>
                <Box sx={{ p: 1 }}>
                    <IconButton onClick={handleToggleEdit} aria-label='edit'>
                        <EditIcon style={{fontSize:'24pt'}} />
                    </IconButton>
                </Box>
                <Box sx={{ p: 1 }}>
                    <IconButton onClick={(event) => {
                            handleDeleteList(event, pair._id)
                        }} aria-label='delete'>
                        <DeleteIcon style={{fontSize:'24pt'}} />
                    </IconButton>
                </Box>
                </Fragment>
            )
        }
    }

    function handleButtons() {
        if (store.currentList !== null && store.currentList._id === pair._id && pair.songs.length !== 0 && !pair.isPublished) { 
            return (
                <Box sx={{ p: 1 }}>
                    <Button variant="contained"
                    id="publish-button"
                    className="modal-button"
                    onClick={handlePublish}
                    sx={{m: 1}}
                    >
                        Publish
                    </Button>
                    <Button variant="contained"
                    id="publish-button"
                    className="modal-button"
                    onClick={handleDuplicate}
                    sx={{m: 1}}
                    >
                        Duplicate
                    </Button>
                </Box>
            )
        } else if (store.currentList !== null && store.currentList._id === pair._id && auth.user.email === store.currentList.ownerEmail) {
            return (
                <Box sx={{ p: 1 }}>
                    <Button variant="contained"
                    id="publish-button"
                    className="modal-button"
                    onClick={handleDuplicate}
                    sx={{m: 1}}
                    >
                        Duplicate
                    </Button>
                    <Button variant="contained"
                    id="publish-button"
                    className="modal-button"
                    onClick={(event) => {
                        handleDeleteList(event, pair._id)
                    }}
                    sx={{m: 1}}
                    >
                        Delete
                    </Button>
                </Box>
            )
        } else if (store.currentList !== null && store.currentList._id === pair._id && auth.user !== "GUEST") {
            return (
                <Box sx={{ p: 1 }}>
                    <Button variant="contained"
                    id="publish-button"
                    className="modal-button"
                    onClick={handleDuplicate}
                    >
                        Duplicate
                    </Button>
                </Box>
            )
        }
    }

    function handleSubtext() {
        if (pair.isPublished) { 
            return (
                <Box 
                sx={{ display: 'flex' }}
                style={{ width: '100%', fontSize: '12pt', alignItems: 'center'}}
                >
                    <Box sx={{ p: 1, flexGrow: 1 }}>
                        Author: {pair.ownerName}
                    </Box>
                    <Box sx={{ p: 1, textOverflow: "ellipsis", overflow: "hidden" }}>
                        Published: {pair.publishDate.substring(0,10)}
                    </Box>
                    <Box sx={{ p: 1, textOverflow: "ellipsis", overflow: "hidden" }}>
                        Listens: {pair.listens}
                    </Box>
                    {handleLikeCounter()}
                    {handleDislikeCounter()}
                </Box>
            )
        }
    }

    function handleLikeCounter() {
        if(pair.likeUsers.includes(auth.user.email)) {
            return (
                <Box sx={{ p: 1, textOverflow: "ellipsis", overflow: "hidden" }}>
                    <IconButton onClick={handleLike} aria-label='like'>
                        <ThumbUpIcon style={{ color:'#81c784' }} />
                    </IconButton>
                    {pair.likes}
                </Box>
            )
        } else {
            return (
                <Box sx={{ p: 1, textOverflow: "ellipsis", overflow: "hidden" }}>
                    <IconButton onClick={handleLike} aria-label='like'>
                        <ThumbUpIcon/>
                    </IconButton>
                    {pair.likes}
                </Box>
            )
        }
    }

    function handleDislikeCounter() {
        if(pair.dislikeUsers.includes(auth.user.email)) {
            return (
                <Box sx={{ p: 1, textOverflow: "ellipsis", overflow: "hidden" }}>
                    <IconButton onClick={handleDislike} aria-label='dislike'>
                        <ThumbDownIcon style={{ color:'#e57373' }}/>
                    </IconButton>
                    {pair.dislikes}
                </Box>
            )
        } else {
            return (
                <Box sx={{ p: 1, textOverflow: "ellipsis", overflow: "hidden" }}>
                    <IconButton onClick={handleDislike} aria-label='dislike'>
                        <ThumbDownIcon/>
                    </IconButton>
                    {pair.dislikes}
                </Box>
            )
        }
    }
    
    function handleCurrent() {
        if (store.currentList !== null && store.currentList._id === pair._id && pair.songs.length === 0) { 
            return (
                <Typography variant="h4" sx={{p: 1}}>No Songs</Typography>
            )
        }
        if (store.currentList !== null && store.currentList._id === pair._id) { 
            return (
                pair.songs.map((song, index) => (
                    <SongCard
                        id={'playlist-song-' + (index)}
                        key={'playlist-song-' + (index)}
                        index={index}
                        song={song}
                    />
                )) 
            )
        }
    }


    let cardElement =
        <ListItem
            id={pair._id}
            key={pair._id}
            sx={{ marginTop: '15px', display: 'flex', flexDirection: 'column', p: 1, bgcolor: 'background.paper', height: "fit-content" }}
            style={{ width: '100%' }}
            button
            onClick={(event) => {
                handleLoadList(event, pair._id)
            }}
        >
            <Box 
                sx={{ display: 'flex' }}
                style={{ width: '100%', fontSize: '36pt' }}
            >
                <Box sx={{ p: 1, flexGrow: 1, textOverflow: "ellipsis", overflow: "hidden" }}>{pair.name}</Box>
                {handlePublished()}
                <Box sx={{ p: 1 }}>
                    <IconButton aria-label='dropdown'>
                        {(store.currentList !== null && store.currentList._id === pair._id) ? <KeyboardArrowDownIcon style={{fontSize:'24pt'}} /> : <KeyboardArrowUpIcon style={{fontSize:'24pt'}} /> }
                    </IconButton>
                </Box>
            </Box>
            {handleSubtext()}
            {handleCurrent()}
            {handleButtons()}
        </ListItem>

    if (editActive) {
        cardElement =
            <TextField
                margin="normal"
                required
                halfwidth="true"
                id={"list-" + pair._id}
                label="Playlist Name"
                name="name"
                autoComplete="Playlist Name"
                className='list-card'
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={pair.name}
                inputProps={{style: {fontSize: 48}}}
                InputLabelProps={{style: {fontSize: 24}}}
                autoFocus
            />
    }
    return (
        cardElement
    );
}

export default ListCard;