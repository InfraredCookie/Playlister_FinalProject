import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
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
/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");
    const [drop, setDrop] = useState(false);
    const { pair, selected } = props;

    function handleLoadList(event, id) {
        console.log("handleLoadList for " + id);
        if (!event.target.disabled) {
            let _id = event.target.id;
            if (_id.indexOf('list-card-text-') >= 0)
                _id = ("" + _id).substring("list-card-text-".length);

            console.log("load " + event.target.id);

            // CHANGE THE CURRENT LIST
            store.setCurrentList(id);
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
        let _id = event.target.id;
        _id = ("" + _id).substring("delete-list-".length);
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

    function handleDropdown(event) {
        event.stopPropagation();
        setDrop(!drop)
    }

    function handleLike(event) {
        event.stopPropagation();
    }

    function handleDislike(event) {
        event.stopPropagation();
    }

    let selectClass = "unselected-list-card";
    if (selected) {
        selectClass = "selected-list-card";
    }
    let cardStatus = false;
    if (store.isListNameEditActive) {
        cardStatus = true;
    }
    let cardElement =
        <ListItem
            id={pair._id}
            key={pair._id}
            sx={{ marginTop: '15px', display: 'flex', flexDirection: 'column', p: 1, bgcolor: 'background.paper' }}
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
                <Box sx={{ p: 1 }}>
                    <IconButton onClick={handleDropdown} aria-label='dropdown'>
                        {drop ? <KeyboardArrowDownIcon style={{fontSize:'24pt'}} /> : <KeyboardArrowUpIcon style={{fontSize:'24pt'}} /> }
                    </IconButton>
                </Box>
            </Box>
            <Box 
                sx={{ display: 'flex' }}
                style={{ width: '100%', fontSize: '12pt', alignItems: 'center'}}
            >
                <Box sx={{ p: 1, flexGrow: 1 }}>
                    Author: {pair.ownerName}
                </Box>
                <Box sx={{ p: 1, textOverflow: "ellipsis", overflow: "hidden" }}>
                    Published: 0/00/00
                </Box>
                <Box sx={{ p: 1, textOverflow: "ellipsis", overflow: "hidden" }}>
                    Listens: {pair.listens}
                </Box>
                <Box sx={{ p: 1, textOverflow: "ellipsis", overflow: "hidden" }}>
                    <IconButton onClick={handleLike} aria-label='like'>
                        <ThumbUpIcon style={{ color:'#81c784' }} />
                    </IconButton>
                    {pair.likes}
                </Box>
                <Box sx={{ p: 1, textOverflow: "ellipsis", overflow: "hidden" }}>
                    <IconButton onClick={handleDislike} aria-label='dislike'>
                        <ThumbDownIcon style={{ color:'#e57373' }}/>
                    </IconButton>
                    {pair.dislikes}
                </Box>
            </Box>
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