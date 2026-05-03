import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html, body, #root {
    margin: 0;
    padding: 0;
    min-height: 100%;
  }

  * {
    box-sizing: border-box;
  }

  html {
    overflow-x: hidden;
    background: #05070d;
  }

  body {
    overflow-x: hidden;
    background: #05070d;
  }

  #root {
    isolation: isolate;
  }
`;

export default GlobalStyle;
