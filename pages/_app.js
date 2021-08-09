import * as React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, StylesProvider, ThemeProvider } from '@material-ui/core/styles';
import { isMobile } from 'react-device-detect';
import Head from 'next/head';
import Header from '../src/components/Header';
import theme from '../src/styles/theme';

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

export default function App({ Component, pageProps }) {
  useStyles(theme);
  return (
    <>
      <StylesProvider injectFirst>
        <ThemeProvider theme={theme}>
          <Head>
            <title>Marco Daniel Duran</title>
          </Head>
          <div className="site">
            <Header isMobile={isMobile} />
            <Component {...pageProps} />
          </div>
        </ThemeProvider>
      </StylesProvider>
    </>
  );
}

App.propTypes = {
  Component: PropTypes.any,
  pageProps: PropTypes.any
};
App.defaultProps = {
  Component: {},
  pageProps: {}
};
