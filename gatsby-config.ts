import type { GatsbyConfig } from "gatsby"

const config: GatsbyConfig = {
  siteMetadata: {
    title: `山田ニトラ ジュークボックス`,
    description: '山田ニトラさんが歌った楽曲をまとめて再生できるサイトです。',
    siteUrl: `https://jukebox.ashphy.com`,
    keywords: '山田ニトラ,ニトラ大爆発'
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/src/data/`,
      },
    },
    `gatsby-transformer-yaml`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/data/`,
      },
    },
    `gatsby-plugin-graphql-codegen`,
    `gatsby-plugin-use-query-params`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `山田ニトラジュークボックス`,
        short_name: `ニトラジュークボックス`,
        start_url: `/`,
        background_color: `#b43227`,
        theme_color: `#b43227`,
        display: `standalone`,
        icon: `src/images/icon.png`
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-s3`,
      options: {
        bucketName: "jukebox.ashphy.com",
      },
    },
  ],
}

export default config
