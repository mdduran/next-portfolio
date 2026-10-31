import * as React from 'react';
import Image from 'next/image';
import type { Project } from '@type';
import colors from 'styles/colors.json';
import styles from './ProjectArt.module.scss';

// [sky, ground, accent]
const PALETTES: [string, string, string][] = [
  [colors.zomp, colors.phthaloGreen, colors.caribbeanGreen],
  [colors.popstar, colors.blackCoffee, colors.queenPink],
  [colors.cadetBlue, colors.outerSpaceCrayola, colors.white],
  [colors.roseDust, colors.solidPink, colors.tuscany],
  [colors.spanishViridian, colors.phthaloGreen, colors.puce]
];
const COLS = 32;
const ROWS = 18;

// Deterministic PRNG (FNV-1a seed + mulberry32) so a project's art never changes
function seededRandom(seed: string): () => number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateArt(slug: string) {
  const rand = seededRandom(slug);
  const [sky, ground, accent] = PALETTES[Math.floor(rand() * PALETTES.length)];

  // Terrain is a random walk of column heights, like a platformer level
  const heights: number[] = [];
  let height = 4 + Math.floor(rand() * 4);
  for (let x = 0; x < COLS; x += 1) {
    height = Math.min(9, Math.max(2, height + Math.floor(rand() * 3) - 1));
    heights.push(height);
  }
  const stars = Array.from({ length: 10 }, () => ({
    x: Math.floor(rand() * COLS),
    y: Math.floor(rand() * (ROWS - 10))
  }));

  return { sky, ground, accent, heights, stars };
}

type ProjectArtProps = {
  project: Pick<Project, 'slug' | 'title' | 'cover'>;
  className?: string;
};

// Project cover image, or generated pixel art when the project has none
const ProjectArt = ({ project, className }: ProjectArtProps): React.ReactElement => {
  const art = React.useMemo(() => generateArt(project.slug), [project.slug]);
  const classes = `${styles.art} ${className ?? ''}`;

  if (project.cover) {
    return (
      <div className={classes}>
        <Image src={project.cover} alt="" fill sizes="(min-width: 1200px) 33vw, (min-width: 700px) 50vw, 100vw" />
      </div>
    );
  }

  const gradientId = `art-sky-${project.slug}`;
  return (
    <div className={classes}>
      <svg viewBox={`0 0 ${COLS} ${ROWS}`} preserveAspectRatio="xMidYMid slice" shapeRendering="crispEdges" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={art.ground} />
            <stop offset="1" stopColor={art.sky} />
          </linearGradient>
        </defs>
        <rect width={COLS} height={ROWS} fill={`url(#${gradientId})`} />
        {art.stars.map(({ x, y }, i) => (
          <rect key={`star-${i}`} x={x} y={y} width={1} height={1} fill={art.accent} opacity={0.7} />
        ))}
        {art.heights.map((h, x) => (
          <React.Fragment key={x}>
            <rect x={x} y={ROWS - h} width={1} height={h} fill={art.ground} />
            <rect x={x} y={ROWS - h} width={1} height={1} fill={art.accent} opacity={0.5} />
          </React.Fragment>
        ))}
      </svg>
    </div>
  );
};

export default ProjectArt;
