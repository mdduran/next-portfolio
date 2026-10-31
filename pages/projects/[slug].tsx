import * as React from 'react';
import type { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Button, Container } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import type { ProjectLink, ProjectWithBody } from '@type';
import { getAllProjects, getProjectPage } from '@lib/projects';
import ProjectPanel from '@components/ProjectPanel';
import MdxContent from '@components/MdxContent';
import styles from './ProjectDetail.module.scss';

type ProjectPageProps = {
  project: ProjectWithBody;
  prev: ProjectLink | null;
  next: ProjectLink | null;
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: getAllProjects().map((project) => ({ params: { slug: project.slug } })),
    fallback: false
  };
};

export const getStaticProps: GetStaticProps<ProjectPageProps, { slug: string }> = async ({ params }) => {
  return { props: await getProjectPage(params!.slug) };
};

function ProjectPage({ project, prev, next }: ProjectPageProps): React.ReactNode {
  return (
    <div className={styles.page}>
      <Head>
        <title>{`${project.title} | Marco Daniel Duran`}</title>
        <meta name="description" content={project.summary} />
        <meta property="og:title" content={project.title} />
        <meta property="og:description" content={project.summary} />
        {project.cover && <meta property="og:image" content={project.cover} />}
      </Head>
      <Container className={styles.container}>
        <nav className={styles.topNav}>
          <Button component={Link} href="/projects" startIcon={<ArrowBackIcon />} color="inherit">
            All projects
          </Button>
        </nav>
        <ProjectPanel project={project}>
          <MdxContent code={project.body} />
        </ProjectPanel>
        <nav className={styles.pager} aria-label="Project navigation">
          {prev ? (
            <Button component={Link} href={`/projects/${prev.slug}`} startIcon={<ArrowBackIcon />} variant="contained">
              {prev.title}
            </Button>
          ) : (
            <span />
          )}
          {next && (
            <Button component={Link} href={`/projects/${next.slug}`} endIcon={<ArrowForwardIcon />} variant="contained">
              {next.title}
            </Button>
          )}
        </nav>
      </Container>
    </div>
  );
}

export default ProjectPage;
