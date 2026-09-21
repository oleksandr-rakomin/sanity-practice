import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "rld1c3fq",
  dataset: "production",
  apiVersion: "2026-05-15",
  useCdn: true,
});
