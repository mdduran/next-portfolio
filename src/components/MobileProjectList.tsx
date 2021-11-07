import { InputLabel, Select } from '@material-ui/core';
import type { Project } from '@type';
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
    // only want to run this once for initalizization
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (
    e: React.ChangeEvent<{
      name?: string;
      value: string;
    }>
  ) => {
    const { value } = e.target;
    const filteredProjects = projects.filter((project) => project.title === value);
    setSelectedProject(filteredProjects[0]);
  };

  return (
    <div id="mobile-project-list" style={{ margin: '0 20px', paddingTop: '20px' }}>
      <InputLabel id="selected-project">Selected Project</InputLabel>
      <Select labelId="selected-project" style={{ width: '100%' }} native defaultValue={selectedProject.title} onChange={handleChange}>
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
    </div>
  );
};

export default MobileProjectList;
