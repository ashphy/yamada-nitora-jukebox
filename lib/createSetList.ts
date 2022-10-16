const { load } = require('js-yaml')
const { readFileSync } = require('fs')

type Musics = {
    videoId: string,
    videoTitle: string,
    start: string,
    end: string,
    meta: {
        ja: {
            title: string,
            artist: string
        }
    }
}

const loadYaml = <T = ReturnType<typeof load>>(...args: Parameters<typeof load>): T => load(...args);

const loadMusics = () => {
    return loadYaml<Musics[]>(readFileSync('./src/data/music.yaml', 'utf8'));
}

const createSetList = () => {
    const musics = loadMusics();

    let currentVideoId = '';
    let listIndex = 0;

    musics.forEach((music) => {
        if (currentVideoId !== music.videoId) {
            // next video
            currentVideoId = music.videoId;
            listIndex = 1;

            console.log('');
            console.log(music.videoTitle);
            console.log('■ セトリ / Set List');
        }

        console.log(`${String(listIndex).padStart(2, '0')}. ${music.start} ${music.meta.ja.title} / `);

        listIndex++;
    });
}

createSetList();