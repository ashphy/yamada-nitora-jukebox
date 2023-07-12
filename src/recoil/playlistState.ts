import _ from 'lodash';
import { selector } from 'recoil';

import { randomModeState } from './randomModeState';
import { sortedSongListState } from './sortedSongList';

export const playlistState = selector({
  key: 'Playlist',
  get: ({ get }) => {
    const sortedSongList = get(sortedSongListState);
    const randomMode = get(randomModeState);

    const originalList = sortedSongList.map(song => {
      return song.id;
    });

    let newPlaylist: number[];
    if (randomMode) {
      // Create random playlist
      newPlaylist = _.shuffle(originalList);
    } else {
      newPlaylist = originalList;
    }

    return newPlaylist;
  }
});
