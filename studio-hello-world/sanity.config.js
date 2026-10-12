/* global process */

import {defineConfig} from 'sanity'
import {presentationTool} from 'sanity/presentation'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {documentInternationalization} from '@sanity/document-internationalization'
import {languages} from './config/languages'
import {locations} from './presentation/resolve'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'
import {baseLanguageId} from './config/languages'

import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'studio-hello-world',

  projectId: 'rld1c3fq',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S, context) =>
        S.list()
          .title('Content')
          .items([
            orderableDocumentListDeskItem({
              type: 'post',
              title: 'Posts order',
              id: 'post-order',
              filter: 'language == $language',
              params: {
                language: baseLanguageId,
              },
              createIntent: false,
              S,
              context,
            }),

            ...S.documentTypeListItems(),
          ]),
    }),
    presentationTool({
      previewUrl: {
        initial: process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:3000',

        previewMode: () => ({
          enable: '/api/draft-mode/enable',
          disable: '/api/draft-mode/disable',
        }),
      },

      allowOrigins: ['http://localhost:3000', ...languages.map(({siteUrl}) => siteUrl)],

      resolve: {
        locations,
      },
    }),
    visionTool(),
    documentInternationalization({
      supportedLanguages: languages.map(({id, title}) => ({
        id,
        title,
      })),
      schemaTypes: ['post'],
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
