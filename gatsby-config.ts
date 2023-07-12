import type { GatsbyConfig } from 'gatsby';
import path from 'path';

const config: GatsbyConfig = {
  flags: {
    DEV_SSR: true
  },
  siteMetadata: {
    title: '山田ニトラ ジュークボックス',
    description: '山田ニトラさんが歌った楽曲をまとめて再生できるサイトです。',
    siteUrl: 'https://jukebox.ashphy.com',
    keywords: '山田ニトラ,ニトラ大爆発'
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  trailingSlash: `always`,
  plugins: [
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'pages',
        path: path.join(__dirname, 'src/data/')
      }
    },
    {
      resolve: 'gatsby-transformer-yaml',
      options: {
        typeName: ({ node }: { node: { name: string } }) => {
          return node.name.charAt(0).toUpperCase() + node.name.slice(1);
        }
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: path.join(__dirname, 'src/data')
      }
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: '山田ニトラジュークボックス',
        short_name: 'ニトラジュークボックス',
        start_url: '/',
        background_color: '#b43227',
        theme_color: '#b43227',
        display: 'standalone',
        icon: 'src/images/icon.png'
      }
    },
    {
      resolve: 'gatsby-plugin-s3',
      options: {
        bucketName: 'jukebox.ashphy.com'
      }
    },
    'gatsby-plugin-dts-css-modules'
  ]
};

export default config;
