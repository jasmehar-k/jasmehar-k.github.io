import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {
    /* used by the arcade intro overlay */
    --font-pixel: 'Press Start 2P', cursive;
  }

  /* Remove horizontal scroll */
  html, body {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }

  * {
    box-sizing: border-box;
  }
`;

export default GlobalStyle;