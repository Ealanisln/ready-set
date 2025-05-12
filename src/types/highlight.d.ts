import { H as HighlightType } from 'highlight.run';

declare global {
  interface Window {
    H: typeof HighlightType;
  }
}

export {}; 