import { BsPlayFill } from '@react-icons/all-files/bs/BsPlayFill';
import { FaYoutube } from '@react-icons/all-files/fa/FaYoutube';
import { FiExternalLink } from '@react-icons/all-files/fi/FiExternalLink';
import { TiArrowSortedDown } from '@react-icons/all-files/ti/TiArrowSortedDown';
import { TiArrowSortedUp } from '@react-icons/all-files/ti/TiArrowSortedUp';
import React, { ReactElement } from 'react';
import { useRecoilState } from 'recoil';

import { Music } from '../models/music';
import { SortItem } from '../models/sort_item';
import * as style from '../pages/index.module.css';
import { sortItemState } from '../recoil/sortItemState';
import { sortOrderByAscState } from '../recoil/sortOrderByAsc';

interface Props {
  songs: Music[];
  playlist: number[];
  playlistIndex: number;
  playBySongId: (id: number) => void;
}

export const SongList = ({
  songs,
  playlist,
  playlistIndex,
  playBySongId
}: Props): ReactElement => {
  const [sortItem, setSortItem] = useRecoilState(sortItemState);
  const [sortOrderByAsc, setSortOrderByAsc] =
    useRecoilState(sortOrderByAscState);

  const handleOnSortPlayList = (newSortItem: SortItem): void => {
    setSortItem(newSortItem);

    if (sortItem === newSortItem) {
      setSortOrderByAsc(!sortOrderByAsc);
    } else {
      setSortOrderByAsc(true);
    }
  };

  return (
    <div className={style.songList}>
      <table>
        <thead>
          <tr>
            <th className={style.songCursor}></th>
            <th
              className={style.songTitle}
              onClick={() => handleOnSortPlayList('title')}
            >
              Title
              <span className={style.sortIcon}>
                {sortItem === 'title' && sortOrderByAsc && (
                  <TiArrowSortedUp size={16} />
                )}
                {sortItem === 'title' && !sortOrderByAsc && (
                  <TiArrowSortedDown size={16} />
                )}
              </span>
            </th>
            <th
              className={style.songArtist}
              onClick={() => handleOnSortPlayList('artist')}
            >
              Artist
              <span className={style.sortIcon}>
                {sortItem === 'artist' && sortOrderByAsc && (
                  <TiArrowSortedUp size={16} />
                )}
                {sortItem === 'artist' && !sortOrderByAsc && (
                  <TiArrowSortedDown size={16} />
                )}
              </span>
            </th>
            <th
              className={style.songSource}
              onClick={() => handleOnSortPlayList('source')}
            >
              Source
              <span className={style.sortIcon}>
                {sortItem === 'source' && sortOrderByAsc && (
                  <TiArrowSortedUp size={16} />
                )}
                {sortItem === 'source' && !sortOrderByAsc && (
                  <TiArrowSortedDown size={16} />
                )}
              </span>
            </th>
            <th className={style.songAction}>
              <FaYoutube />
            </th>
          </tr>
        </thead>
        <tbody>
          {songs.map(song => {
            const isCurrentPlaying = playlist[playlistIndex] === song.id;

            return (
              <tr
                key={song.id}
                style={isCurrentPlaying ? { backgroundColor: '#FFF1F3' } : {}}
              >
                <td className={style.songCursor}>
                  {isCurrentPlaying && <BsPlayFill />}
                </td>
                <td
                  className={style.songTitle}
                  onClick={() => {
                    playBySongId(song.id);
                  }}
                >
                  {song.title ?? '--'}
                </td>
                <td
                  className={style.songArtist}
                  onClick={() => {
                    playBySongId(song.id);
                  }}
                >
                  {song.artist ?? '--'}
                </td>
                <td
                  className={style.songSource}
                  title={song.videoTitle}
                  onClick={() => {
                    playBySongId(song.id);
                  }}
                >
                  {song.videoTitle}
                </td>
                <td className={style.songAction}>
                  <a target="_blank" href={song.youtubeUrl} rel="noreferrer">
                    <FiExternalLink />
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
