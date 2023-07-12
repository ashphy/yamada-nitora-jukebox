import { selector } from 'recoil';

import { Music } from '../models/music';
import { songListState } from './songListState';
import { sortItemState } from './sortItemState';
import { sortOrderByAscState } from './sortOrderByAsc';

export const sortedSongListState = selector<Music[]>({
  key: 'SortedSongList',
  get: ({ get }) => {
    const songList = [...get(songListState)];
    const sortItem = get(sortItemState);
    const sortOrderByAsc = get(sortOrderByAscState);

    songList.sort(Music.getSorter(sortItem));
    if (!sortOrderByAsc) {
      songList.reverse();
    }

    return songList;
  }
});
