import { AppRouterHighlight } from '@highlight-run/next/server'
import { CONSTANTS } from '../constants'

export const withAppRouterHighlight = AppRouterHighlight({
  projectID: CONSTANTS.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID,
}) 