import * as React from 'react';
import { isMobile } from 'react-device-detect';
import { Grid } from '@mui/material';
import styled from '@emotion/styled';
import { Project } from 'types/types';
import ProjectList from '@components/ProjectList';
import ProjectPanel from '@components/ProjectPanel';
import theme from '@theme';
import projects from '@data/projects';
import MobileProjectList from '@components/MobileProjectList';

const StyledGrid = styled(Grid)`
  background-color: ${theme.palette.primary.main};
  height: 100%;
`;

function Projects(): React.ReactNode {
  const [selectedProject, setSelectedProject] = React.useState<Project>(projects[0]);

  return (
    <StyledGrid container>
      {!isMobile && (
        <StyledGrid size={{ xs: 2, md: 2 }}>
          <ProjectList projects={projects} selectedProject={selectedProject} setSelectedProject={setSelectedProject} />
        </StyledGrid>
      )}
      <StyledGrid container size={{ xs: isMobile ? 12 : 10 }}>
        {isMobile && <MobileProjectList projects={projects} selectedProject={selectedProject} setSelectedProject={setSelectedProject} />}
        <ProjectPanel selectedProject={selectedProject} />
      </StyledGrid>
    </StyledGrid>
  );
}

export default Projects;
