import { Music } from '../models/music';
import { SongsQuery } from '../../graphql-types';
import { SortItem } from '../models/sort_item';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { YouTubePlayer } from 'react-youtube';
import { JukeBoxStatus } from '../enums/jukeboxStatus';
import { RepeatMode } from '../enums/repeatMode';
import _ from 'lodash';

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

export const usePlayerList = (
  musicNode: SongsQuery['allMusic']['nodes'],
  initialSongId: number | undefined
): [
  JukeBoxStatus,
  Dispatch<JukeBoxStatus>,
  boolean,
  Dispatch<boolean>,
  RepeatMode,
  Dispatch<RepeatMode>,
  Music[],
  number,
  Dispatch<number>,
  SortItem,
  Dispatch<SortItem>,
  boolean,
  Dispatch<boolean>,
  YouTubePlayer,
  Dispatch<SetStateAction<YouTubePlayer>>,
  number[],
  (playlistIndex: number) => Music
] => {
  const [jukeboxStatus, setJukeboxStatus] = useState<JukeBoxStatus>('stop');
  const [randomMode, setRandomMode] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('none');

  const [sortItem, setSortItem] = useState<SortItem>('source');
  const [sortOrderByAsc, setSortOrderByAsc] = useState<boolean>(true);

  const songs = createSongList(musicNode, sortItem, sortOrderByAsc);

  const initialPlaylistIndex =
    initialSongId != null
      ? songs.findIndex(song => song.id === initialSongId)
      : undefined;

  const [playlistIndex, setPlaylistIndex] = useState(initialPlaylistIndex ?? 0);
  const [player, setPlayer] = useState<YouTubePlayer>();

  const [playlist, setPlaylist] = useState(
    songs.map(song => {
      return song.id;
    })
  );

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

  return [
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
  ];
};
