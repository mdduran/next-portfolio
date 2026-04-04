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
  /* If it's desktop, ProjectList already handles setting it to projects[1] on mount
   * but setting it here doesn't hurt and helps for mobile.
   */
  const [selectedProject, setSelectedProject] = React.useState<Project>(projects[1]);
  const [mobileHasSelected, setMobileHasSelected] = React.useState(true);
  const [isHydrated, setIsHydrated] = React.useState(false);

  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  const showMobile = isHydrated && isMobile;

  return (
    <Grid className={styles.grid} container>
      {!showMobile && (
        <Grid className={`${styles.grid} ${styles.sidebar}`}>
          <ProjectList projects={projects} selectedProject={selectedProject} setSelectedProject={setSelectedProject} />
        </Grid>
      )}
      <Grid className={`${styles.grid} ${styles.main}`} container>
        {showMobile && (
          <MobileProjectList
            projects={projects}
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
            userHasSelected={mobileHasSelected}
            onSelectionChange={() => setMobileHasSelected(true)}
          />
        )}
        <ProjectPanel selectedProject={selectedProject} />
      </Grid>
    </Grid>
  );
}

export default Projects;
