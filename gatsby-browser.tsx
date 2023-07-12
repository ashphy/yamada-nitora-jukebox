import React from 'react';
import { RecoilRoot } from 'recoil';
import { RecoilURLSyncJSON } from 'recoil-sync';

import './src/pages/global.css';

export const wrapRootElement = ({ element }: any) => {
  return (
    <RecoilRoot>
      <RecoilURLSyncJSON location={{ part: 'queryParams' }}>
        {element}
      </RecoilURLSyncJSON>
    </RecoilRoot>
  );
};
