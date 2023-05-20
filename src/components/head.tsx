import React, { ReactElement } from 'react';
import ogp_image from '../images/icon.png';
import { graphql, HeadProps, useStaticQuery } from 'gatsby';

export const Head = (props: HeadProps): ReactElement => {
  const { site } = useStaticQuery<Queries.SEOQuery>(query);

  const title = site?.siteMetadata?.title ?? '';
  const description = site?.siteMetadata?.description ?? '';
  const siteUrl = site?.siteMetadata?.siteUrl ?? '';
  const keywords = site?.siteMetadata?.keywords ?? '';
  const defaultImage = `${siteUrl}${ogp_image}`;

  return (
    <>
      <title>{title}</title>

      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      <meta name="og:type" content="website" />
      <meta name="og:url" content={siteUrl} />
      <meta name="og:title" content={title} />
      <meta name="og:description" content={description} />
      <meta name="og:image" content={defaultImage} />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:creator" content="@ashphy" />
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
