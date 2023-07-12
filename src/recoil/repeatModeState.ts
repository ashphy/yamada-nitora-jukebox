import { atom } from 'recoil';

import { RepeatMode } from '../enums/repeatMode';

export const repeatModeState = atom<RepeatMode>({
  key: 'RepeatMode',
  default: 'none'
});
