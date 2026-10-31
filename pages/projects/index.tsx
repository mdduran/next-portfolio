import * as React from 'react';
import type { GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AnimatePresence, motion } from 'motion/react';
import { Chip, Container, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import type { Project } from '@type';
import { getAllProjects } from '@lib/projects';
import ProjectTile from '@components/ProjectTile';
import styles from './ProjectIndex.module.scss';

type ProjectsProps = {
  projects: Project[];
};

type TypeFilter = Project['type'] | 'all';

const TYPE_FILTERS: { value: TypeFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'game', label: 'Games' },
  { value: 'software', label: 'Software' }
];

export const getStaticProps: GetStaticProps<ProjectsProps> = () => {
  return { props: { projects: getAllProjects() } };
};

function Projects({ projects }: ProjectsProps): React.ReactNode {
  const router = useRouter();

  // Filters live in the URL (?type=game&tag=unity) so they're shareable
  const type: TypeFilter = router.query.type === 'game' || router.query.type === 'software' ? router.query.type : 'all';
  const tag = typeof router.query.tag === 'string' ? router.query.tag : null;

  const setFilters = (next: { type: TypeFilter; tag: string | null }) => {
    const query: Record<string, string> = {};
    if (next.type !== 'all') query.type = next.type;
    if (next.tag) query.tag = next.tag;
    router.replace({ pathname: '/projects', query }, undefined, { shallow: true, scroll: false });
  };

  const visible = projects.filter((project) => (type === 'all' || project.type === type) && (!tag || project.tags.includes(tag)));

  return (
    <div className={styles.page}>
      <Head>
        <title>Projects | Marco Daniel Duran</title>
        <meta name="description" content="Games and software projects by Marco Daniel Duran." />
      </Head>
      <Container className={styles.container}>
        <div className={styles.toolbar}>
          <ToggleButtonGroup
            className={styles.typeFilter}
            value={type}
            exclusive
            size="small"
            aria-label="Project type"
            onChange={(_, value: TypeFilter | null) => value && setFilters({ type: value, tag })}
          >
            {TYPE_FILTERS.map(({ value, label }) => (
              <ToggleButton key={value} value={value}>
                {label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          {tag && <Chip label={`Tag: ${tag}`} color="success" onDelete={() => setFilters({ type, tag: null })} />}
          <Typography className={styles.count} variant="body2" aria-live="polite">
            {visible.length} {visible.length === 1 ? 'project' : 'projects'}
          </Typography>
        </div>

        <motion.ul className={styles.grid} layout>
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((project) => (
              <motion.li
                key={project.slug}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
              >
                <ProjectTile project={project} activeTag={tag} onTagClick={(t) => setFilters({ type, tag: t === tag ? null : t })} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
        {visible.length === 0 && <Typography className={styles.empty}>No projects match these filters.</Typography>}
      </Container>
    </div>
  );
}

export default Projects;
