import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Head from 'next/head';
import { AppProps } from 'next/dist/shared/lib/router/router';
import Header from '@components/Header';
import theme from '@theme';
import 'augmented-ui/augmented-ui.min.css';
import 'styles/globals.scss';

export default function App({ Component, pageProps }: AppProps): React.ReactElement {
  React.useEffect(() => {
    // Suppress specific THREE.js deprecation warnings coming from library internals
    if (typeof window !== 'undefined' && !(window as any).__THREE_WARNINGS_SUPPRESSED__) {
      (window as any).__THREE_WARNINGS_SUPPRESSED__ = true;
      const originalWarn = console.warn;
      console.warn = (...args) => {
        if (
          args[0] &&
          typeof args[0] === 'string' &&
          (args[0].includes('Clock: This module has been deprecated') ||
            args[0].includes('WebGLShadowMap: PCFSoftShadowMap has been deprecated'))
        ) {
          return;
        }
        originalWarn(...args);
      };
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>Marco Daniel Duran</title>
        <meta name="viewport" content="initial-scale=1, width=device-width, viewport-fit=cover" />
      </Head>
      <CssBaseline />
      <div className="site">
        <Header />
        <div className="content-container">
          <Component {...pageProps} />
        </div>
      </div>
    </ThemeProvider>
  );
}
