import { defineQuery } from "next-sanity";

export const POSTS_QUERY = defineQuery(
  `*[
    _type == "post"
    && defined(slug.current)
    && language == $language
  ]{
    _id,
    title,
    slug,
    publishedAt,

    "baseOrderRank": select(
      $language == $baseLanguage => orderRank,

      *[
        _type == "translation.metadata"
        && references(^._id)
      ][0]
        .translations[language == $baseLanguage][0]
        .value->orderRank
    )
  }
  | order(baseOrderRank asc)[0...12]{
    _id,
    title,
    slug,
    publishedAt
  }`,
);

export const POST_QUERY = defineQuery(
  `*[
    _type == "post"
    && slug.current == $slug
    && language == $language
  ][0]`,
);
