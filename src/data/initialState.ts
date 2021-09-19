import projectData from './projects';
import { Project, ProjectState } from "../types";

const gamesList: Project[] = projectData.games;
const initialState: ProjectState = {
  selectedProject: gamesList[0]
};

export default initialState;
