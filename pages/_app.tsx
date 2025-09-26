import * as React from 'react';
import { ThemeProvider  } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Head from 'next/head';
import { AppProps } from 'next/dist/shared/lib/router/router';
import Header from '@components/Header';
import theme from '@theme';
import 'augmented-ui/augmented-ui.min.css';
import 'styles/globals.scss';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function App({ Component, pageProps }: AppProps): React.ReactElement {
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
          <SpeedInsights />
        </div>
      </ThemeProvider>
  );
}
