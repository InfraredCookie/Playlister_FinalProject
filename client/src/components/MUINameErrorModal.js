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

export default function MUIErrorModal() {
    const { store } = useContext(GlobalStoreContext);

    function handleCloseModal() {
            store.hideModals();
    }

    return (
        <Modal
            open={store.currentList !== null}
        >
            <Box sx={style}>
                <div className="modal-dialog">
                <header className="dialog-header">
                    <Alert severity="warning" color="info">
                        Users' published playlist names must be unique!
                    </Alert>
                </header>
                <div id="confirm-cancel-container">
                    <Button variant="contained"
                        id="dialog-no-button"
                        className="modal-button"
                        onClick={handleCloseModal}
                    >
                        Close
                    </Button>
                </div>
            </div>
            </Box>
        </Modal>
    );
}