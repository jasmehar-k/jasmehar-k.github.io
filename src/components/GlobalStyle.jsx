import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {
    /* used by the arcade intro overlay */
    --font-pixel: 'Press Start 2P', cursive;
  }

  /* Remove horizontal scroll.
     'hidden' on body makes body its own scroll container, which silently breaks
     position: sticky for every descendant. 'clip' clips without scrolling, so the
     pinned sections keep working. Older browsers ignore it and fall back to hidden. */
  html, body {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    overflow-x: clip;
  }

  * {
    box-sizing: border-box;
  }
`;

export default GlobalStyle;