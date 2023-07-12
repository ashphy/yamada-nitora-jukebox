import { PageProps, graphql } from 'gatsby';
import React from 'react';
import GitHubButton from 'react-github-btn';
import { RecoilSync } from 'recoil-sync';

import { SongsQuery } from '../../graphql-types';
import { JukeBox } from '../components/jukebox';
import { Layout } from '../components/layout';
import * as style from '../pages/index.module.css';

const IndexPage: React.FC<PageProps<SongsQuery>> = ({ data, params }) => {
  return (
    <RecoilSync
      storeKey="pre-defined-music-list"
      read={() => {
        return data.allMusic.nodes;
      }}
    >
      <Layout>
        <main className={style.main}>
          <header className={style.header}>
            <h1>山田ニトラ ジュークボックス</h1>

            <div className={style.githubStar}>
              <GitHubButton
                href="https://github.com/ashphy/yamada-nitora-jukebox"
                data-icon="octicon-star"
                aria-label="Star ashphy/yamada-nitora-jukebox on GitHub"
              >
                Star
              </GitHubButton>
            </div>
          </header>

          <JukeBox />
        </main>
      </Layout>
    </RecoilSync>
  );
};

export const query = graphql`
  query Songs {
    allMusic {
      nodes {
        video {
          videoId
          videoTitle
          date
        }
        start
        end
        meta {
          ja {
            artist
            title
          }
        }
      }
    }
  }
`;

export default IndexPage;

export { Head } from '../components/head';
