const { load } = require('js-yaml')
const { readFileSync } = require('fs')

type Musics = {
    video: string,
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

type Videos = {
    videoId: string,
    videoTitle: string,
    date: string
}

const loadYaml = <T = ReturnType<typeof load>>(...args: Parameters<typeof load>): T => load(...args);

const loadYamlFromFile = <T>(fileName: string) => {
    return loadYaml<T[]>(readFileSync(fileName, 'utf8'));
}

const createSetList = () => {
    const musics = loadYamlFromFile<Musics>('./src/data/music.yaml');
    const videos = loadYamlFromFile<Videos>('./src/data/video.yaml');

    let currentVideoId = '';
    let listIndex = 0;

    musics.forEach((music) => {
        if (currentVideoId !== music.video) {
            // next video
            currentVideoId = music.video;
            listIndex = 1;

            const video = videos.find((video) => video.videoId === currentVideoId)

            console.log('');
            console.log(video?.videoTitle);
            console.log('■ セトリ / Set List');
        }

        console.log(`${String(listIndex).padStart(2, '0')}. ${music.start} ${music.meta.ja.title} / `);

        listIndex++;
    });
}

createSetList();