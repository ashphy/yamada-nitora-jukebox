import dayjs, { Dayjs } from 'dayjs';
import { SortItem } from './sort_item';

function assertIsDefined<T>(val: T): asserts val is NonNullable<T> {
  if (val === undefined || val === null) {
    throw new Error(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `Expected 'val' to be defined, but received ${val}`
    );
  }
}

interface MusicNode {
  start?: string | null
  end?: string | null
  video?: {
    videoId?: string | null
    videoTitle?: string | null
    date?: any | null
  } | null
  meta?: {
    ja?: {
      artist?: string | null
      title?: string | null
    } | null
  } | null
}

export class Music {
  id: number

  videoId: string;
  videoTitle: string;
  date: Dayjs;

  start: number | undefined
  end: number | undefined

  artist: string
  title: string

  constructor(id: number, node: MusicNode) {
    assertIsDefined(node.video);
    assertIsDefined(node.video.videoId);
    assertIsDefined(node.video.videoTitle);
    assertIsDefined(node.video.date);
    assertIsDefined(node.meta);
    assertIsDefined(node.meta.ja);
    assertIsDefined(node.meta.ja);
    assertIsDefined(node.meta.ja.artist);
    assertIsDefined(node.meta.ja.title);

    this.id = id;

    this.videoId = node.video.videoId;
    this.videoTitle = node.video.videoTitle;
    this.date = dayjs(node.video.date, 'YYYY-MM-DD');

    this.start = (node.start != null) ? this.convertTimeToSeconds(node.start) : undefined;
    this.end = (node.end != null) ? this.convertTimeToSeconds(node.end) : undefined;

    this.artist = node.meta.ja.artist;
    this.title = node.meta.ja.title;
  }

  get youtubeUrl(): string {
    const t = this.start != null ? `&t=${this.start}` : '';
    return `https://www.youtube.com/watch?v=${this.videoId}${t}`;
  }

  static getSorter = (sortItem: SortItem): ((a: Music, b: Music) => number) | undefined => {
    switch (sortItem) {
      case 'title':
        return (a, b) => {
          const c = new Intl.Collator('ja').compare;
          return c(a.title, b.title);
        };
      case 'artist':
        return (a, b) => {
          const c = new Intl.Collator('ja').compare;
          return c(a.artist, b.artist);
        };
      case 'source':
        // Sort by video published date
        return (a, b) => {
          const dateDiff = a.date.diff(b.date);
          if (dateDiff === 0) {
            if ((a.start != null) && (b.start != null)) {
              return a.start - b.start;
            }
          }
          return a.date.diff(b.date);
        };
      default:
        return undefined;
    }
  }

  convertTimeToSeconds = (time: string): number => {
    return time.split(':').reverse().reduce((sum, item, index) => {
      return sum + (parseInt(item) * (60 ** index));
    }, 0);
  }
}
