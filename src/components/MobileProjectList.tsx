import { Select, InputLabel, SelectChangeEvent } from '@mui/material';
import type { Project } from 'types/types';
import * as React from 'react';
import './MobileProjectList.module.scss';
const PROJECT_TYPE = {
  GAME: 'game',
  SOFTWARE: 'software'
} as const;

const GROUP_LABEL = {
  GAMES: 'Games',
  SOFTWARE: 'Software'
} as const;

const byTypeExcludingLabel = (type: Project['projectType'], excludeTitle: string) => (p: Project) =>
  p.projectType === type && p.title !== excludeTitle;

const findByTitle = (items: Project[], title: string) => items.find((p) => p.title === title);
const MobileProjectList = ({
  projects,
  selectedProject,
  setSelectedProject
}: {
  projects: Project[];
  selectedProject: Project;
  setSelectedProject: React.Dispatch<React.SetStateAction<Project>>;
}): React.ReactElement => {
  const gamesList = React.useMemo(() => projects.filter(byTypeExcludingLabel(PROJECT_TYPE.GAME, GROUP_LABEL.GAMES)), [projects]);
  const softwareList = React.useMemo(() => projects.filter(byTypeExcludingLabel(PROJECT_TYPE.SOFTWARE, GROUP_LABEL.SOFTWARE)), [projects]);

  const handleProjectChange = (event: SelectChangeEvent<string>) => {
    const nextTitle = event.target.value as string;
    const next = findByTitle(projects, nextTitle);
    if (next) setSelectedProject(next);
  };

  return (
    <div id="mobile-project-list">
      <InputLabel id="selected-project">Selected Project</InputLabel>
      <Select
        labelId="selected-project"
        native
        defaultValue={selectedProject.title}
        value={selectedProject.title}
        onChange={handleProjectChange}
      >
        <optgroup label={GROUP_LABEL.GAMES}>
          {gamesList.map((game) => {
            return (
              <option key={`${game.title}-gameoption`} value={game.title}>
                {game.title}
              </option>
            );
          })}
        </optgroup>
        <optgroup label={GROUP_LABEL.SOFTWARE}>
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
