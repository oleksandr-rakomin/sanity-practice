import { syncTagInvalidateEventHandler } from "@sanity/functions";

export const handler = syncTagInvalidateEventHandler(
  async ({ event, done }) => {
    const revalidateUrl = process.env.NEXTJS_REVALIDATE_URL;
    const secret = process.env.SANITY_REVALIDATE_TAGS_SECRET;

    if (!revalidateUrl || !secret) {
      throw new Error("Missing revalidation environment variables");
    }

    const revalidateResponse = await fetch(
      `${revalidateUrl}?secret=${encodeURIComponent(secret)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tags: event.data.syncTags,
        }),
      },
    );

    if (!revalidateResponse.ok) {
      throw new Error(
        `Next.js revalidation failed with HTTP ${revalidateResponse.status}`,
      );
    }

    try {
      const doneResponse = await done(event.data.syncTags);

      if (!doneResponse.ok) {
        throw new Error(
          `Sanity done callback failed with HTTP ${doneResponse.status}`,
        );
      }

      console.log(
        "Invalidation complete, Sanity responded with HTTP",
        doneResponse.status,
      );
    } catch (error) {
      console.error("Error invoking Sanity invalidation done endpoint!", error);

      throw error;
    }
  },
);
