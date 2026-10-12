import { syncTagInvalidateEventHandler } from "@sanity/functions";

export const handler = syncTagInvalidateEventHandler(
  async ({ event, done }) => {
    const revalidateUrls = process.env.NEXTJS_REVALIDATE_URLS?.split(",")
      .map((url) => url.trim())
      .filter(Boolean);

    const secret = process.env.SANITY_REVALIDATE_TAGS_SECRET;

    if (!revalidateUrls?.length || !secret) {
      throw new Error("Missing revalidation environment variables");
    }

    await Promise.all(
      revalidateUrls.map(async (revalidateUrl) => {
        const response = await fetch(
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

        if (!response.ok) {
          throw new Error(
            `Next.js revalidation failed for ${revalidateUrl} with HTTP ${response.status}`,
          );
        }

        console.log(
          `Next.js revalidation complete for ${revalidateUrl} with HTTP ${response.status}`,
        );
      }),
    );

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
