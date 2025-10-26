import React, { ReactElement } from 'react';

import * as style from './layout.module.css';

type LayoutProps = Required<{
  readonly children: ReactElement;
}>;

export const Layout = ({ children }: LayoutProps): ReactElement => {
  return (
    <div className={style.layout}>
      <div className={style.mainArea}>{children}</div>
      <footer>
        <p>
          このサイトは非公式ファンサイトです。
          <a target="_blank" href="https://twitter.com/ashphy" rel="noreferrer">
            あしゅふぃ（@ashphy）
          </a>
          が制作しました。
        </p>
        <p>
          イラスト制作:{' '}
          <a
            href="https://twitter.com/ikutoseyuki"
            target={'_blank'}
            rel="noreferrer"
          >
            幾年ユキ様 (@ikutoseyuki)
          </a>
        </p>
      </footer>
    </div>
  );
};
