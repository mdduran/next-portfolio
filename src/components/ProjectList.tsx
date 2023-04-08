import type { Project } from 'types/types';
import * as React from 'react';
import styled from '@emotion/styled';
import { MenuList, MenuItem, ListItem, ListItemText, Tooltip, Collapse, List } from '@mui/material';
import theme from '@theme';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

const StyledWrapper = styled.div`
  background-color: ${theme.palette.secondary.main};
  overflow-x: none;
  height: 100vh;
`;

const StyledMenuList = styled(MenuList)`
  width: '100%';
  max-width: '36ch';
`;

const StyledMenuItem = styled(ListItem)`
  color: #fff;
  display: flex;
`;

const StyledSubMenuItem = styled(MenuItem)`
  color: #fff;
  display: flex;
  width: 100%;
`;

const StyledMenuText = styled.p`
  white-space: nowrap;
  overflow-x: hidden;
  text-overflow: ellipsis;
  font-size: xx-small;
  margin: 15px 15px;
`;

const ProjectList = ({
  projects,
  selectedProject,
  setSelectedProject
}: {
  projects: Project[];
  selectedProject: Project;
  setSelectedProject: React.Dispatch<React.SetStateAction<Project>>;
}): React.ReactElement => {
  const [gamesList, setGamesList] = React.useState<Project[]>([]);
  const [softwareList, setSoftwareList] = React.useState<Project[]>([]);
  const [gamesOpen, setGamesOpen] = React.useState(true);
  const [softwareOpen, setSoftwareOpen] = React.useState(true);

  const handleGamesClick = () => {
    setGamesOpen(!gamesOpen);
  };

  const handleSoftwareClick = () => {
    setSoftwareOpen(!softwareOpen);
  };

  React.useEffect(() => {
    for (let i = 0; i < projects.length; i += 1) {
      if (projects[i].projectType === 'game' && projects[i].title !== 'Games') {
        gamesList.push(projects[i]);
      } else if (projects[i].projectType === 'software' && projects[i].title !== 'Software') {
        softwareList.push(projects[i]);
      }
    }
    setGamesList(gamesList);
    setSoftwareList(softwareList);
    setSelectedProject(projects[1]);
    // only want to run this once for initalizization
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StyledWrapper>
      <StyledMenuList>
        <StyledMenuItem key="Games" onClick={handleGamesClick}>
          <ListItemText>Games</ListItemText>
          {gamesOpen ? <ExpandLess /> : <ExpandMore />}
        </StyledMenuItem>
        <Collapse in={gamesOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {gamesList.map((game: Project) => {
              const { title } = game;
              return (
                <Tooltip key={title} title={title} enterDelay={500} leaveDelay={50}>
                  <StyledSubMenuItem selected={selectedProject.title === title} onClick={() => setSelectedProject(game)}>
                    <StyledMenuText>{title}</StyledMenuText>
                  </StyledSubMenuItem>
                </Tooltip>
              );
            })}
          </List>
        </Collapse>
        <StyledMenuItem key="Software" onClick={handleSoftwareClick}>
          <ListItemText>Software</ListItemText>
          {softwareOpen ? <ExpandLess /> : <ExpandMore />}
        </StyledMenuItem>
        <Collapse in={softwareOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {softwareList.map((software: Project) => {
              const { title } = software;
              return (
                <Tooltip key={title} title={title} enterDelay={500} leaveDelay={50}>
                  <StyledSubMenuItem selected={selectedProject.title === title} onClick={() => setSelectedProject(software)}>
                    <StyledMenuText>{title}</StyledMenuText>
                  </StyledSubMenuItem>
                </Tooltip>
              );
            })}
          </List>
        </Collapse>
      </StyledMenuList>
    </StyledWrapper>
  );
};

export default ProjectList;
