import { atom } from 'recoil';

import { SortItem } from '../models/sort_item';

export const sortItemState = atom<SortItem>({
  key: 'SortItem',
  default: 'source'
});
