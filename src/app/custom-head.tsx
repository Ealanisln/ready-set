// src/app/CustomHead.tsx
import Head from 'next/head'
import { siteVerification } from './metadata'

export default function CustomHead() {
  return (
    <Head>
      <meta name="google-site-verification" content={siteVerification.google} />
    </Head>
  )
}