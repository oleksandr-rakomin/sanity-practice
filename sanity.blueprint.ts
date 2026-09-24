import {
  defineBlueprint,
  defineSyncTagInvalidateFunction,
} from "@sanity/blueprints";

export default defineBlueprint({
  resources: [
    defineSyncTagInvalidateFunction({
      name: "invalidate-tags",
      event: {
        resource: {
          type: "dataset",
          id: "rld1c3fq.production",
        },
      },
    }),
  ],
});
