import { createGlobalStyle, css } from '@react-hive/honey-style';

export const GlobalStyle = createGlobalStyle`
  ${() => css`
    body {
      margin: 0;
      padding: 0;

      font-family: 'Roboto', sans-serif;
      font-weight: 400;
      font-style: normal;
    }

    html,
    body,
    #root {
      display: flex;
      flex-direction: column;
      flex-grow: 1;

      min-height: 100%;
    }

    a,
    a:hover,
    a:focus,
    a:active {
      text-decoration: none;
    }

    html {
      box-sizing: border-box;
    }

    *,
    *:before,
    *:after {
      box-sizing: inherit;
    }

    *:focus {
      outline: none;
    }

    #root {
      display: flex;
      flex-direction: column;
    }

    h1 {
      margin: 0;
    }

    p {
      margin: 0;
    }

    form {
      display: flex;
      flex-direction: column;
    }

    ul {
      margin: 0;
    }
  `}
`;
