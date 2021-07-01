import { createGlobalStyle, ThemeProvider } from 'styled-components';
import Header from '../src/components/Header';
import theme from '../src/styles/theme';
import { isMobile } from 'react-device-detect';

const GlobalStyle = createGlobalStyle`
  html {
    height: 100%;
    background-color: ${theme.palette.primary.main};
  }
  body {
    padding: 0;
    margin: 0;
  }
  .site {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
  }
  header.MuiAppBar-root {
      background-color: ${theme.palette.primary.main};
  }
`;

export default function App({ Component, pageProps }) {
  return (
    <>
      <ThemeProvider theme={theme}>
        <title>Marco Daniel Duran</title>
        <GlobalStyle />
        <div className="site">
          <Header isMobile={isMobile} dispatch={null} />
          <Component {...pageProps} />
        </div>
      </ThemeProvider>
    </>
  );
}
