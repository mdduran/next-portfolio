import * as React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Chip, Typography } from '@mui/material';
import type { Project } from '@type';
import ProjectArt from './ProjectArt';
import styles from './ProjectTile.module.scss';

type ProjectTileProps = {
  project: Project;
  activeTag: string | null;
  onTagClick: (tag: string) => void;
};

const TYPE_LABELS: Record<Project['type'], string> = { game: 'Game', software: 'Software' };

const ProjectTile = ({ project, activeTag, onTagClick }: ProjectTileProps): React.ReactElement => {
  const { slug, title, type, year, summary, tags } = project;

  return (
    <motion.div className={styles.lift} whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
      <article className={styles.tile} data-augmented-ui="tl-clip br-clip both">
        <div className={styles.artWrapper}>
          <ProjectArt project={project} className={styles.art} />
        </div>
        <div className={styles.body}>
          <Typography className={styles.title} variant="h6" component="h2">
            {/* The link stretches over the whole tile; tags sit above it */}
            <Link className={styles.link} href={`/projects/${slug}`}>
              {title}
            </Link>
          </Typography>
          <div className={styles.meta}>
            <Typography className={styles.year} variant="body2">
              {year}
            </Typography>
            <span className={`${styles.type} ${styles[type]}`}>{TYPE_LABELS[type]}</span>
          </div>
          <Typography className={styles.summary} variant="body2">
            {summary}
          </Typography>
          {tags.length > 0 && (
            <ul className={styles.tags} aria-label={`${title} tags`}>
              {tags.map((tag) => (
                <li key={tag}>
                  <Chip
                    label={tag}
                    size="small"
                    variant={tag === activeTag ? 'filled' : 'outlined'}
                    color={tag === activeTag ? 'success' : 'default'}
                    onClick={() => onTagClick(tag)}
                    aria-pressed={tag === activeTag}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </article>
    </motion.div>
  );
};

export default ProjectTile;
