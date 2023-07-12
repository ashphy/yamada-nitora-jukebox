import { YouTubePlayer } from 'react-youtube';
import { atom } from 'recoil';

import { JukeBoxStatus } from '../enums/jukeboxStatus';

export const youTubePlayerState = atom<YouTubePlayer>({
  key: 'YouTubePlayer',
  default: undefined,
  dangerouslyAllowMutability: true
});

export const isPlaySongChangingState = atom<boolean>({
  key: 'isPlaySongChanging',
  default: false
});

export const jukeboxStatus = atom<JukeBoxStatus>({
  key: 'jukeboxStatus',
  default: 'stop'
});
