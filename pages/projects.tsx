import * as React from 'react';
import { isMobile } from 'react-device-detect';
import { Grid } from '@mui/material';
import { Project } from 'types/types';
import ProjectList from '@components/ProjectList';
import ProjectPanel from '@components/ProjectPanel';
import projects from '@data/projects';
import MobileProjectList from '@components/MobileProjectList';
import styles from './Projects.module.scss';

function Projects(): React.ReactNode {
  const [selectedProject, setSelectedProject] = React.useState<Project>(projects[0]);

  return (
    <Grid className={styles.grid} container>
      {!isMobile && (
        <Grid className={styles.grid} size={{ xs: 2, md: 2 }}>
          <ProjectList projects={projects} selectedProject={selectedProject} setSelectedProject={setSelectedProject} />
        </Grid>
      )}
      <Grid className={styles.grid} container size={{ xs: isMobile ? 12 : 10 }}>
        {isMobile && <MobileProjectList projects={projects} selectedProject={selectedProject} setSelectedProject={setSelectedProject} />}
        <ProjectPanel selectedProject={selectedProject} />
      </Grid>
    </Grid>
  );
}

export default Projects;
