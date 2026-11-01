import * as React from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Canvas } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import { useReducedMotion } from 'motion/react';
import { IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import type { Project } from '@type';
import { useWebglSupported } from '@lib/webgl';
import ModelLoader from './ModelLoader';
import ProjectArt from './ProjectArt';
import styles from './FeaturedCarousel.module.scss';

const FeaturedRing = dynamic(() => import('./FeaturedRing'), {
  loading: () => null
});

const ADVANCE_MS = 5000;

type CarouselProps = {
  projects: Project[];
};

const mod = (n: number, m: number) => ((n % m) + m) % m;

// Featured projects on a 3D ring, with a caption and controls for the front one.
// Advances on its own until the viewer hovers, focuses, pauses or picks a project.
const FeaturedCarousel = ({ projects }: CarouselProps): React.ReactElement | null => {
  const router = useRouter();
  const webglSupported = useWebglSupported();
  const reducedMotion = !!useReducedMotion();
  const [position, setPosition] = React.useState(0);
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  // Stopped by the pause button or by choosing a project; reduced motion starts stopped
  const [stopped, setStopped] = React.useState(false);
  const autoplay = !stopped && !reducedMotion;
  const advancing = autoplay && !hovered && !focused;

  React.useEffect(() => {
    if (!advancing) return;
    const timer = setInterval(() => setPosition((p) => p + 1), ADVANCE_MS);
    return () => clearInterval(timer);
  }, [advancing]);

  if (projects.length === 0) return null;
  const active = mod(position, projects.length);
  const project = projects[active];
  const href = `/projects/${project.slug}`;

  // Viewer-driven moves stop autoplay so the ring doesn't turn away from what they chose
  const step = (by: number) => {
    setStopped(true);
    setPosition((p) => p + by);
  };
  const select = (index: number) => {
    // Shortest way around the ring
    const half = Math.floor(projects.length / 2);
    step(mod(index - active + half, projects.length) - half);
  };

  return (
    <section
      className={styles.carousel}
      aria-roledescription="carousel"
      aria-label="Featured projects"
      onFocus={() => setFocused(true)}
      onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setFocused(false)}
    >
      <div className={styles.stage}>
        {webglSupported === false ? (
          <Link className={styles.fallback} href={href} tabIndex={-1} aria-hidden="true">
            <ProjectArt project={project} className={styles.fallbackArt} />
          </Link>
        ) : webglSupported ? (
          <Canvas className={styles.canvas} camera={{ position: [0, 1.3, 5.2], fov: 40 }}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[3, 5, 4]} intensity={1.6} />
            <directionalLight position={[-3, 2, -4]} intensity={0.6} />
            <FeaturedRing
              projects={projects}
              position={position}
              reducedMotion={reducedMotion}
              onSelect={select}
              onOpen={(p) => router.push(`/projects/${p.slug}`)}
              onHoverChange={setHovered}
            />
            <ContactShadows position={[0, -1.2, 0]} opacity={0.4} blur={2.5} scale={8} />
          </Canvas>
        ) : null}
        {webglSupported && <ModelLoader />}
      </div>

      <div className={styles.controls}>
        <IconButton color="inherit" onClick={() => step(-1)} aria-label="Previous project">
          <ArrowBackIcon />
        </IconButton>
        {/* Announce changes only when the viewer made them, not on every auto-advance */}
        <div className={styles.caption} aria-live={advancing ? 'off' : 'polite'}>
          <Typography className={styles.title} variant="h6" component="h2">
            <Link href={href}>{project.title}</Link>
          </Typography>
          <Typography className={styles.summary} variant="body2">
            {project.summary}
          </Typography>
        </div>
        <IconButton color="inherit" onClick={() => step(1)} aria-label="Next project">
          <ArrowForwardIcon />
        </IconButton>
      </div>

      <div className={styles.footer}>
        <div className={styles.dots}>
          {projects.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              className={`${styles.dot} ${i === active ? styles.activeDot : ''}`}
              onClick={() => select(i)}
              aria-label={p.title}
              aria-current={i === active ? 'true' : undefined}
            />
          ))}
        </div>
        {!reducedMotion && (
          <IconButton
            color="inherit"
            size="small"
            onClick={() => setStopped((s) => !s)}
            aria-label={autoplay ? 'Pause rotation' : 'Resume rotation'}
          >
            {autoplay ? <PauseIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
          </IconButton>
        )}
      </div>
    </section>
  );
};

export default FeaturedCarousel;
