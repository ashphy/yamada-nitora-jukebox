import React, { useEffect, useRef, useState } from 'react';

import { graphql, PageProps } from 'gatsby'
import { SongsQuery } from '../../graphql-types'

import YouTube, { YouTubePlayer, YouTubeProps } from 'react-youtube';

import { IoPlayCircle } from '@react-icons/all-files/io5/IoPlayCircle';
import { IoPause } from '@react-icons/all-files/io5/IoPause';
import { IoPlaySkipBack } from '@react-icons/all-files/io5/IoPlaySkipBack';
import { IoPlaySkipForward } from '@react-icons/all-files/io5/IoPlaySkipForward';
import { RiRepeatOneLine } from "@react-icons/all-files/ri/RiRepeatOneLine";
import { RiRepeat2Line } from "@react-icons/all-files/ri/RiRepeat2Line";
import { FiExternalLink } from "@react-icons/all-files/fi/FiExternalLink";
import { FaRandom } from "@react-icons/all-files/fa/FaRandom";
import { FaTwitter } from "@react-icons/all-files/fa/FaTwitter";

import * as style from '../pages/index.module.css';
import { Layout } from '../components/layout';
import useWindowDimensions from '../hooks/useWindowDimensions';
import _ from 'lodash';
import { NumberParam, useQueryParam } from 'use-query-params';

import GitHubButton from 'react-github-btn'

const playerDefaultOpts: YouTubeProps['opts'] = {
  width: 480,
  height: 270,
  playerVars: {
    origin: 'https://jukebox.ashphy.com/',
    start: undefined,
    end: undefined
  }
}

const convertTimeToSeconds = function (time: string): number {
  return time.split(":").reverse().reduce((sum, item, index) => {
    return sum + (parseInt(item) * (60 ** index));
  }, 0);
}

const playerHeight = function (width: number): number {
  return Math.round(width * (9 / 16));
};

const IndexPage: React.FC<PageProps<SongsQuery>> = ({ data }) => {
  const currentSongRow = useRef<HTMLTableRowElement>(null);

  const [initialIndex, setInitialIndex] = useQueryParam("i", NumberParam);

  const [jukeboxStatus, setJukeboxStatus] = useState<JukeBoxStatus>("stop");
  const [randomMode, setRandomMode] = useState<boolean>(false);
  const [repeatMode, setRepeaMode] = useState<RepeatMode>("none");

  const [player, setPlayer] = useState<YouTubePlayer>();
  const [playlistIndex, setPlaylistIndex] = useState(initialIndex ?? 0);

  const songs = data.allMusicsYaml.nodes;
  const [playlist, setPlaylist] = useState(songs.map((_, index) => { return index; }));
  const getSong = (index: number) => {
    return songs[playlist[index]];
  }
  const currentSong = getSong(playlistIndex);

  // Create player option
  const opts = _.cloneDeep(playerDefaultOpts);
  if (currentSong.start != null) {
    opts.playerVars["start"] = convertTimeToSeconds(currentSong.start);
  }
  if (currentSong.end != null) {
    opts.playerVars["end"] = convertTimeToSeconds(currentSong.end);
  }

  const { width, height } = useWindowDimensions();
  if (width < 960) {
    opts.width = width;
    opts.height = playerHeight(width);
  }

  // Play song with index
  const play = (index: number) => {
    if (index < 0) {
      setJukeboxStatus("stop");
      return;
    }

    if (playlist.length <= index) {
      if (repeatMode == "all") {
        // Seek back to first.
        index = 0;
      } else {
        // Stop the player
        setJukeboxStatus("stop");
        return;
      }
    }

    const nextSong = getSong(index);
    if (currentSong.videoId == nextSong.videoId) {
      var opts: any = {
        videoId: nextSong.videoId,
      };
      if (nextSong.start != null) {
        opts['startSeconds'] = convertTimeToSeconds(nextSong.start);
      }
      if (nextSong.end != null) {
        opts['endSeconds'] = convertTimeToSeconds(nextSong.end);
      }

      setJukeboxStatus("play");
      setPlaylistIndex(index);
      player?.cueVideoById(opts);
    } else {
      setJukeboxStatus("play");
      setPlaylistIndex(index);
      player?.cueVideoById(opts);
    }
  }

  const playBySongId = (id: number) => {
    const index = playlist.findIndex((playListId) => { return playListId == id; });
    play(index);
  }

  const onHandleSetRepeatMode = () => {
    switch (repeatMode) {
      case 'none':
        setRepeaMode('all');
        break;
      case 'all':
        setRepeaMode('one');
        break;
      case 'one':
        setRepeaMode('none');
        break;
    }
  };

  const onHandleSetRandomMode = () => {
    setRandomMode(!randomMode);
  };

  const tweetText = () => {
    return encodeURIComponent(`#山田ニトラジュークボックス で「${currentSong.meta?.ja?.title}」を聞いています。`);
  }

  const tweetUrl = () => {
    return encodeURIComponent(`https://jukebox.ashphy.com/?i=${playlist[playlistIndex]}`);
  }

  const youtubeUrl = (song: any) => {
    const t = song.start != null ? `&t=${convertTimeToSeconds(song.start)}` : '';
    return `https://www.youtube.com/watch?v=${song.videoId}${t}`;
  }

  useEffect(() => {

    const iframe = document.getElementsByTagName('iframe');
    console.log(iframe);
    console.log(iframe.length);
    if (0 < iframe.length) {
      console.log(iframe[0].clientWidth, iframe[0].clientHeight);
    }

    const currentSongId = playlist[playlistIndex];
    const originalList = songs.map((_, index) => { return index; });
    let newPlaylist: number[] = [];
    if (randomMode) {
      // Create random playlist
      newPlaylist = _.shuffle(originalList);
    } else {
      newPlaylist = originalList;
    }
    setPlaylist(newPlaylist);

    // Adjust playlist index
    const ajustedIndex = newPlaylist.findIndex((id) => { return id == currentSongId; });
    setPlaylistIndex(ajustedIndex);
  }, [randomMode]);

  const RepartButton = () => {
    switch (repeatMode) {
      case 'none':
        return <RiRepeat2Line size='3em' className={style.controlIcon} onClick={onHandleSetRepeatMode} />;
      case 'all':
        return <RiRepeat2Line size='3em' className={style.controlIconEnable} onClick={onHandleSetRepeatMode} />;
      case 'one':
        return <RiRepeatOneLine size='3em' className={style.controlIconEnable} onClick={onHandleSetRepeatMode} />;
    }
  }

  return (
    <Layout>
      <main className={style.main}>
        <header className={style.header}>
          <h1>
            山田ニトラ ジュークボックス
          </h1>

          <div className={style.githubStar}>
            <GitHubButton
              href="https://github.com/ashphy/yamada-nitora-jukebox"
              data-icon="octicon-star"
              aria-label="Star ashphy/yamada-nitora-jukebox on GitHub"
            >
                Star
            </GitHubButton>
          </div>
        </header>

        <div className={style.player}>
          <YouTube
            videoId={currentSong?.videoId ?? ''}
            className={style.youTubePlayer}
            onReady={(event) => {
              setPlayer(event.target)

              if (jukeboxStatus == "play") {
                event.target.playVideo();
              }
            }}
            onPlay={(event) => {}}
            onEnd={(event) => {
              // Go next song
              if (repeatMode == 'one') {
                play(playlistIndex);
              } else {
                play(playlistIndex + 1);
              }
            }}
            onError={(event) => {
              console.log('YOUTUBE ERROR', event);
            }}
            onStateChange={(event) => {
              setPlayer(event.target)

              switch (event.data) {
                case YouTube.PlayerState.UNSTARTED:
                  setJukeboxStatus("stop");
                  break;
                case YouTube.PlayerState.ENDED:
                  setJukeboxStatus("stop");
                  break;
                case YouTube.PlayerState.PLAYING:
                  setJukeboxStatus("play");
                  break;
                case YouTube.PlayerState.PAUSED:
                  setJukeboxStatus("stop");
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
              <p className={style.musicTitle}>
                {currentSong.meta?.ja?.title ?? '--'}
              </p>
              <p className={style.musicArtist}>
                {currentSong.meta?.ja?.artist ?? '--'}
              </p>
              <p className={style.share}>
                <a href={`https://twitter.com/intent/tweet?text=${tweetText()}&url=${tweetUrl()}`}
                   target='_blank'>
                  <FaTwitter /> <span className={style.shareText}>今聞いている曲をTwitterでシェア</span>
                </a>
              </p>
            </div>
            <div className={style.playerControls}>
              <RepartButton />
              <IoPlaySkipBack size='3em' className={style.controlIcon} onClick={() => { play(playlistIndex - 1) }} />
              {jukeboxStatus == 'play'
                ? <IoPause size='5em' className={style.controlIcon} onClick={() => { player?.pauseVideo() }} />
                : <IoPlayCircle size='5em' className={style.controlIcon} onClick={() => { player?.playVideo() }} />
              }
              <IoPlaySkipForward size='3em' className={style.controlIcon} onClick={() => { play(playlistIndex + 1) }} />
              <FaRandom
                size='3em'
                className={randomMode ? style.controlIconEnable : style.controlIcon}
                onClick={onHandleSetRandomMode}
              />
            </div>
          </div>
        </div>

        <div className={style.songList}>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Artist</th>
                <th>Source</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {
                songs.map((song, songId) => {
                  return <tr
                    key={songId}
                    ref={playlist[playlistIndex] == songId ? currentSongRow : null}
                    style={playlist[playlistIndex] == songId ? { backgroundColor: '#E8E8E8' } : {}}
                    >
                    <td onClick={() => { playBySongId(songId) }} >{song.meta?.ja?.title ?? '--'}</td>
                    <td onClick={() => { playBySongId(songId) }} >{song.meta?.ja?.artist ?? '--'}</td>
                    <td onClick={() => { playBySongId(songId) }} >{song.videoTitle}</td>
                    <td>
                      <a target="_blank"
                         href={youtubeUrl(song)} >
                        <FiExternalLink />
                      </a>
                    </td>
                  </tr>
                })
              }
            </tbody>
          </table>
        </div>
      </main >
    </Layout>
  )
}

export const query = graphql`
  query Songs {
    allMusicsYaml {
      nodes {
        videoId
        videoTitle
        start
        end
        meta {
          ja {
            artist
            title
          }
        }
      }
    }
  }
`

export default IndexPage
