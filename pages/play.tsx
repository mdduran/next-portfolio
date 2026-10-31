import * as React from 'react';
import type { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Button, Typography } from '@mui/material';
import type { Project } from '@type';
import { getAllProjects } from '@lib/projects';
import { useWebglSupported } from '@lib/webgl';
import { buildLevel } from '@components/play/level';
import { usePlayControls } from '@components/play/usePlayControls';
import { KeyboardHint, PreviewCard, TouchControls } from '@components/play/PlayHud';
import styles from './Play.module.scss';

// three.js only runs in the browser; keep it out of the server render and other pages
const PlayScene = dynamic(() => import('@components/play/PlayScene'), {
  ssr: false,
  loading: () => null
});

// Time for the camera to zoom in on a station before navigating
const OPEN_DELAY_MS = 450;

type PlayProps = {
  projects: Project[];
};

export const getStaticProps: GetStaticProps<PlayProps> = () => {
  return { props: { projects: getAllProjects() } };
};

function Play({ projects }: PlayProps): React.ReactNode {
  const router = useRouter();
  const webglSupported = useWebglSupported();
  const level = React.useMemo(() => buildLevel(projects), [projects]);
  const [near, setNear] = React.useState<Project | null>(null);
  const [openingSlug, setOpeningSlug] = React.useState<string | null>(null);
  const [sceneReady, setSceneReady] = React.useState(false);

  const open = () => {
    if (!near || openingSlug) return;
    setOpeningSlug(near.slug);
    setTimeout(() => router.push(`/projects/${near.slug}`), OPEN_DELAY_MS);
  };
  const inputRef = usePlayControls(open, !openingSlug);
  const spawnSlug = typeof router.query.at === 'string' ? router.query.at : null;

  return (
    <div className={styles.page}>
      <Head>
        <title>Play | Marco Daniel Duran</title>
        <meta name="description" content="Explore Marco Daniel Duran's projects in a small platformer." />
      </Head>
      <Button className={styles.skip} component={Link} href="/projects" variant="contained" size="small">
        Skip to gallery
      </Button>

      {webglSupported === false && (
        <div className={styles.status}>
          <Typography>This level needs WebGL, which isn&apos;t available in this browser.</Typography>
          <Button component={Link} href="/projects" variant="contained">
            Browse projects instead
          </Button>
        </div>
      )}
      {/* Wait for the router so a ?at= spawn point is known before the level mounts */}
      {webglSupported && router.isReady && (
        <PlayScene
          level={level}
          inputRef={inputRef}
          spawnSlug={spawnSlug}
          openingSlug={openingSlug}
          onNearChange={setNear}
          onReady={() => setSceneReady(true)}
        />
      )}
      {webglSupported !== false && !sceneReady && <p className={styles.status}>Loading level…</p>}

      <KeyboardHint />
      {near && <PreviewCard project={near} onOpen={open} />}
      <TouchControls inputRef={inputRef} />
      <p className={styles.visuallyHidden} aria-live="polite">
        {near ? `${near.title}. Press E or Enter to open.` : ''}
      </p>
    </div>
  );
}

export default Play;
