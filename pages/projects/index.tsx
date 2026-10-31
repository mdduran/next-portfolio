import * as React from 'react';
import type { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Card, CardActionArea, CardContent, Container, Typography } from '@mui/material';
import type { Project } from '@type';
import { getAllProjects } from '@lib/projects';
import styles from './ProjectIndex.module.scss';

type ProjectsProps = {
  projects: Project[];
};

const SECTIONS: { type: Project['type']; heading: string }[] = [
  { type: 'game', heading: 'Games' },
  { type: 'software', heading: 'Software' }
];

export const getStaticProps: GetStaticProps<ProjectsProps> = () => {
  return { props: { projects: getAllProjects() } };
};

function Projects({ projects }: ProjectsProps): React.ReactNode {
  return (
    <div className={styles.page}>
      <Head>
        <title>Projects | Marco Daniel Duran</title>
        <meta name="description" content="Games and software projects by Marco Daniel Duran." />
      </Head>
      <Container className={styles.container}>
        {SECTIONS.map(({ type, heading }) => (
          <section key={type} className={styles.section}>
            <Typography className={styles.heading} variant="h5" component="h2">
              {heading}
            </Typography>
            <div className={styles.grid}>
              {projects
                .filter((project) => project.type === type)
                .map((project) => (
                  <Card key={project.slug} className={styles.card} data-augmented-ui="tl-clip br-clip both">
                    <CardActionArea className={styles.cardAction} component={Link} href={`/projects/${project.slug}`}>
                      <CardContent>
                        <Typography className={styles.cardTitle} variant="h6" component="h3">
                          {project.title}
                        </Typography>
                        <Typography className={styles.cardYear} variant="body2">
                          {project.year}
                        </Typography>
                        <Typography variant="body2">{project.summary}</Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                ))}
            </div>
          </section>
        ))}
      </Container>
    </div>
  );
}

export default Projects;
