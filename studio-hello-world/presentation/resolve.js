import {defineLocations} from 'sanity/presentation'
import {languages} from '../config/languages'

export const locations = {
  post: defineLocations({
    select: {
      title: 'title',
      slug: 'slug.current',
      language: 'language',
    },

    resolve: (doc) => {
      const language = languages.find((item) => item.id === doc?.language)

      if (!language || !doc?.slug) {
        return {
          locations: [],
        }
      }

      return {
        locations: [
          {
            title: doc?.title || 'Untitled',
            href: `${language.siteUrl}/${doc.slug}`,
          },
        ],
      }
    },
  }),
}
