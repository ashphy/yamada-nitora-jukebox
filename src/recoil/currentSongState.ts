import { atom } from 'recoil';

import { Music } from '../models/music';

export const currentSongState = atom<Music | undefined>({
  key: 'CurrentSong',
  default: undefined
});
