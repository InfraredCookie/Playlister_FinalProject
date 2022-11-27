import { useContext } from 'react'
import GlobalStoreContext from '../store';
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    //bgcolor: 'background.paper',
    //border: '2px solid #000',
    //boxShadow: 24,
    //p: 4,
};

export default function MUIRemoveSongModal() {
    const { store } = useContext(GlobalStoreContext);

    function handleConfirmRemoveSong () {
        store.addRemoveSongTransaction();
    }

    function handleCancelRemoveSong () {
        store.hideModals();
    }
    
    let modalClass = "modal";
    if (store.isRemoveSongModalOpen()) {
        modalClass += " is-visible";
    }
    let songTitle = "";
    if (store.currentSong) {
        songTitle = store.currentSong.title;
    }

    return (
        <Modal
            open={store.currentList !== null}
        >
            <Box sx={style}>
            <div
        id="remove-song-modal"
        className={modalClass}
        data-animation="slideInOutLeft">
        <div className="modal-root" id='verify-remove-song-root'>
            <header className="dialog-header">
            <Alert severity="info" color="info">
                <div className="modal-north">
                    Remove {songTitle}?
                </div>
                <div className="modal-center">
                    <div className="modal-center-content">
                        Are you sure you wish to permanently remove {songTitle} from the playlist?
                    </div>
                </div>
            </Alert>
            </header>
                <div className="modal-south">
                    <Button variant="contained"
                        id="remove-song-confirm-button" 
                        className="modal-button" 
                        onClick={handleConfirmRemoveSong} 
                        sx={{m: 1}}
                    >
                        Confirm
                    </Button>
                    <Button variant="contained" 
                        id="remove-song-cancel-button" 
                        className="modal-button" 
                        onClick={handleCancelRemoveSong}  
                        sx={{m: 1}}
                    >
                        Cancel
                    </Button>
                </div>
        </div>
    </div>
            </Box>
        </Modal>
    );
}