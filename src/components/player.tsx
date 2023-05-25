import React, { ReactElement } from 'react';
import * as style from '../pages/index.module.css';
import YouTube, { YouTubePlayer } from 'react-youtube';
import { TwitterShare } from './twitter_share';
import { RepeatButton } from './player/repeatButton';
import { IoPlaySkipBack } from '@react-icons/all-files/io5/IoPlaySkipBack';
import { PlayButton } from './player/playButton';
import { IoPlaySkipForward } from '@react-icons/all-files/io5/IoPlaySkipForward';
import { FaRandom } from '@react-icons/all-files/fa/FaRandom';
import { Music } from '../models/music';
import { JukeBoxStatus } from '../enums/jukeboxStatus';
import { RepeatMode } from '../enums/repeatMode';

interface Props {
  currentSong: Music;
  jukeboxStatus: JukeBoxStatus;
  onChangePlayerState: (jukeboxStatus: JukeBoxStatus) => void;
  repeatMode: RepeatMode;
  onChangeRepeatMode: (repeatMode: RepeatMode) => void;
  randomMode: boolean;
  playlistIndex: number;
  onPlay: (playListIndex: number) => void;
  opts: any;
  setRandomMode: (randomMode: boolean) => void;
  player: YouTubePlayer;
  onChangePlayer: (player: YouTubePlayer) => void;
}

export const Player = ({
  currentSong,
  jukeboxStatus,
  onChangePlayerState,
  repeatMode,
  onChangeRepeatMode,
  randomMode,
  playlistIndex,
  onPlay,
  opts,
  setRandomMode,
  player,
  onChangePlayer
}: Props): ReactElement => {
  return (
    <div className={style.player}>
      <YouTube
        videoId={currentSong.videoId ?? ''}
        className={style.youTubePlayer}
        onReady={event => {
          onChangePlayer(event.target);

          if (jukeboxStatus === 'play') {
            event.target.playVideo();
          }
        }}
        onPlay={() => {}}
        onEnd={() => {
          // Go next song
          if (repeatMode === 'one') {
            onPlay(playlistIndex);
          } else {
            onPlay(playlistIndex + 1);
          }
        }}
        onError={event => {
          console.log('YOUTUBE ERROR', event);
        }}
        onStateChange={event => {
          onChangePlayer(event.target);

          switch (event.data) {
            case YouTube.PlayerState.UNSTARTED:
              break;
            case YouTube.PlayerState.ENDED:
              onChangePlayerState('stop');
              break;
            case YouTube.PlayerState.PLAYING:
              onChangePlayerState('play');
              break;
            case YouTube.PlayerState.PAUSED:
              onChangePlayerState('stop');
              break;
            case YouTube.PlayerState.BUFFERING:
              break;
            case YouTube.PlayerState.CUED:
              event.target.playVideo();
              break;
          }
        }}
        opts={opts}
      />

      <div className={style.playerSide}>
        <div className={style.musicInfo}>
          <p className={style.musicTitle}>{currentSong.title ?? '--'}</p>
          <p className={style.musicArtist}>{currentSong.artist ?? '--'}</p>
          <TwitterShare song={currentSong} />
        </div>
        <div className={style.playerControls}>
          <RepeatButton
            repeatMode={repeatMode}
            onChangeRepeatMode={mode => onChangeRepeatMode(mode)}
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
            onPlay={() => player?.playVideo()}
            onPause={() => player?.pauseVideo()}
          />
          <IoPlaySkipForward
            size="3em"
            className={style.controlIcon}
            onClick={() => {
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
