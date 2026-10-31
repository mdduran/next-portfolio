import * as React from 'react';
import Image from 'next/image';
import type { Project } from '@type';
import { ART_COLS, ART_ROWS, getArtSpec } from '@lib/projectArt';
import styles from './ProjectArt.module.scss';

type ProjectArtProps = {
  project: Pick<Project, 'slug' | 'title' | 'tags' | 'cover'>;
  className?: string;
};

// Project cover image, or pixel art generated from the project's tags
const ProjectArt = ({ project, className }: ProjectArtProps): React.ReactElement => {
  const { slug, tags, cover } = project;
  const art = React.useMemo(() => getArtSpec({ slug, tags }), [slug, tags]);
  const classes = `${styles.art} ${className ?? ''}`;

  if (cover) {
    return (
      <div className={classes}>
        <Image src={cover} alt="" fill sizes="(min-width: 1200px) 33vw, (min-width: 700px) 50vw, 100vw" />
      </div>
    );
  }

  const gradientId = `art-sky-${slug}`;
  return (
    <div className={classes} data-scene={art.scene} data-decorations={art.decorations.join(' ')}>
      <svg viewBox={`0 0 ${ART_COLS} ${ART_ROWS}`} preserveAspectRatio="xMidYMid slice" shapeRendering="crispEdges" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={art.skyTop} />
            <stop offset="1" stopColor={art.skyBottom} />
          </linearGradient>
        </defs>
        <rect width={ART_COLS} height={ART_ROWS} fill={`url(#${gradientId})`} />
        {art.rects.map(({ x, y, w, h, fill, opacity }, i) => (
          <rect key={i} x={x} y={y} width={w} height={h} fill={fill} opacity={opacity} />
        ))}
      </svg>
    </div>
  );
};

export default ProjectArt;
