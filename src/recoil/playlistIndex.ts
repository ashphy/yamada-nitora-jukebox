import { selector } from 'recoil';

import { currentSongState } from './currentSongState';
import { playlistState } from './playlistState';

export const playlistIndexState = selector<number>({
  key: 'PlaylistIndex',
  get: ({ get }) => {
    const currentSong = get(currentSongState);
    const playlist = get(playlistState);
    return playlist.findIndex(songId => songId === currentSong?.id);
  }
});
