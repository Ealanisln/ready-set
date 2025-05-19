import { CONSTANTS } from './src/constants'

export async function register() {
  if (process.env.NEXT_RUNTIME === 'edge') {
    // Handle edge runtime differently if needed
    const { registerHighlight } = await import('@highlight-run/next/server')
    try {
      registerHighlight({
        projectID: CONSTANTS.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID,
        serviceName: 'ready-set-backend',
        // Don't collect telemetry for Edge runtime to avoid errors
      })
    } catch (error) {
      console.error('Failed to initialize Highlight in Edge runtime:', error)
    }
  } else {
    // Regular Node.js runtime
    const { registerHighlight } = await import('@highlight-run/next/server')
    try {
      registerHighlight({
        projectID: CONSTANTS.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID,
        serviceName: 'ready-set-backend',
      })
    } catch (error) {
      console.error('Failed to initialize Highlight:', error)
    }
  }
} 