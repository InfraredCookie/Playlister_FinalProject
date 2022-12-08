import { createContext, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import jsTPS from '../common/jsTPS'
import api from './store-request-api'
import CreateSong_Transaction from '../transactions/CreateSong_Transaction'
import MoveSong_Transaction from '../transactions/MoveSong_Transaction'
import RemoveSong_Transaction from '../transactions/RemoveSong_Transaction'
import UpdateSong_Transaction from '../transactions/UpdateSong_Transaction'
import AuthContext from '../auth'

/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});
console.log("create GlobalStoreContext");

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    EDIT_SONG: "EDIT_SONG",
    REMOVE_SONG: "REMOVE_SONG",
    HIDE_MODALS: "HIDE_MODALS",
    UPDATE_ID_NAME_PAIRS: "UPDATE_ID_NAME_PAIRS",
    UPDATE_CURRENT_LIST: "UPDATE_CURRENT_LIST",
    NAME_ERROR: "NAME_ERROR",
    NOW_PLAYING: "NOW_PLAYING"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

const CurrentModal = {
    NONE : "NONE",
    DELETE_LIST : "DELETE_LIST",
    EDIT_SONG : "EDIT_SONG",
    REMOVE_SONG : "REMOVE_SONG",
    NAME_ERROR : "NAME_ERROR"
}

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        currentModal : CurrentModal.NONE,
        idNamePairs: [],
        currentList: null,
        currentSongIndex : -1,
        currentSong : null,
        newListCounter: 0,
        listNameActive: false,
        listIdMarkedForDeletion: null,
        listMarkedForDeletion: null,
        currentView: null,
        currentViewPlaylists: [],
        sortType: "date",
        songPlaying: -1
    });
    const history = useHistory();

    console.log("inside useGlobalStore");

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);
    console.log("auth: " + auth);

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentView: store.currentView,
                    currentViewPlaylists: payload.playlists,
                    sortType: store.sortType,
                    songPlaying: store.songPlaying
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentView: store.currentView,
                    currentViewPlaylists: store.currentViewPlaylists,
                    sortType: store.sortType,
                    songPlaying: store.songPlaying
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {                
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.pairsArray,
                    currentList: payload.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentView: "HOME",
                    currentViewPlaylists: payload.playlists,
                    sortType: store.sortType,
                    songPlaying: store.songPlaying
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.pairsArray,
                    currentList: null,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentView: payload.view,
                    currentViewPlaylists: payload.playlists,
                    sortType: store.sortType,
                    songPlaying: store.songPlaying
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    currentModal : CurrentModal.DELETE_LIST,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: payload.id,
                    listMarkedForDeletion: payload.playlist,
                    currentView: store.currentView,
                    currentViewPlaylists: store.currentViewPlaylists,
                    sortType: store.sortType,
                    songPlaying: store.songPlaying
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentView: store.currentView,
                    currentViewPlaylists: store.currentViewPlaylists,
                    sortType: store.sortType,
                    songPlaying: store.songPlaying
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentView: store.currentView,
                    currentViewPlaylists: store.currentViewPlaylists,
                    sortType: store.sortType,
                    songPlaying: store.songPlaying
                });
            }
            // 
            case GlobalStoreActionType.EDIT_SONG: {
                return setStore({
                    currentModal : CurrentModal.EDIT_SONG,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentView: store.currentView,
                    currentViewPlaylists: store.currentViewPlaylists,
                    sortType: store.sortType,
                    songPlaying: store.songPlaying
                });
            }
            case GlobalStoreActionType.REMOVE_SONG: {
                return setStore({
                    currentModal : CurrentModal.REMOVE_SONG,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: payload.currentSongIndex,
                    currentSong: payload.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentView: store.currentView,
                    currentViewPlaylists: store.currentViewPlaylists,
                    sortType: store.sortType,
                    songPlaying: store.songPlaying
                });
            }
            case GlobalStoreActionType.HIDE_MODALS: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentView: store.currentView,
                    currentViewPlaylists: store.currentViewPlaylists,
                    sortType: store.sortType,
                    songPlaying: store.songPlaying
                });
            }
            case GlobalStoreActionType.UPDATE_ID_NAME_PAIRS: {
                return setStore({
                    currentModal : store.currentModal,
                    idNamePairs: payload.pairs,
                    currentList: store.currentList,
                    currentSongIndex: store.currentSongIndex,
                    currentSong: store.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentView: store.currentView,
                    currentViewPlaylists: payload.playlists,
                    sortType: payload.sort,
                    songPlaying: store.songPlaying
                });
            }
            case GlobalStoreActionType.UPDATE_CURRENT_LIST: {
                return setStore({
                    currentModal : CurrentModal.NONE,
                    idNamePairs: payload.pairsArray,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    listIdMarkedForDeletion: null,
                    listMarkedForDeletion: null,
                    currentView: payload.view,
                    currentViewPlaylists: payload.playlists,
                    sortType: store.sortType,
                    songPlaying: store.songPlaying
                });
            }
            case GlobalStoreActionType.NAME_ERROR: {
                return setStore({
                    currentModal : CurrentModal.NAME_ERROR,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: store.currentSongIndex,
                    currentSong: store.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: store.listNameActive,
                    listIdMarkedForDeletion: store.listIdMarkedForDeletion,
                    listMarkedForDeletion: store.listMarkedForDeletion,
                    currentView: store.currentView,
                    currentViewPlaylists: store.currentViewPlaylists,
                    sortType: store.sortType,
                    songPlaying: store.songPlaying
                });
            }
            case GlobalStoreActionType.NOW_PLAYING: {
                return setStore({
                    currentModal : store.currentModal,
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    currentSongIndex: -1,
                    currentSong: store.currentSong,
                    newListCounter: store.newListCounter,
                    listNameActive: store.listNameActive,
                    listIdMarkedForDeletion: store.listIdMarkedForDeletion,
                    listMarkedForDeletion: store.listMarkedForDeletion,
                    currentView: store.currentView,
                    currentViewPlaylists: store.currentViewPlaylists,
                    sortType: store.sortType,
                    songPlaying: payload
                });
            }
            default:
                return store;
        }
    }

    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            let pairsArray
                            let playlists
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                pairsArray = response.data.idNamePairs;
                            }
                            response = await api.getUserPlaylists();
                            if (response.data.success) {
                                playlists = response.data.playlists;
                            }
                            let result = store.sort(pairsArray, playlists);
                            storeReducer({
                                type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                payload: {
                                    idNamePairs: result.pairsArray,
                                    playlists: result.playlists
                                }
                            });
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
        tps.clearAllTransactions();
        history.push("/");
    }

    // THIS FUNCTION CREATES A NEW LIST
    store.createNewList = async function () {
        let newListName = "Untitled" + store.newListCounter;
        let userName = auth.user.firstName + " " + auth.user.lastName;
        let response = await api.createPlaylist(newListName, [], auth.user.email, userName);
        console.log("createNewList response: " + response);
        if (response.status === 201) {
            tps.clearAllTransactions();
            let newList = response.data.playlist;

            let pairsArray
            let playlists
            response = await api.getPlaylistPairs();
            if (response.data.success) {
                pairsArray = response.data.idNamePairs;
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
            response = await api.getUserPlaylists();
            if (response.data.success) {
                playlists = response.data.playlists;
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
            let result = store.sort(pairsArray, playlists)
            storeReducer({
                type: GlobalStoreActionType.CREATE_NEW_LIST,
                payload: {
                    pairsArray: result.pairsArray,
                    playlists: result.playlists,
                    currentList: newList
                }
            });
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            let pairsArray
            let playlists
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                pairsArray = response.data.idNamePairs;
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
            const response2 = await api.getUserPlaylists();
            if (response2.data.success) {
                playlists = response2.data.playlists;
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
            let result = store.sort(pairsArray, playlists);
            storeReducer({
                type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                payload: {
                    pairsArray: result.pairsArray,
                    view: "HOME",
                    playlists: result.playlists
                }
            })
        }
        asyncLoadIdNamePairs();
    }

    // THIS FUNCTION LOADS PUBLISHED ID, NAME PAIRS SO WE CAN LIST PUBLISHED LISTS
    store.loadPublishedIdNamePairs = function (view) {
        async function asyncLoadPublishedIdNamePairs() {
            let pairsArray
            let playlists
            const response = await api.getPublishedPlaylistPairs();
            if (response.data.success) {
                pairsArray = response.data.idNamePairs;
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
            const response2 = await api.getPublishedPlaylists();
            if (response2.data.success) {
                playlists = response2.data.playlists;
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
            let result = store.sort(pairsArray, playlists);
            if (view === "USERS") {
                result.pairsArray = []
                result.playlists = []
            }
            storeReducer({
                type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                payload: {
                    pairsArray: result.pairsArray,
                    view: view,
                    playlists: result.playlists
                }
            });
        }
        asyncLoadPublishedIdNamePairs();
    }

    // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
    // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
    // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
    // showDeleteListModal, and hideDeleteListModal
    store.markListForDeletion = function (id) {
        async function getListToDelete(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                    payload: {id: id, playlist: playlist}
                });
            }
        }
        getListToDelete(id);
    }
    store.deleteList = function (id) {
        async function processDelete(id) {
            let response = await api.deletePlaylistById(id);
            if (response.status === 200) {
                store.loadIdNamePairs();
                history.push("/");
            }
        }
        processDelete(id);
    }
    store.deleteMarkedList = function() {
        store.deleteList(store.listIdMarkedForDeletion);
        store.hideModals();
    }

    //mycode
    store.unmarkListForDeletion = function(){
        store.hideModals();
    }

    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE THE LIST

    store.showEditSongModal = (songIndex, songToEdit) => {
        storeReducer({
            type: GlobalStoreActionType.EDIT_SONG,
            payload: {currentSongIndex: songIndex, currentSong: songToEdit}
        });        
    }
    store.showRemoveSongModal = (songIndex, songToRemove) => {
        storeReducer({
            type: GlobalStoreActionType.REMOVE_SONG,
            payload: {currentSongIndex: songIndex, currentSong: songToRemove}
        });        
    }
    store.hideModals = () => {
        storeReducer({
            type: GlobalStoreActionType.HIDE_MODALS,
            payload: {}
        });    
    }
    store.isDeleteListModalOpen = () => {
        return store.currentModal === CurrentModal.DELETE_LIST;
    }
    store.isEditSongModalOpen = () => {
        return store.currentModal === CurrentModal.EDIT_SONG;
    }
    store.isRemoveSongModalOpen = () => {
        return store.currentModal === CurrentModal.REMOVE_SONG;
    }
    store.isNameErrorModalOpen = () => {
        return store.currentModal === CurrentModal.NAME_ERROR;
    }

    // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
    // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
    // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
    // moveItem, updateItem, updateCurrentList, undo, and redo
    store.setCurrentList = function (playlist) {
        async function asyncSetCurrentList(playlist) {
            if(playlist.isPublished) {
                playlist.listens++;
            }
            let response = await api.updatePlaylistById(playlist._id, playlist);
            response = await api.getPublishedPlaylistById(playlist._id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: playlist
                });
                //history.push("/playlist/" + playlist._id);
            }
        }
        asyncSetCurrentList(playlist);
    }

    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }
    store.addNewSong = function() {
        let index = this.getPlaylistSize();
        this.addCreateSongTransaction(index, "Untitled", "Unknown", "dQw4w9WgXcQ");
    }
    // THIS FUNCTION CREATES A NEW SONG IN THE CURRENT LIST
    // USING THE PROVIDED DATA AND PUTS THIS SONG AT INDEX
    store.createSong = function(index, song) {
        let list = store.currentList;      
        list.songs.splice(index, 0, song);
        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION MOVES A SONG IN THE CURRENT LIST FROM
    // start TO end AND ADJUSTS ALL OTHER ITEMS ACCORDINGLY
    store.moveSong = function(start, end) {
        let list = store.currentList;

        // WE NEED TO UPDATE THE STATE FOR THE APP
        if (start < end) {
            let temp = list.songs[start];
            for (let i = start; i < end; i++) {
                list.songs[i] = list.songs[i + 1];
            }
            list.songs[end] = temp;
        }
        else if (start > end) {
            let temp = list.songs[start];
            for (let i = start; i > end; i--) {
                list.songs[i] = list.songs[i - 1];
            }
            list.songs[end] = temp;
        }

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION REMOVES THE SONG AT THE index LOCATION
    // FROM THE CURRENT LIST
    store.removeSong = function(index) {
        let list = store.currentList;      
        list.songs.splice(index, 1); 

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    // THIS FUNCTION UPDATES THE TEXT IN THE ITEM AT index TO text
    store.updateSong = function(index, songData) {
        let list = store.currentList;
        let song = list.songs[index];
        song.title = songData.title;
        song.artist = songData.artist;
        song.youTubeId = songData.youTubeId;

        // NOW MAKE IT OFFICIAL
        store.updateCurrentList();
    }
    store.addNewSong = () => {
        let playlistSize = store.getPlaylistSize();
        store.addCreateSongTransaction(
            playlistSize, "Untitled", "Unknown", "dQw4w9WgXcQ");
    }
    // THIS FUNCDTION ADDS A CreateSong_Transaction TO THE TRANSACTION STACK
    store.addCreateSongTransaction = (index, title, artist, youTubeId) => {
        // ADD A SONG ITEM AND ITS NUMBER
        let song = {
            title: title,
            artist: artist,
            youTubeId: youTubeId
        };
        let transaction = new CreateSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }    
    store.addMoveSongTransaction = function (start, end) {
        let transaction = new MoveSong_Transaction(store, start, end);
        tps.addTransaction(transaction);
    }
    // THIS FUNCTION ADDS A RemoveSong_Transaction TO THE TRANSACTION STACK
    store.addRemoveSongTransaction = () => {
        let index = store.currentSongIndex;
        let song = store.currentList.songs[index];
        let transaction = new RemoveSong_Transaction(store, index, song);
        tps.addTransaction(transaction);
    }
    store.addUpdateSongTransaction = function (index, newSongData) {
        let song = store.currentList.songs[index];
        let oldSongData = {
            title: song.title,
            artist: song.artist,
            youTubeId: song.youTubeId
        };
        let transaction = new UpdateSong_Transaction(this, index, oldSongData, newSongData);        
        tps.addTransaction(transaction);
    }
    store.updateCurrentList = function() {
        async function asyncUpdateCurrentList() {
            const response = await api.updatePlaylistById(store.currentList._id, store.currentList);
            /*
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: list
                });
            }*/
            async function asyncUpdate() {
                let pairsArray
                let playlists
                let response
                if(store.currentView === "HOME") {
                    response = await api.getPlaylistPairs();
                    if (response.data.success) {
                        pairsArray = response.data.idNamePairs;
                    }
                    else {
                        console.log("API FAILED TO GET THE LIST PAIRS");
                    }
                    const response2 = await api.getUserPlaylists();
                    if (response2.data.success) {
                        playlists = response2.data.playlists;
                    }
                    else {
                        console.log("API FAILED TO GET THE LIST PAIRS");
                    }
                } else {
                    response = await api.getPublishedPlaylistPairs();
                    if (response.data.success) {
                        pairsArray = response.data.idNamePairs;
                    }
                    else {
                        console.log("API FAILED TO GET THE LIST PAIRS");
                    }
                    const response2 = await api.getPublishedPlaylists();
                    if (response2.data.success) {
                        playlists = response2.data.playlists;
                    }
                    else {
                        console.log("API FAILED TO GET THE LIST PAIRS");
                    }
                }
                let result = store.sort(pairsArray, playlists);
                storeReducer({
                    type: GlobalStoreActionType.UPDATE_CURRENT_LIST,
                    payload: {
                        pairsArray: result.pairsArray,
                        view: store.currentView,
                        playlists: result.playlists
                    }
                })
            }
            asyncUpdate();
        }
        asyncUpdateCurrentList();
    }

    store.updatePlaylist = async function(playlist) {
        async function asyncUpdateCurrentList() {
            const response = await api.updatePlaylistById(playlist._id, playlist);
            /*
            if (response.data.success) {
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: list
                });
            }*/
            async function asyncUpdate() {
                let pairsArray
                let playlists
                let response
                if(store.currentView === "HOME") {
                    response = await api.getPlaylistPairs();
                    if (response.data.success) {
                        pairsArray = response.data.idNamePairs;
                    }
                    else {
                        console.log("API FAILED TO GET THE LIST PAIRS");
                    }
                    const response2 = await api.getUserPlaylists();
                    if (response2.data.success) {
                        playlists = response2.data.playlists;
                    }
                    else {
                        console.log("API FAILED TO GET THE LIST PAIRS");
                    }
                } else {
                    response = await api.getPublishedPlaylistPairs();
                    if (response.data.success) {
                        pairsArray = response.data.idNamePairs;
                    }
                    else {
                        console.log("API FAILED TO GET THE LIST PAIRS");
                    }
                    const response2 = await api.getPublishedPlaylists();
                    if (response2.data.success) {
                        playlists = response2.data.playlists;
                    }
                    else {
                        console.log("API FAILED TO GET THE LIST PAIRS");
                    }
                }
                let result = store.sort(pairsArray, playlists);
                storeReducer({
                    type: GlobalStoreActionType.UPDATE_CURRENT_LIST,
                    payload: {
                        pairsArray: result.pairsArray,
                        view: store.currentView,
                        playlists: result.playlists
                    }
                })
            }
            asyncUpdate();
        }
        asyncUpdateCurrentList();
    }

    store.sort = function(pairsArray, playlists) {
        //Retain sort order
        switch(store.sortType) {
            case 'name':
                console.log(pairsArray)
                pairsArray.sort((a, b) => a.name.localeCompare(b.name))
                console.log(pairsArray)
                playlists.sort((a, b) => a.name.localeCompare(b.name))
                console.log(playlists)
                break;
            case 'date':
                playlists.sort((a, b) => a.publishDate.toString().localeCompare(b.publishDate.toString()))
                playlists.reverse()
                pairsArray = []
                for (let key in playlists) {
                    let pair = {
                        _id: playlists[key]._id,
                        name: playlists[key].name
                    };
                    pairsArray.push(pair)
                }
                break;
            case 'listens':
                playlists.sort((a, b) => a.listens < b.listens)
                playlists.reverse()
                pairsArray = []
                for (let key in playlists) {
                    let pair = {
                        _id: playlists[key]._id,
                        name: playlists[key].name
                    };
                    pairsArray.push(pair)
                }
                break;
            case 'likes':
                playlists.sort((a, b) => a.likes < b.likes)
                pairsArray = []
                for (let key in playlists) {
                    let pair = {
                        _id: playlists[key]._id,
                        name: playlists[key].name
                    };
                    pairsArray.push(pair)
                }
                break;
            case 'dislikes':    
                playlists.sort((a, b) => a.dislikes < b.dislikes)
                pairsArray = []
                for (let key in playlists) {
                    let pair = {
                        _id: playlists[key]._id,
                        name: playlists[key].name
                    };
                    pairsArray.push(pair)
                }
                break;
            default:
                break;
        }
        return {pairsArray, playlists}
    }

    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }
    store.canAddNewSong = function() {
        return (store.currentList !== null && store.currentModal === "NONE");
    }
    store.canUndo = function() {
        return ((store.currentList !== null) && tps.hasTransactionToUndo() && store.currentModal === "NONE");
    }
    store.canRedo = function() {
        return ((store.currentList !== null) && tps.hasTransactionToRedo() && store.currentModal === "NONE");
    }
    store.canClose = function() {
        return (store.currentList !== null && store.currentModal === "NONE");
    }
    //mycode
    store.closeList = function () {
        store.closeCurrentList();
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    //ctrl z x
    store.handleKeyPress = function() {
        let evtobj = window.event
        if(evtobj.keyCode === 90 && evtobj.ctrlKey) {
            if(tps.hasTransactionToUndo) {
                store.undo();
            }
        }
        if(evtobj.keyCode === 89 && evtobj.ctrlKey) {
            if(tps.hasTransactionToRedo) {
                store.redo();
            }
        }
    }

    document.onkeydown = store.handleKeyPress;

    //Final project functions
    
    store.sortByName = function() {
        let pairs = store.idNamePairs
        pairs.sort((a, b) => a.name.localeCompare(b.name))
        let playlists = store.currentViewPlaylists
        playlists.sort((a, b) => a.name.localeCompare(b.name))
        console.log(pairs)
        storeReducer({
            type: GlobalStoreActionType.UPDATE_ID_NAME_PAIRS,
            payload: {
                pairs: pairs,
                playlists: playlists,
                sort: "name"
            }
        });
    }

    store.sortByDate = function() {
        async function asyncSortByDate() {
            let playlists = store.currentViewPlaylists;
            playlists.sort((a, b) => a.publishDate.toString().localeCompare(b.publishDate.toString()))
            playlists.reverse()
            let idNamePairs = []
            for (let key in playlists) {
                let pair = {
                    _id: playlists[key]._id,
                    name: playlists[key].name
                };
                idNamePairs.push(pair)
            }
            storeReducer({
                type: GlobalStoreActionType.UPDATE_ID_NAME_PAIRS,
                payload: {
                    pairs: idNamePairs,
                    playlists: playlists,
                    sort: "date"
                }
            });
        }
        asyncSortByDate()
    }

    store.sortByListens = function() {
        async function asyncSortByListens() {
            let playlists = store.currentViewPlaylists;
            playlists.sort((a, b) => a.listens < b.listens)
            let idNamePairs = []
            for (let key in playlists) {
                let pair = {
                    _id: playlists[key]._id,
                    name: playlists[key].name
                };
                idNamePairs.push(pair)
            }
            storeReducer({
                type: GlobalStoreActionType.UPDATE_ID_NAME_PAIRS,
                payload: {
                    pairs: idNamePairs,
                    playlists: playlists,
                    sort: "listens"
                }
            });
        }
        asyncSortByListens()
    }

    store.sortByLikes = function() {
        async function asyncSortByLikes() {
            let playlists = store.currentViewPlaylists;
            playlists.sort((a, b) => a.likes < b.likes)
            let idNamePairs = []
            for (let key in playlists) {
                let pair = {
                    _id: playlists[key]._id,
                    name: playlists[key].name
                };
                idNamePairs.push(pair)
            }
            storeReducer({
                type: GlobalStoreActionType.UPDATE_ID_NAME_PAIRS,
                payload: {
                    pairs: idNamePairs,
                    playlists: playlists,
                    sort: "likes"
                }
            });
        }
        asyncSortByLikes()
    }

    store.sortByDislikes = function() {
        async function asyncSortByDislikes() {
            let playlists = store.currentViewPlaylists;
            playlists.sort((a, b) => a.dislikes < b.dislikes)
            let idNamePairs = []
            for (let key in playlists) {
                let pair = {
                    _id: playlists[key]._id,
                    name: playlists[key].name
                };
                idNamePairs.push(pair)
            }
            storeReducer({
                type: GlobalStoreActionType.UPDATE_ID_NAME_PAIRS,
                payload: {
                    pairs: idNamePairs,
                    playlists: playlists,
                    sort: "dislikes"
                }
            });
        }
        asyncSortByDislikes()
    }

    store.filterPlaylists = function(input) {
        input = input.toLowerCase()
        if(store.currentView === "HOME" || store.currentView === "ALL") {
            store.filterByName(input)
        }
        if(store.currentView === "USERS") {
            store.filterByAuthor(input)
        }
    }

    store.filterByName = function(input) {
        async function asyncFilterByName(input) {
            let response = null
            if(store.currentView === "HOME") {
                response = await api.getUserPlaylists()
            } else if (store.currentView === "ALL" || store.currentView === "USERS") {
                response = await api.getPublishedPlaylists()
            }
            let playlists = response.data.playlists
            playlists = playlists.filter(playlist => playlist.name.toLowerCase().includes(input))
            let idNamePairs = []
            for (let key in playlists) {
                let pair = {
                    _id: playlists[key]._id,
                    name: playlists[key].name
                };
                idNamePairs.push(pair)
            }
            let result = store.sort(idNamePairs, playlists);
            storeReducer({
                type: GlobalStoreActionType.UPDATE_ID_NAME_PAIRS,
                payload: {
                    pairs: result.pairsArray,
                    playlists: result.playlists,
                    sort: store.sortType
                }
            });
        }
        asyncFilterByName(input)
    }

    store.filterByAuthor = function(input) {
        async function asyncFilterByAuthor(input) {
            let response = null
            if(store.currentView === "HOME") {
                response = await api.getUserPlaylists()
            } else if (store.currentView === "ALL" || store.currentView === "USERS") {
                response = await api.getPublishedPlaylists()
            }
            let playlists = response.data.playlists
            playlists = playlists.filter(playlist => playlist.ownerName.toLowerCase().includes(input))
            let idNamePairs = []
            for (let key in playlists) {
                let pair = {
                    _id: playlists[key]._id,
                    name: playlists[key].name
                };
                idNamePairs.push(pair)
            }
            let result = store.sort(idNamePairs, playlists);
            if (input === "") {
                result.pairsArray = []
                result.playlists = []
            }
            storeReducer({
                type: GlobalStoreActionType.UPDATE_ID_NAME_PAIRS,
                payload: {
                    pairs: result.pairsArray,
                    playlists: result.playlists,
                    sort: store.sortType
                }
            });
        }
        asyncFilterByAuthor(input)
    }

    store.comment = function(comment) {
        let list = store.currentList
        let newComment = {
            comment: comment,
            author: auth.user.firstName + " " + auth.user.lastName
        }
        list.comments.push(newComment)
        store.updateCurrentList();
    }

    store.likePlaylist = function(playlist) {
        if(!playlist.likeUsers.includes(auth.user.email)) {
            playlist.likes++;
            playlist.likeUsers.push(auth.user.email)
            if(playlist.dislikeUsers.includes(auth.user.email)) {
                playlist.dislikes--;
                playlist.dislikeUsers.splice(playlist.dislikeUsers.indexOf(auth.user.email),1)
            }
        } else {
            playlist.likes--;
            playlist.likeUsers.splice(playlist.likeUsers.indexOf(auth.user.email),1)
        }
        store.updatePlaylist(playlist);
    }

    store.dislikePlaylist = function(playlist) {
        if(!playlist.dislikeUsers.includes(auth.user.email)) {
            playlist.dislikes++;
            playlist.dislikeUsers.push(auth.user.email)
            if(playlist.likeUsers.includes(auth.user.email)) {
                playlist.likes--;
                playlist.likeUsers.splice(playlist.likeUsers.indexOf(auth.user.email),1)
            }
        } else {
            playlist.dislikes--;
            playlist.dislikeUsers.splice(playlist.dislikeUsers.indexOf(auth.user.email),1)
        }
        store.updatePlaylist(playlist);
    }

    store.duplicatePlaylist = async function () {
        let newListName = "Copy of " + store.currentList.name;
        let userName = auth.user.firstName + " " + auth.user.lastName;
        let response = await api.createPlaylist(newListName, store.currentList.songs, auth.user.email, userName);
        console.log("createNewList response: " + response);
        if (response.status === 201) {
            tps.clearAllTransactions();
            let newList = response.data.playlist;

            let pairsArray
            let playlists
            response = await api.getPlaylistPairs();
            if (response.data.success) {
                pairsArray = response.data.idNamePairs;
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
            response = await api.getUserPlaylists();
            if (response.data.success) {
                playlists = response.data.playlists;
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
            let result = store.sort(pairsArray, playlists)
            storeReducer({
                type: GlobalStoreActionType.CREATE_NEW_LIST,
                payload: {
                    pairsArray: result.pairsArray,
                    playlists: result.playlists,
                    currentList: newList
                }
            });
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
    }

    
    store.publishPlaylist = async function() {
        let playlist = store.currentList;
        let playlists
        const response = await api.getUserPlaylists();
        if (response.data.success) {
            playlists = response.data.playlists;
        }
        for (let i in playlists) {
            if (playlists[i].name === playlist.name && playlists[i].isPublished) {
                store.showNameErrorModal();
                return;
            }
        }
        playlist.isPublished = true;
        playlist.publishDate = Date.now();
        store.updateCurrentList();
    }

    store.isNameErrorModalOpen = () => {
        return store.currentModal === CurrentModal.NAME_ERROR;
    }

    store.showNameErrorModal = () => {
        storeReducer({
            type: GlobalStoreActionType.NAME_ERROR,
            payload: {}
        });        
    }

    store.playingNow = function(song) {
        storeReducer({
            type: GlobalStoreActionType.NOW_PLAYING,
            payload: song
        }); 
    }

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };