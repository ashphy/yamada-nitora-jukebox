import {
  asType,
  nullable,
  object,
  optional,
  string,
  writableArray
} from '@recoiljs/refine';
import { SongsQuery } from '../../graphql-types';
import { Music } from '../models/music';

test('adds 1 + 2 to equal 3', () => {
  const checker = asType<SongsQuery['allMusic']['nodes'], Music[]>(
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
      console.log('TEST RECOIL STATE');
      return nodes.map((node, index) => {
        console.log('NODE', node);
        return new Music(index, node);
      });
    }
  );

  console.log(
    'TEST!!!',
    checker([
      {
        video: {
          videoId: 'videoId',
          videoTitle: 'videoTitle',
          date: '2020-01-01'
        },
        meta: {
          ja: {
            artist: 'artist',
            title: 'title'
          }
        }
      }
    ])
  );
  // assert(callbackResult.type === 'success', 'should succeed');
});

// test('array', () => {
//   const numbers = [1, 2, 3, 4, 5];

//   const squaredNumbers = numbers.map(num => {
//     if (num === 3) {
//       throw new Error('例外が発生しました');
//     }
//     return num * num;
//   });

//   console.log(squaredNumbers);
// });
