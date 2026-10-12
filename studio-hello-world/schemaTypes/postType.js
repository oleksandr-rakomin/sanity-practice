import {defineArrayMember, defineField, defineType} from 'sanity'
import {orderRankField} from '@sanity/orderable-document-list'

export const postType = defineType({
  name: 'post',
  type: 'document',
  fields: [
    orderRankField({
      type: 'post',
    }),

    defineField({
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),

    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: {
          previews: [
            {
              title: '16:9',
              aspectRatio: 16 / 9,
            },
            {
              title: '4:3',
              aspectRatio: 4 / 3,
            },
            {
              title: '1:1',
              aspectRatio: 1,
            },
          ],
        },
      },
    }),
    defineField({
      name: 'body',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
    }),
  ],
})
