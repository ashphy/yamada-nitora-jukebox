import { JukeBoxStatus } from '../../enums/jukeboxStatus';
import { IoPause } from '@react-icons/all-files/io5/IoPause';
import * as style from '../../pages/index.module.css';
import { IoPlayCircle } from '@react-icons/all-files/io5/IoPlayCircle';
import React, { ReactElement } from 'react';

interface Props {
  jukeboxStatus: JukeBoxStatus;
  onPlay: () => void;
  onPause: () => void;
}

export const PlayButton = ({
  jukeboxStatus,
  onPause,
  onPlay
}: Props): ReactElement => {
  return jukeboxStatus === 'play' ? (
    <IoPause size="5em" className={style.controlIcon} onClick={onPause} />
  ) : (
    <IoPlayCircle size="5em" className={style.controlIcon} onClick={onPlay} />
  );
};
