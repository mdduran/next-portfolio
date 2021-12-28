import * as React from 'react';
import { makeStyles, StylesProvider, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Head from 'next/head';
import { AppProps } from 'next/dist/shared/lib/router/router';
import Header from '@components/Header';
import theme from '@theme';
import 'augmented-ui/augmented-ui.min.css';

const useStyles = makeStyles({
  '@global': {
    html: {
      fontFamily: "'Press Start 2P', cursive",
      fontSize: 'medium'
    },
    body: {
      padding: 0,
      margin: 0,
      height: '100%'
    },
    'body > div:first-child': {
      height: '100%'
    },
    'div#__next': {
      height: '100%'
    },
    'div#__next > div': {
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    h1: {
      fontSize: 'medium'
    }
  }
});

export default function App({ Component, pageProps }: AppProps): React.ReactElement {
  useStyles(theme);
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);
  return (
    <>
      <StylesProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Head>
            <title>Marco Daniel Duran</title>
            <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
          </Head>
          <CssBaseline />
          <div className="site">
            <Header />
            <Component {...pageProps} />
          </div>
        </ThemeProvider>
      </StylesProvider>
    </>
  );
}
