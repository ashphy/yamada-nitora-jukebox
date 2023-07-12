import { number, voidable } from '@recoiljs/refine';
import { atom } from 'recoil';
import { syncEffect } from 'recoil-sync';

export const initialSongIdState = atom<number | undefined>({
  key: 'i',
  default: undefined,
  effects: [syncEffect({ refine: voidable(number()) })]
});
