import { Select, InputLabel, SelectChangeEvent } from '@mui/material';
import styled from '@emotion/styled';
import type { Project } from 'types/types';
import * as React from 'react';

const MobileProjectList = ({
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
    // only want to run this once for initialization
  }, []);

  const handleChange = (event: SelectChangeEvent) => {
    const { value } = event.target;
    const filteredProjects = projects.filter((project) => project.title === value);
    setSelectedProject(filteredProjects[0]);
  };

  const StyledMobileProjectList = styled.div`
    padding-top: 20px;
    margin: 0 15px;
  `;

  return (
    <StyledMobileProjectList id="mobile-project-list">
      <InputLabel id="selected-project">Selected Project</InputLabel>
      <Select
        labelId="selected-project"
        native
        defaultValue={selectedProject.title}
        value={selectedProject.title}
        onChange={handleChange}
      >
        <optgroup label="Games">
          {gamesList.map((game) => {
            return (
              <option key={`${game.title}-gameoption`} value={game.title}>
                {game.title}
              </option>
            );
          })}
        </optgroup>
        <optgroup label="Software">
          {softwareList.map((software) => {
            return (
              <option key={`${software.title}-softwareoption`} value={software.title}>
                {software.title}
              </option>
            );
          })}
        </optgroup>
      </Select>
    </StyledMobileProjectList>
  );
};

export default MobileProjectList;
