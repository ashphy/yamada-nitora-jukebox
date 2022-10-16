import React, { useEffect, useRef, useState } from 'react';

import { graphql, PageProps } from 'gatsby'
import { SongsQuery } from '../../graphql-types'

import YouTube, { YouTubePlayer, YouTubeProps } from 'react-youtube';

import { IoPlayCircle } from '@react-icons/all-files/io5/IoPlayCircle';
import { IoPause } from '@react-icons/all-files/io5/IoPause';
import { IoPlaySkipBack } from '@react-icons/all-files/io5/IoPlaySkipBack';
import { IoPlaySkipForward } from '@react-icons/all-files/io5/IoPlaySkipForward';
import { RiRepeatOneLine } from '@react-icons/all-files/ri/RiRepeatOneLine';
import { RiRepeat2Line } from '@react-icons/all-files/ri/RiRepeat2Line';
import { FiExternalLink } from '@react-icons/all-files/fi/FiExternalLink';
import { FaRandom } from '@react-icons/all-files/fa/FaRandom';
import { BsPlayFill } from '@react-icons/all-files/bs/BsPlayFill';
import { TiArrowSortedUp } from '@react-icons/all-files/ti/TiArrowSortedUp';
import { TiArrowSortedDown } from '@react-icons/all-files/ti/TiArrowSortedDown';
import { FaYoutube } from '@react-icons/all-files/fa/FaYoutube';

import * as style from '../pages/index.module.css';
import { Layout } from '../components/layout';
import useWindowDimensions from '../hooks/useWindowDimensions';
import _ from 'lodash';
import { NumberParam, useQueryParam } from 'use-query-params';

import GitHubButton from 'react-github-btn'
import { Music } from '../models/music';
import { TwitterShare } from '../components/twitter_share';

const playerDefaultOpts: YouTubeProps['opts'] = {
  width: 480,
  height: 270,
  playerVars: {
    origin: 'https://jukebox.ashphy.com/',
    start: undefined,
    end: undefined,
  }
}

const playerHeight = function (width: number): number {
  return Math.round(width * (9 / 16));
};

const sortSongs = (songs: Music[], sortItem: SortItem, sortOrderByAsc: boolean): void => {
  songs.sort(Music.getSorter(sortItem));
  if (!sortOrderByAsc) {
    songs.reverse();
  }
}

const createSongList = (musicNodes: SongsQuery['allMusic']['nodes'], sortItem: SortItem, sortOrderByAsc: boolean): Music[] => {
  const songs = musicNodes.map((node, index) => new Music(index, node));
  sortSongs(songs, sortItem, sortOrderByAsc);
  return songs;
}

const IndexPage: React.FC<PageProps<SongsQuery>> = ({ data }) => {
  const currentSongRow = useRef<HTMLTableRowElement>(null);

  const [initialSongId] = useQueryParam('i', NumberParam);

  const [jukeboxStatus, setJukeboxStatus] = useState<JukeBoxStatus>('stop');
  const [randomMode, setRandomMode] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('none');

  const [player, setPlayer] = useState<YouTubePlayer>();

  // Song list options
  const [sortItem, setSortItem] = useState<SortItem>('source');
  const [sortOrderByAsc, setSortOrderByAsc] = useState<boolean>(true);
  const songs = createSongList(data.allMusic.nodes, sortItem, sortOrderByAsc);

  // Playlist
  const [playlist, setPlaylist] = useState(songs.map((song) => {
    return song.id;
  }));
  const initialPlaylistIndex = initialSongId != null ? songs.findIndex((song) => song.id === initialSongId) : undefined;
  const [playlistIndex, setPlaylistIndex] = useState(initialPlaylistIndex ?? 0);

  const getSong = (playlistIndex: number): Music => {
    const songId = playlist[playlistIndex];
    const song = songs.find((song) => song.id === songId);
    if (song === null || song === undefined) {
      throw new RangeError(`PlaylistIndex must be between 0 and ${playlist.length - 1} but given ${playlistIndex}`);
    }
    return song;
  }
  const currentSong = getSong(playlistIndex);

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
    if (currentSong.videoId === nextSong.videoId) {
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
      setPlaylistIndex(playListIndex);
      player?.cueVideoById(opts);
    } else {
      setJukeboxStatus('play');
      setPlaylistIndex(playListIndex);
      player?.cueVideoById(opts);
    }
  }

  const playBySongId = (id: number): void => {
    const playListIndex = playlist.findIndex((songId) => {
      return songId === id;
    });
    play(playListIndex);
  }

  const handleOnSetRepeatMode = (): void => {
    switch (repeatMode) {
      case 'none':
        setRepeatMode('all');
        break;
      case 'all':
        setRepeatMode('one');
        break;
      case 'one':
        setRepeatMode('none');
        break;
    }
  };

  const handleOnSetRandomMode = (): void => {
    setRandomMode(!randomMode);
  };

  const handleOnSort = (newSortItem: SortItem): void => {
    setSortItem(newSortItem);

    if (sortItem === newSortItem) {
      setSortOrderByAsc(!sortOrderByAsc);
    } else {
      setSortOrderByAsc(true);
    }
  }

  useEffect(() => {
    // Create Playlist for random play
    const currentSongId = playlist[playlistIndex]
    sortSongs(songs, sortItem, sortOrderByAsc);
    const originalList = songs.map((song) => {
      return song.id;
    });

    let newPlaylist: number[];
    if (randomMode) {
      // Create random playlist
      newPlaylist = _.shuffle(originalList);
    } else {
      newPlaylist = originalList;
    }
    setPlaylist(newPlaylist);

    // Adjust playlist index
    const adjustedIndex = newPlaylist.findIndex((id) => {
      return id === currentSongId;
    });
    setPlaylistIndex(adjustedIndex);
  }, [randomMode, sortItem, sortOrderByAsc]);

  const RepeatButton = (): JSX.Element => {
    switch (repeatMode) {
      case 'none':
        return <RiRepeat2Line size='3em' className={style.controlIcon} onClick={handleOnSetRepeatMode}/>;
      case 'all':
        return <RiRepeat2Line size='3em' className={style.controlIconEnable} onClick={handleOnSetRepeatMode}/>;
      case 'one':
        return <RiRepeatOneLine size='3em' className={style.controlIconEnable} onClick={handleOnSetRepeatMode}/>;
    }
  }

  useEffect(() => {
    const clientRect = currentSongRow.current?.getBoundingClientRect();
    if (clientRect !== null && clientRect !== undefined) {
      const px = window.scrollX + clientRect.left;
      const py = window.scrollY + clientRect.top;
      // console.log(`scroll px: ${px}, py: ${py}`);
    }
  }, [playlistIndex, playlist]);

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
              aria-label="Star ashphy/yamada-nitora-jukebox on GitHub">
              Star
            </GitHubButton>
          </div>
        </header>

        <div className={style.player}>
          <YouTube
            videoId={currentSong.videoId ?? ''}
            className={style.youTubePlayer}
            onReady={(event) => {
              setPlayer(event.target)

              if (jukeboxStatus === 'play') {
                event.target.playVideo();
              }
            }}
            onPlay={() => {
            }}
            onEnd={() => {
              // Go next song
              if (repeatMode === 'one') {
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
                  break;
                case YouTube.PlayerState.ENDED:
                  setJukeboxStatus('stop');
                  break;
                case YouTube.PlayerState.PLAYING:
                  setJukeboxStatus('play');
                  break;
                case YouTube.PlayerState.PAUSED:
                  setJukeboxStatus('stop');
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
                {currentSong.title ?? '--'}
              </p>
              <p className={style.musicArtist}>
                {currentSong.artist ?? '--'}
              </p>
              <TwitterShare song={currentSong}/>
            </div>
            <div className={style.playerControls}>
              <RepeatButton/>
              <IoPlaySkipBack size='3em' className={style.controlIcon} onClick={() => {
                play(playlistIndex - 1)
              }}/>
              {jukeboxStatus === 'play'
                ? <IoPause size='5em' className={style.controlIcon} onClick={() => {
                  player?.pauseVideo()
                }}/>
                : <IoPlayCircle size='5em' className={style.controlIcon} onClick={() => {
                  player?.playVideo()
                }}/>
              }
              <IoPlaySkipForward size='3em' className={style.controlIcon} onClick={() => {
                play(playlistIndex + 1)
              }}/>
              <FaRandom
                size='3em'
                className={randomMode ? style.controlIconEnable : style.controlIcon}
                onClick={handleOnSetRandomMode}
              />
            </div>
          </div>
        </div>

        <div className={style.songList}>
          <table>
            <thead>
            <tr>
              <th className={style.songCursor}></th>
              <th className={style.songTitle}
                  onClick={() => handleOnSort('title')}>
                Title
                <span className={style.sortIcon}>
                  {sortItem === 'title' && sortOrderByAsc && <TiArrowSortedUp size={16}/>}
                  {sortItem === 'title' && !sortOrderByAsc && <TiArrowSortedDown size={16}/>}
                  </span>
              </th>
              <th className={style.songArtist}
                  onClick={() => handleOnSort('artist')}>
                Artist
                <span className={style.sortIcon}>
                  {sortItem === 'artist' && sortOrderByAsc && <TiArrowSortedUp size={16}/>}
                  {sortItem === 'artist' && !sortOrderByAsc && <TiArrowSortedDown size={16}/>}
                </span>
              </th>
              <th className={style.songSource}
                  onClick={() => handleOnSort('source')}>
                Source
                <span className={style.sortIcon}>
                  {sortItem === 'source' && sortOrderByAsc && <TiArrowSortedUp size={16}/>}
                  {sortItem === 'source' && !sortOrderByAsc && <TiArrowSortedDown size={16}/>}
                </span>
              </th>
              <th className={style.songAction}>
                <FaYoutube />
              </th>
            </tr>
            </thead>
            <tbody>
            {
              songs.map((song) => {
                const isCurrentPlaying = playlist[playlistIndex] === song.id;

                return <tr
                  key={song.id}
                  ref={isCurrentPlaying ? currentSongRow : null}
                  style={isCurrentPlaying ? { backgroundColor: '#FFF1F3' } : {}}>
                  <td className={style.songCursor}>
                    {isCurrentPlaying && <BsPlayFill/>}
                  </td>
                  <td className={style.songTitle} onClick={() => {
                    playBySongId(song.id)
                  }}>
                    {song.title ?? '--'}
                  </td>
                  <td className={style.songArtist} onClick={() => {
                    playBySongId(song.id)
                  }}>
                    {song.artist ?? '--'}
                  </td>
                  <td className={style.songSource} onClick={() => {
                    playBySongId(song.id)
                  }}>
                    {song.videoTitle}
                  </td>
                  <td className={style.songAction}>
                    <a target="_blank"
                       href={song.youtubeUrl} rel="noreferrer">
                      <FiExternalLink/>
                    </a>
                  </td>
                </tr>
              })
            }
            </tbody>
          </table>
        </div>
      </main>
    </Layout>
  )
}

export const query = graphql`
    query Songs {
        allMusic {
            nodes {
                video {
                    videoId
                    videoTitle
                    date
                }
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
