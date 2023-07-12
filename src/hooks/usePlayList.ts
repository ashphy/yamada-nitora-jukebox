import _ from 'lodash';
import { Dispatch, useEffect, useState } from 'react';
import { YouTubeProps } from 'react-youtube';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { JukeBoxStatus } from '../enums/jukeboxStatus';
import useWindowDimensions from '../hooks/useWindowDimensions';
import { Music } from '../models/music';
import { currentSongState } from '../recoil/currentSongState';
import { initialSongIdState } from '../recoil/initialSongIdState';
import { playlistIndexState } from '../recoil/playlistIndex';
import { playlistState } from '../recoil/playlistState';
import { repeatModeState } from '../recoil/repeatModeState';
import { sortedSongListState } from '../recoil/sortedSongList';
import {
  isPlaySongChangingState,
  youTubePlayerState
} from '../recoil/youTubePlayerState';

const playerDefaultOpts: YouTubeProps['opts'] = {
  width: 480,
  height: 270,
  playerVars: {
    origin: 'https://jukebox.ashphy.com/',
    start: undefined,
    end: undefined,
    autoplay: 0
  }
};

const playerHeight = function (width: number): number {
  return Math.round(width * (9 / 16));
};

export const usePlayerList = (): [
  JukeBoxStatus,
  Dispatch<JukeBoxStatus>,
  Music[],
  number,
  number[],
  Music | undefined,
  (playListIndex: number) => void,
  (id: number) => void,
  YouTubeProps['opts']
] => {
  const [jukeboxStatus, setJukeboxStatus] = useState<JukeBoxStatus>('stop');

  const repeatMode = useRecoilValue(repeatModeState);
  const songs = useRecoilValue(sortedSongListState);
  const [currentSong, setCurrentSong] = useRecoilState(currentSongState);
  const playlistIndex = useRecoilValue(playlistIndexState);
  const player = useRecoilValue(youTubePlayerState);
  const playlist = useRecoilValue(playlistState);
  const initialSongId = useRecoilValue(initialSongIdState);
  const setIsPlaySongChanging = useSetRecoilState(isPlaySongChangingState);

  const getSong = (playlistIndex: number): Music => {
    const songId = playlist[playlistIndex];
    const song = songs.find(song => song.id === songId);
    if (song === null || song === undefined) {
      throw new RangeError(
        `PlaylistIndex must be between 0 and ${
          playlist.length - 1
        } but given ${playlistIndex}`
      );
    }
    return song;
  };

  // Create player option
  const opts = _.cloneDeep(playerDefaultOpts);
  if (currentSong?.start != null) {
    opts.playerVars.start = currentSong.start;
  }
  if (currentSong?.end != null) {
    opts.playerVars.end = currentSong.end;
  }

  const { width } = useWindowDimensions();
  if (width < 960) {
    opts.width = width;
    opts.height = playerHeight(width);
  }

  // Play song with index
  const play = (playListIndex: number): void => {
    setIsPlaySongChanging(true);

    if (playListIndex < 0) {
      setJukeboxStatus('stop');
      return;
    }

    if (playlist.length <= playListIndex) {
      if (repeatMode === 'all') {
        // Seek back to first.
        playListIndex = 0;
      } else {
        // Stop the player
        setJukeboxStatus('stop');
        return;
      }
    }

    const nextSong = getSong(playListIndex);

    if (currentSong?.videoId === nextSong.videoId) {
      const opts: any = {
        videoId: nextSong.videoId
      };
      if (nextSong.start != null) {
        opts.startSeconds = nextSong.start;
      }
      if (nextSong.end != null) {
        opts.endSeconds = nextSong.end;
      }

      setJukeboxStatus('play');
      setCurrentSong(nextSong);
      player?.cueVideoById(opts);
      // player?.loadVideoById(opts);
    } else {
      setJukeboxStatus('play');
      setCurrentSong(nextSong);
      player?.cueVideoById(opts);
    }
  };

  const playBySongId = (id: number): void => {
    const playListIndex = playlist.findIndex(songId => {
      return songId === id;
    });
    play(playListIndex);
  };

  // Set the song that plays first
  useEffect(() => {
    if (playlist.length > 0) {
      if (initialSongId === undefined) {
        setCurrentSong(getSong(0));
      } else {
        const firstSong = songs.find(song => song.id === initialSongId);
        setCurrentSong(firstSong);
      }
    }
  }, []);

  return [
    jukeboxStatus,
    setJukeboxStatus,
    songs,
    playlistIndex,
    playlist,
    currentSong,
    play,
    playBySongId,
    opts
  ];
};
