import { CONSTANTS } from './src/constants'

export async function register() {
  const { registerHighlight } = await import('@highlight-run/next/server')

  registerHighlight({
    projectID: CONSTANTS.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID,
    serviceName: 'ready-set-backend',
  })
} 