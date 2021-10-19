import * as React from 'react';
import { isMobile } from 'react-device-detect';
import { Grid } from '@material-ui/core';
import FolderIcon from '@material-ui/icons/Folder';
import styled from 'styled-components';
import { Project } from '@type';
import ProjectList from '@components/ProjectList';
import ProjectPanel from '@components/ProjectPanel';
import theme from '@theme';
import projects from '@data/projects';

const StyledGrid = styled(Grid)`
  background-color: ${theme.palette.primary.main};
  height: 100%;
`;

const StyledButton = styled.button`
  max-width: 500px;
  width: 100%;
`;

const StyledFooter = styled.footer`
  height: 150px;
  padding: 0.5em 2em;
  display: 'block';
  text-align: 'center';
`;

function Projects(): React.ReactNode {
  const openMobileNavigation = () => {
    // console.log('OPENING NAV');
  };
  const [selectedProject, setSelectedProject] = React.useState<Project>(projects[0]);
  return (
    <StyledGrid container>
      {!isMobile && (
        <StyledGrid item xs={2} md={2}>
          <ProjectList projects={projects} selectedProject={selectedProject} setSelectedProject={setSelectedProject} />
        </StyledGrid>
      )}
      <StyledGrid container item xs={10}>
        <ProjectPanel selectedProject={selectedProject} />
      </StyledGrid>
      {isMobile && (
        <StyledGrid container item>
          <StyledFooter>
            <StyledButton type="button" onClick={openMobileNavigation}>
              <FolderIcon />
            </StyledButton>
          </StyledFooter>
        </StyledGrid>
      )}
    </StyledGrid>
  );
}

export default Projects;
