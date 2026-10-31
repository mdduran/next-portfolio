import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import Header from '@components/Header';
import theme from '@theme';
import 'augmented-ui/augmented-ui.min.css';
import 'styles/globals.scss';

export default function App({ Component, pageProps, router }: AppProps): React.ReactElement {
  // Animate between routes, keyed by the route pattern: query changes (gallery
  // filters) and moving between projects (/projects/[slug]) keep the page mounted
  const routeKey = router.pathname;

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>Marco Daniel Duran</title>
        <meta name="viewport" content="initial-scale=1, width=device-width, viewport-fit=cover" />
      </Head>
      <CssBaseline />
      <MotionConfig reducedMotion="user">
        <div className="site">
          <Header />
          <div className="content-container">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={routeKey}
                className="page-transition"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                <Component {...pageProps} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </MotionConfig>
    </ThemeProvider>
  );
}
