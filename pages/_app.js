import { makeStyles, StylesProvider, ThemeProvider } from '@material-ui/core/styles';
import Header from '../src/components/Header';
import { isMobile } from 'react-device-detect';
import Head from 'next/head';
import theme from '../src/styles/theme';

const useStyles = makeStyles({
  '@global': {
    html: {
      height: '100%',
      backgroundColor: '#2b3b37',
      fontFamily: "'Press Start 2P', cursive",
      fontSize: 'medium'
    },
    body: {
      padding: 0,
      margin: 0
    },
    site: {
      display: 'flex',
      minHeight: '100vh',
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
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
            <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
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
