import * as React from 'react';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Head from 'next/head';
import { AppProps } from 'next/dist/shared/lib/router/router';
import Header from '@components/Header';
import theme from '@theme';
import 'augmented-ui/augmented-ui.min.css';

export default function App({ Component, pageProps }: AppProps): React.ReactElement {
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);
  return (
    <StyledEngineProvider injectFirst>
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
    </StyledEngineProvider>
  );
}
