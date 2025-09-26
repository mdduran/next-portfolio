import type { Project } from 'types/types';
import * as React from 'react';
import { MenuList, MenuItem, ListItem, ListItemText, Collapse, List } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import styles from './ProjectList.module.scss';

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
    <div className={styles.wrapper}>
      <MenuList className={styles.menuList}>
        <ListItem className={styles.menuItem} key="Games" onClick={handleGamesClick}>
          <ListItemText>Games</ListItemText>
          {gamesOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={gamesOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {gamesList.map((game: Project) => {
              const { title } = game;
              return (
                <MenuItem className={styles.subMenuItem} key={title} selected={selectedProject.title === title} onClick={() => setSelectedProject(game)}>
                  <p className={styles.menuText}>{title}</p>
                </MenuItem>
              );
            })}
          </List>
        </Collapse>
        <ListItem className={styles.menuItem} key="Software" onClick={handleSoftwareClick}>
          <ListItemText>Software</ListItemText>
          {softwareOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={softwareOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {softwareList.map((software: Project) => {
              const { title } = software;
              return (
                <MenuItem className={styles.subMenuItem} key={title} selected={selectedProject.title === title} onClick={() => setSelectedProject(software)}>
                  <p className={styles.menuText}>{title}</p>
                </MenuItem>
              );
            })}
          </List>
        </Collapse>
      </MenuList>
    </div>
  );
};

export default ProjectList;
