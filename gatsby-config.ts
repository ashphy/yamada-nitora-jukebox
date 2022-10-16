import type { GatsbyConfig } from 'gatsby'
import path from 'path';

const config: GatsbyConfig = {
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
    'gatsby-plugin-use-query-params',
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
    'gatsby-plugin-offline',
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-s3',
      options: {
        bucketName: 'jukebox.ashphy.com'
      }
    },
    'gatsby-plugin-dts-css-modules'
  ]
}

export default config
