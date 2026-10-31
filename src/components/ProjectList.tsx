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
  const gamesList = React.useMemo(
    () => projects.filter((p) => p.projectType === 'game' && p.title !== 'Games'),
    [projects]
  );
  const softwareList = React.useMemo(
    () => projects.filter((p) => p.projectType === 'software' && p.title !== 'Software'),
    [projects]
  );
  const [gamesOpen, setGamesOpen] = React.useState(true);
  const [softwareOpen, setSoftwareOpen] = React.useState(true);

  const handleGamesClick = () => {
    setGamesOpen(!gamesOpen);
  };

  const handleSoftwareClick = () => {
    setSoftwareOpen(!softwareOpen);
  };

  return (
    <div className={styles.wrapper}>
      <MenuList className={styles.menuList}>
        <ListItem className={styles.menuItem} key="Games" onClick={handleGamesClick}>
          <ListItemText primary="Games" className={styles.menuItemText} />
          {gamesOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={gamesOpen} timeout="auto" unmountOnExit>
          <List component="div" className={styles.subMenuList}>
            {gamesList.map((game: Project) => {
              const { title } = game;
              return (
                <MenuItem
                  className={styles.subMenuItem}
                  key={title}
                  selected={selectedProject.title === title}
                  onClick={() => setSelectedProject(game)}
                >
                  <p className={styles.menuText}>{title}</p>
                </MenuItem>
              );
            })}
          </List>
        </Collapse>
        <ListItem className={styles.menuItem} key="Software" onClick={handleSoftwareClick}>
          <ListItemText primary="Software" className={styles.menuItemText} />
          {softwareOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={softwareOpen} timeout="auto" unmountOnExit>
          <List component="div" className={styles.subMenuList}>
            {softwareList.map((software: Project) => {
              const { title } = software;
              return (
                <MenuItem
                  className={styles.subMenuItem}
                  key={title}
                  selected={selectedProject.title === title}
                  onClick={() => setSelectedProject(software)}
                >
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
