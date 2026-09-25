import { defineQuery } from "next-sanity";

export const POSTS_QUERY = defineQuery(
  `*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc)[0...12]{_id, title, slug, publishedAt}`,
);
export const POST_QUERY = defineQuery(
  `*[_type == "post" && slug.current == $slug][0]`,
);
