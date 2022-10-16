import * as style from '../components/twitter_share.module.css';
import { FaTwitter } from '@react-icons/all-files/fa/FaTwitter';
import React from 'react';
import { Music } from '../models/music';

interface Props {
  song: Music
}

export const TwitterShare: React.FC<Props> = ({ song }) => {
  const tweetText = (): string => {
    return encodeURIComponent(`#山田ニトラジュークボックス で「${song.title}」を聞いています。`);
  }

  const tweetUrl = (): string => {
    return encodeURIComponent(`https://jukebox.ashphy.com/?i=${song.id}`);
  }

  return (
    <p className={style.share}>
      <a href={`https://twitter.com/intent/tweet?text=${tweetText()}&url=${tweetUrl()}`}
         target='_blank' rel="noreferrer">
        <FaTwitter/> <span className={style.shareText}>今聞いている曲をTwitterでシェア</span>
      </a>
    </p>
  );
}
