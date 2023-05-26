import React from 'react';

import { graphql, PageProps } from 'gatsby';
import { SongsQuery } from '../../graphql-types';

import { YouTubeProps } from 'react-youtube';

import * as style from '../pages/index.module.css';
import { Layout } from '../components/layout';
import useWindowDimensions from '../hooks/useWindowDimensions';
import _ from 'lodash';

import GitHubButton from 'react-github-btn';
import { SortItem } from '../models/sort_item';
import { SongList } from '../components/songList';
import { Player } from '../components/player';
import { usePlayerList } from '../hooks/usePlayList';

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

const IndexPage: React.FC<PageProps<SongsQuery>> = ({ data, params }) => {
  const idParam = parseInt(params.id, 10);
  const initialSongId = isNaN(idParam) ? undefined : idParam;

  // Playlist
  const [
    jukeboxStatus,
    setJukeboxStatus,
    randomMode,
    setRandomMode,
    repeatMode,
    setRepeatMode,
    songs,
    playlistIndex,
    setPlaylistIndex,
    sortItem,
    setSortItem,
    sortOrderByAsc,
    setSortOrderByAsc,
    player,
    setPlayer,
    playlist,
    getSong
  ] = usePlayerList(data.allMusic.nodes, initialSongId);

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
