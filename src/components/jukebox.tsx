import React from 'react';

import { usePlayerList } from '../hooks/usePlayList';
import { Player } from './player';
import { SongList } from './songList';

export const JukeBox: React.FC = () => {
  // Playlist
  const [
    jukeboxStatus,
    setJukeboxStatus,
    songs,
    playlistIndex,
    playlist,
    currentSong,
    play,
    playBySongId,
    opts
  ] = usePlayerList();

  return (
    <>
      <Player
        currentSong={currentSong}
        jukeboxStatus={jukeboxStatus}
        onChangePlayerState={state => setJukeboxStatus(state)}
        playlistIndex={playlistIndex}
        onPlay={play}
        opts={opts}
      />

      <SongList
        songs={songs}
        playlist={playlist}
        playlistIndex={playlistIndex}
        playBySongId={playBySongId}
      />
    </>
  );
};
