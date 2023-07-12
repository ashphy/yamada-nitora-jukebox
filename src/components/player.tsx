import { FaRandom } from '@react-icons/all-files/fa/FaRandom';
import { IoPlaySkipBack } from '@react-icons/all-files/io5/IoPlaySkipBack';
import { IoPlaySkipForward } from '@react-icons/all-files/io5/IoPlaySkipForward';
import React, { ReactElement } from 'react';
import YouTube, { YouTubeEvent } from 'react-youtube';
import { useRecoilCallback, useRecoilState, useSetRecoilState } from 'recoil';

import { JukeBoxStatus } from '../enums/jukeboxStatus';
import { Music } from '../models/music';
import * as style from '../pages/index.module.css';
import { randomModeState } from '../recoil/randomModeState';
import { repeatModeState } from '../recoil/repeatModeState';
import {
  isPlaySongChangingState,
  youTubePlayerState
} from '../recoil/youTubePlayerState';
import { PlayButton } from './player/playButton';
import { RepeatButton } from './player/repeatButton';
import { TwitterShare } from './twitter_share';

interface Props {
  currentSong: Music | undefined;
  jukeboxStatus: JukeBoxStatus;
  onChangePlayerState: (jukeboxStatus: JukeBoxStatus) => void;
  playlistIndex: number;
  onPlay: (playListIndex: number) => void;
  opts: any;
}

export const Player = ({
  currentSong,
  jukeboxStatus,
  onChangePlayerState,
  playlistIndex,
  onPlay,
  opts
}: Props): ReactElement => {
  const setPlayer = useSetRecoilState(youTubePlayerState);

  const [randomMode, setRandomMode] = useRecoilState(randomModeState);
  const [repeatMode, setRepeatMode] = useRecoilState(repeatModeState);
  const [isPlaySongChanging, setIsPlaySongChanging] = useRecoilState(
    isPlaySongChangingState
  );

  const playMusic = useRecoilCallback(
    ({ snapshot }) =>
      () => {
        void snapshot.getPromise(youTubePlayerState).then(player => {
          player?.playVideo();
        });
      },
    []
  );

  const pauseMusic = useRecoilCallback(
    ({ snapshot }) =>
      () => {
        void snapshot.getPromise(youTubePlayerState).then(player => {
          player?.pauseVideo();
        });
      },
    []
  );

  const handleOnPlayerEnd = useRecoilCallback(
    ({ snapshot, set }) =>
      (event: YouTubeEvent<number>) => {
        console.log('onEnd');
        if (isPlaySongChanging) {
          return;
        }

        // Go next song
        if (repeatMode === 'one') {
          onPlay(playlistIndex);
        } else {
          onPlay(playlistIndex + 1);
        }
      }
  );

  const handleOnPlayerReady = useRecoilCallback(
    ({ snapshot, set }) =>
      (event: YouTubeEvent<number>) => {
        set(youTubePlayerState, event.target);
      }
  );

  const handleOnStateChange = (event: YouTubeEvent<number>): void => {
    const player = event.target;
    setPlayer(player);

    switch (event.data) {
      case YouTube.PlayerState.UNSTARTED:
        break;
      case YouTube.PlayerState.ENDED:
        if (!isPlaySongChanging) {
          onChangePlayerState('stop');
        }
        break;
      case YouTube.PlayerState.PLAYING:
        onChangePlayerState('play');
        break;
      case YouTube.PlayerState.PAUSED:
        if (!isPlaySongChanging) {
          onChangePlayerState('stop');
        }
        break;
      case YouTube.PlayerState.BUFFERING:
        break;
      case YouTube.PlayerState.CUED:
        if (jukeboxStatus === 'play') {
          setIsPlaySongChanging(false);
          player.playVideo();
        }
        break;
    }
  };

  return (
    <div className={style.player}>
      <YouTube
        videoId={currentSong?.videoId ?? ''}
        className={style.youTubePlayer}
        opts={opts}
        onReady={handleOnPlayerReady}
        onPlay={() => {}}
        onEnd={handleOnPlayerEnd}
        onError={event => {
          console.log('YOUTUBE ERROR', event);
        }}
        onStateChange={event => handleOnStateChange(event)}
      />

      <div className={style.playerSide}>
        <div className={style.musicInfo}>
          <p className={style.musicTitle}>{currentSong?.title ?? '--'}</p>
          <p className={style.musicArtist}>{currentSong?.artist ?? '--'}</p>
          {currentSong !== undefined && <TwitterShare song={currentSong} />}
        </div>
        <div className={style.playerControls}>
          <RepeatButton
            repeatMode={repeatMode}
            onChangeRepeatMode={mode => setRepeatMode(mode)}
          />
          <IoPlaySkipBack
            size="3em"
            className={style.controlIcon}
            onClick={() => {
              onPlay(playlistIndex - 1);
            }}
          />
          <PlayButton
            jukeboxStatus={jukeboxStatus}
            onPlay={playMusic}
            onPause={pauseMusic}
          />
          <IoPlaySkipForward
            size="3em"
            className={style.controlIcon}
            onClick={() => {
              setIsPlaySongChanging(true);
              onPlay(playlistIndex + 1);
            }}
          />
          <FaRandom
            size="3em"
            className={randomMode ? style.controlIconEnable : style.controlIcon}
            onClick={() => setRandomMode(!randomMode)}
          />
        </div>
      </div>
    </div>
  );
};
