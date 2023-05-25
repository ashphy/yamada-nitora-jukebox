import React, { useEffect, useState } from 'react';

import { graphql, PageProps } from 'gatsby';
import { SongsQuery } from '../../graphql-types';

import { YouTubePlayer, YouTubeProps } from 'react-youtube';

import * as style from '../pages/index.module.css';
import { Layout } from '../components/layout';
import useWindowDimensions from '../hooks/useWindowDimensions';
import _ from 'lodash';

import GitHubButton from 'react-github-btn';
import { Music } from '../models/music';
import { SortItem } from '../models/sort_item';
import { JukeBoxStatus } from '../enums/jukeboxStatus';
import { RepeatMode } from '../enums/repeatMode';
import { SongList } from '../components/songList';
import { Player } from '../components/player';

const playerDefaultOpts: YouTubeProps['opts'] = {
  width: 480,
  height: 270,
  playerVars: {
    origin: 'https://jukebox.ashphy.com/',
    start: undefined,
    end: undefined
  }
};

const playerHeight = function (width: number): number {
  return Math.round(width * (9 / 16));
};

const sortSongs = (
  songs: Music[],
  sortItem: SortItem,
  sortOrderByAsc: boolean
): void => {
  songs.sort(Music.getSorter(sortItem));
  if (!sortOrderByAsc) {
    songs.reverse();
  }
};

const createSongList = (
  musicNodes: SongsQuery['allMusic']['nodes'],
  sortItem: SortItem,
  sortOrderByAsc: boolean
): Music[] => {
  const songs = musicNodes.map((node, index) => new Music(index, node));
  sortSongs(songs, sortItem, sortOrderByAsc);
  return songs;
};

const IndexPage: React.FC<PageProps<SongsQuery>> = ({ data, params }) => {
  const idParam = parseInt(params.id, 10);
  const initialSongId = isNaN(idParam) ? null : idParam;

  const [jukeboxStatus, setJukeboxStatus] = useState<JukeBoxStatus>('stop');
  const [randomMode, setRandomMode] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('none');

  const [player, setPlayer] = useState<YouTubePlayer>();

  // Song list options
  const [sortItem, setSortItem] = useState<SortItem>('source');
  const [sortOrderByAsc, setSortOrderByAsc] = useState<boolean>(true);
  const songs = createSongList(data.allMusic.nodes, sortItem, sortOrderByAsc);

  // Playlist
  const [playlist, setPlaylist] = useState(
    songs.map(song => {
      return song.id;
    })
  );
  const initialPlaylistIndex =
    initialSongId != null
      ? songs.findIndex(song => song.id === initialSongId)
      : undefined;
  const [playlistIndex, setPlaylistIndex] = useState(initialPlaylistIndex ?? 0);

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
  };

  const playBySongId = (id: number): void => {
    const playListIndex = playlist.findIndex(songId => {
      return songId === id;
    });
    play(playListIndex);
  };

  const handleOnSort = (newSortItem: SortItem): void => {
    setSortItem(newSortItem);

    if (sortItem === newSortItem) {
      setSortOrderByAsc(!sortOrderByAsc);
    } else {
      setSortOrderByAsc(true);
    }
  };

  useEffect(() => {
    // Create Playlist for random play
    const currentSongId = playlist[playlistIndex];
    sortSongs(songs, sortItem, sortOrderByAsc);
    const originalList = songs.map(song => {
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
    const adjustedIndex = newPlaylist.findIndex(id => {
      return id === currentSongId;
    });
    setPlaylistIndex(adjustedIndex);
  }, [randomMode, sortItem, sortOrderByAsc]);

  return (
    <Layout>
      <main className={style.main}>
        <header className={style.header}>
          <h1>山田ニトラ ジュークボックス</h1>

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

        <Player
          currentSong={currentSong}
          jukeboxStatus={jukeboxStatus}
          onChangePlayerState={state => setJukeboxStatus(state)}
          repeatMode={repeatMode}
          onChangeRepeatMode={mode => setRepeatMode(mode)}
          randomMode={randomMode}
          playlistIndex={playlistIndex}
          onPlay={play}
          opts={opts}
          setRandomMode={setRandomMode}
          player={player}
          onChangePlayer={player => setPlayer(player)}
        />

        <SongList
          songs={songs}
          playlist={playlist}
          playlistIndex={playlistIndex}
          sortItem={sortItem}
          sortOrderByAsc={sortOrderByAsc}
          handleOnSort={handleOnSort}
          playBySongId={playBySongId}
        />
      </main>
    </Layout>
  );
};

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
`;

export default IndexPage;

export { Head } from '../components/head';
