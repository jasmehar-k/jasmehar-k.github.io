import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {
    /* core NES-derived palette */
    --ink: #0f0f1b;
    --paper: #fffef7;
    --sky: #5c94fc;
    --gold: #fbd000;
    --gold-dark: #cc9500;
    --brick: #c84c0c;
    --pipe: #43b047;
    --pipe-dark: #2e7d32;
    --mario-red: #e52521;

    /* underground (world 1-2) */
    --ug-bg: #10101e;
    --ug-brick: #4a6cd4;
    --ug-text: #d8e2ff;

    /* castle (world 1-4) */
    --castle-bg: #17171d;
    --castle-stone: #8f8f9c;
    --castle-glow: #ff7b3d;

    /* underwater (world 2-2) */
    --water: #0d4fc4;
    --water-deep: #062a6e;
    --water-text: #e2f1ff;

    --hud-h: 56px;

    --font-pixel: 'Press Start 2P', cursive;
    --font-body: 'Rubik', -apple-system, sans-serif;
  }

  html, body {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    background: var(--ink);
  }

  * {
    box-sizing: border-box;
  }

  body {
    font-family: var(--font-body);
    color: var(--ink);
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

export default GlobalStyle;
