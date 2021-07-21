import * as React from 'react';
import { isMobile } from 'react-device-detect';
import { Button, Grid } from '@material-ui/core';
import FolderIcon from '@material-ui/icons/Folder';
import styled from 'styled-components';
import ProjectList from '../src/components/ProjectList';
import ProjectPanel from '../src/components/ProjectPanel';
import theme from '../src/styles/theme';
import initialState from '../src/data/initialState';


const StyledGrid = styled(Grid)`
  background-color: ${theme.palette.primary.main};
`;

const StyledButton = styled(Button)`
  max-width: 500px;
  width: 100%;
`;

const StyledFooter = styled.footer`
  height: 150px;
  padding: '0.5em 2em';
  display: 'block';
  text-align: 'center';
`;

function Projects() {
  const openMobileNavigation = () => {
    console.log('OPENING NAV');
  };
  const [projectState, setProjectState] = React.useState(initialState);
  return (
    <StyledGrid container>
      {!isMobile && (
        <StyledGrid item xs={2} md={2}>
          <ProjectList state={projectState} setProjectState={setProjectState} />
        </StyledGrid>
      )}
      <StyledGrid container item xs={10}>
        <ProjectPanel state={projectState} />
      </StyledGrid>
      {isMobile && (
        <StyledGrid container item>
          <StyledFooter>
            <button onClick={openMobileNavigation}>
              <FolderIcon />
              Projects
            </button>
          </StyledFooter>
        </StyledGrid>
      )}
    </StyledGrid>
  );
}

export default Projects;
