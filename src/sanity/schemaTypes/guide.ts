// src/sanity/schemaTypes/guide.ts
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'guide',
  title: 'Guide',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string'
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'category'}],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'introduction',
      title: 'Introduction',
      type: 'array',
      of: [{type: 'block'}]
    }),
    defineField({
      name: 'sections',
      title: 'Content Sections',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {
            name: 'title',
            title: 'Section Title',
            type: 'string'
          },
          {
            name: 'content',
            title: 'Section Content',
            type: 'array',
            of: [{type: 'block'}]
          },
          {
            name: 'bulletPoints',
            title: 'Bullet Points',
            type: 'array',
            of: [{type: 'string'}]
          }
        ]
      }]
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true
      }
    }),
    defineField({
      name: 'calendarUrl',
      title: 'Calendar URL',
      type: 'url'
    }),
    defineField({
      name: 'ctaText',
      title: 'Download CTA Text',
      type: 'string',
      initialValue: 'Download Now'
    }),
    defineField({
      name: 'consultationCta',
      title: 'Consultation CTA Text',
      type: 'string',
      initialValue: 'Book A Consultation Today'
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seoMetaFields'
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      media: 'coverImage',
      metaTitle: 'seo'
    },
    prepare({ title, subtitle, media, metaTitle }) {
      return {
        title: metaTitle?.metaTitle || title,
        subtitle,
        media
      }
    }
  }
})