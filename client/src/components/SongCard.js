import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [ draggedTo, setDraggedTo ] = useState(0);
    const { song, index } = props;

    function handleDragStart(event) {
        event.dataTransfer.setData("song", index);
    }

    function handleDragOver(event) {
        event.preventDefault();
    }

    function handleDragEnter(event) {
        event.preventDefault();
        setDraggedTo(true);
    }

    function handleDragLeave(event) {
        event.preventDefault();
        setDraggedTo(false);
    }

    function handleDrop(event) {
        event.preventDefault();
        let targetIndex = index;
        let sourceIndex = Number(event.dataTransfer.getData("song"));
        setDraggedTo(false);

        // UPDATE THE LIST
        store.addMoveSongTransaction(sourceIndex, targetIndex);
    }
    function handleRemoveSong(event) {
        store.showRemoveSongModal(index, song);
    }
    function handleClick(event) {
        event.stopPropagation()
        // DOUBLE CLICK IS FOR SONG EDITING
        if (event.detail === 2) {
            store.showEditSongModal(index, song);
        }
    }

    function handleClick2(event) {
        event.stopPropagation()
    }

    function handlePublished() {
        if(!store.currentList.isPublished) {
            return (
                <div
                    key={index}
                    id={'song-' + index + '-card'}
                    className={cardClass}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    draggable="true"
                    onClick={handleClick}
                >
                    {index + 1}.&nbsp;
                    <a
                        id={'song-' + index + '-link'}
                        className="song-link"
                        href={"https://www.youtube.com/watch?v=" + song.youTubeId}
                        target="_blank" rel="noopener noreferrer">
                        {song.title} by {song.artist}
                    </a>
                    <input
                        type="button"
                        id={"remove-song-" + index}
                        className="list-card-button"
                        value={"\u2715"}
                        onClick={handleRemoveSong}
                    />
                </div>
            )
        }
        return (
            <div
                key={index}
                id={'song-' + index + '-card'}
                className={cardClass}
                onClick={handleClick2}
            >
                {index + 1}.
                <a
                    id={'song-' + index + '-link'}
                    className="song-link"
                    href={"https://www.youtube.com/watch?v=" + song.youTubeId}>
                    {song.title} by {song.artist}
                </a>
            </div>
        )
    }

    let cardClass = "list-card unselected-list-card";
    return (
        handlePublished()
    );
}

export default SongCard;