import { PortableText } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url";
import { sanityFetch } from "@/sanity/lib/live";
import { client } from "@/sanity/lib/client";
import { POST_QUERY } from "@/sanity/lib/queries";
import Link from "next/link";
import { APP_LOCALE } from "@/sanity/lib/locale";

const { projectId, dataset } = client.config();
const urlFor = (source) =>
  projectId && dataset
    ? createImageUrlBuilder({ projectId, dataset }).image(source)
    : null;

export default async function PostPage({ params }) {
  const { slug } = await params;

  const { data: post } = await sanityFetch({
    query: POST_QUERY,
    params: { slug, language: APP_LOCALE },
  });

  const postImageUrl = post.image
    ? urlFor(post.image)
        ?.width(550)
        .height(310)
        .auto("format")
        .quality(80)
        .url()
    : null;

  return (
    <main className="container mx-auto min-h-screen max-w-3xl p-8 flex flex-col gap-4">
      <Link href="/" className="hover:underline">
        ← Back to posts
      </Link>
      {postImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={postImageUrl}
          alt={post.title}
          className="aspect-video rounded-xl"
          width="550"
          height="310"
        />
      )}
      <h1 className="text-4xl font-bold mb-8">{post.title}</h1>
      <div className="prose">
        <p>Published: {new Date(post.publishedAt).toLocaleDateString()}</p>
        {Array.isArray(post.body) && <PortableText value={post.body} />}
      </div>
    </main>
  );
}
