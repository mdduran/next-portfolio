import * as React from 'react';
import { makeStyles, StylesProvider, ThemeProvider } from '@material-ui/core/styles';
import Head from 'next/head';
import { AppProps } from 'next/dist/shared/lib/router/router';
import Header from '@components/Header';
import theme from '@theme';
import 'augmented-ui/augmented-ui.min.css';

const useStyles = makeStyles({
  '@global': {
    html: {
      fontFamily: "'Press Start 2P', cursive",
      fontSize: 'medium',
      height: '100%'
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
  return (
    <>
      <StylesProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Head>
            <title>Marco Daniel Duran</title>
          </Head>
          <div className="site">
            <Header />
            <Component {...pageProps} />
          </div>
        </ThemeProvider>
      </StylesProvider>
    </>
  );
}
