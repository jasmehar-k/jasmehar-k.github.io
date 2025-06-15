import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
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