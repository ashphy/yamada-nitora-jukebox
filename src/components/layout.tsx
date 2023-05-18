import { graphql, useStaticQuery } from 'gatsby';
import React, { ReactElement } from 'react';
import { Helmet } from 'react-helmet';

import ogp_image from '../images/icon.png';

type LayoutProps = Required<{
  readonly children: ReactElement;
}>;

export const Layout = ({ children }: LayoutProps): JSX.Element => {
  const { site } = useStaticQuery<Queries.SEOQuery>(query);

  const title = site?.siteMetadata?.title ?? '';
  const description = site?.siteMetadata?.description ?? '';
  const siteUrl = site?.siteMetadata?.siteUrl ?? '';
  const keywords = site?.siteMetadata?.keywords ?? '';

  const defaultImage = `${siteUrl}${ogp_image}`;

  return (
    <>
      <Helmet title={title}>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />

        <meta name="og:type" content="website" />
        <meta name="og:url" content={siteUrl} />
        <meta name="og:title" content={title} />
        <meta name="og:description" content={description} />
        <meta name="og:image" content={defaultImage} />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:creator" content="@ashphy" />
      </Helmet>
      {children}
      <footer>
        <p>
          このサイトは非公式ファンサイトです。
          <a target="_blank" href="https://twitter.com/ashphy" rel="noreferrer">
            あしゅふぃ（@ashphy）
          </a>
          が制作しました。
        </p>
        <p>
          イラスト制作:{' '}
          <a
            href="https://twitter.com/ikutoseyuki"
            target={'_blank'}
            rel="noreferrer"
          >
            幾年ユキ様 (@ikutoseyuki)
          </a>
        </p>
      </footer>
    </>
  );
};

const query = graphql`
  query SEO {
    site {
      siteMetadata {
        title
        description
        siteUrl: siteUrl
        keywords
      }
    }
  }
`;
