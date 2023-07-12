import {
  asType,
  nullable,
  object,
  optional,
  string,
  writableArray
} from '@recoiljs/refine';
import { atom } from 'recoil';
import { syncEffect } from 'recoil-sync';

import { SongsQuery } from '../../graphql-types';
import { Music } from '../models/music';

export const songListState = atom({
  key: 'SongList',
  default: [] as Music[],
  effects: [
    syncEffect({
      storeKey: 'pre-defined-music-list',
      refine: asType<SongsQuery['allMusic']['nodes'], Music[]>(
        writableArray(
          object({
            start: optional(nullable(string())),
            end: optional(nullable(string())),
            video: optional(
              nullable(
                object({
                  videoId: optional(nullable(string())),
                  videoTitle: optional(nullable(string())),
                  date: optional(nullable(string()))
                })
              )
            ),
            meta: object({
              ja: object({
                artist: string(),
                title: string()
              })
            })
          })
        ),
        nodes => {
          return nodes.map((node, index) => new Music(index, node));
        }
      )
    })
  ]
});
