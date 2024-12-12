'use client'

/**
 * This configuration is used to for the Sanity Studio that's mounted on the `/app/studio/[[...tool]]/page.tsx` route
 */

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {apiVersion, dataset, projectId} from './src/sanity/env'
import {schema} from './src/sanity/schema'
import { seoMetaFields } from "sanity-plugin-seo";


export default defineConfig({
  basePath: '/studio',
  name: 'default',
  title: 'Ready Set Blog',
  
  // Use the imported values from env.ts
  projectId,
  dataset,
  
  // Add and edit the content schema in the './sanity/schema' folder
  schema,
  
  plugins: [
    structureTool(),
    // Vision is a tool that lets you query your content with GROQ in the studio
    visionTool({defaultApiVersion: apiVersion}),
    seoMetaFields(),
  ],
})