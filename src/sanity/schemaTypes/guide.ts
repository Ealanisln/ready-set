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
      type: 'string',
      validation: Rule => Rule.required()
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
      of: [{type: 'block'}],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'mainContent',
      title: 'Main Content Sections',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {
            name: 'title',
            title: 'Section Title',
            type: 'string',
            validation: Rule => Rule.required()
          },
          {
            name: 'content',
            title: 'Section Content',
            type: 'array',
            of: [{type: 'block'}]
          }
        ],
        preview: {
          select: {
            title: 'title'
          }
        }
      }]
    }),
    defineField({
      name: 'listSections',
      title: 'List Sections',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {
            name: 'title',
            title: 'Section Title',
            type: 'string',
            validation: Rule => Rule.required()
          },
          {
            name: 'items',
            title: 'List Items',
            type: 'array',
            of: [{
              type: 'object',
              fields: [
                {
                  name: 'title',
                  title: 'Item Title',
                  type: 'string'
                },
                {
                  name: 'content',
                  title: 'Item Content',
                  type: 'text',
                  validation: Rule => Rule.required()
                }
              ],
              preview: {
                select: {
                  title: 'title',
                  subtitle: 'content'
                },
                prepare({ title, subtitle }) {
                  return {
                    title: title || subtitle?.slice(0, 50) + '...',
                    subtitle: title ? subtitle?.slice(0, 50) + '...' : ''
                  }
                }
              }
            }]
          }
        ],
        preview: {
          select: {
            title: 'title',
            items: 'items'
          },
          prepare({ title, items }) {
            return {
              title,
              subtitle: `${items?.length || 0} items`
            }
          }
        }
      }]
    }),
    defineField({
      name: 'conclusion',
      title: 'Conclusion Paragraphs',
      type: 'array',
      of: [{type: 'block'}]
    }),
    defineField({
      name: 'callToAction',
      title: 'Call to Action',
      type: 'text'
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'calendarUrl',
      title: 'Calendar URL',
      type: 'url',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'downloadUrl',
      title: 'Guide Download URL',
      type: 'url',
      description: 'URL where the guide PDF or document can be downloaded',
      validation: Rule => Rule.required()
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