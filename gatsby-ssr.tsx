import React from 'react';
import { RecoilRoot } from 'recoil';
import { RecoilURLSyncJSON } from 'recoil-sync';

import './src/pages/global.css';

export const wrapRootElement = ({ element }: any) => {
  return (
    <RecoilRoot>
      <RecoilURLSyncJSON
        location={{ part: 'queryParams' }}
        browserInterface={{
          replaceURL: (url: string) => history.replaceState(null, '', url),
          pushURL: (url: string) => history.pushState(null, '', url),
          getURL: () => 'https://jukebox.ashphy.com/',
          listenChangeURL: (handleUpdate: () => void) => {
            window.addEventListener('popstate', handleUpdate);
            return () => window.removeEventListener('popstate', handleUpdate);
          }
        }}
      >
        {element}
      </RecoilURLSyncJSON>
    </RecoilRoot>
  );
};
