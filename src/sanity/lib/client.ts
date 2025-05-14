import { createClient } from 'next-sanity'
import  imageUrlBuilder from '@sanity/image-url'

import { apiVersion, dataset, projectId, useCdn } from '../env'

export const client = createClient({
  apiVersion,
  dataset,
  projectId,
  useCdn,
  // Disable stega encoding to avoid arrayBuffer issues during build
  stega: false,
})

const builder = imageUrlBuilder(client)

export function urlFor( source:any ) {
    return builder.image(source)
}