import { RiRepeat2Line } from '@react-icons/all-files/ri/RiRepeat2Line';
import * as style from '../../pages/index.module.css';
import { RiRepeatOneLine } from '@react-icons/all-files/ri/RiRepeatOneLine';
import React, { ReactElement } from 'react';
import { RepeatMode } from '../../enums/repeatMode';

interface Props {
  repeatMode: RepeatMode;
  onChangeRepeatMode: (mode: RepeatMode) => void;
}

export const RepeatButton = ({
  repeatMode,
  onChangeRepeatMode
}: Props): ReactElement => {
  const handleOnChangeRepeatMode = (): void => {
    switch (repeatMode) {
      case 'none':
        onChangeRepeatMode('all');
        break;
      case 'all':
        onChangeRepeatMode('one');
        break;
      case 'one':
        onChangeRepeatMode('none');
        break;
    }
  };

  switch (repeatMode) {
    case 'none':
      return (
        <RiRepeat2Line
          size="3em"
          className={style.controlIcon}
          onClick={handleOnChangeRepeatMode}
        />
      );
    case 'all':
      return (
        <RiRepeat2Line
          size="3em"
          className={style.controlIconEnable}
          onClick={handleOnChangeRepeatMode}
        />
      );
    case 'one':
      return (
        <RiRepeatOneLine
          size="3em"
          className={style.controlIconEnable}
          onClick={handleOnChangeRepeatMode}
        />
      );
    default:
      return <></>;
  }
};
