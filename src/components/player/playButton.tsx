import { IoPause } from '@react-icons/all-files/io5/IoPause';
import { IoPlayCircle } from '@react-icons/all-files/io5/IoPlayCircle';
import React, { ReactElement } from 'react';

import { JukeBoxStatus } from '../../enums/jukeboxStatus';
import * as style from '../../pages/index.module.css';

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
