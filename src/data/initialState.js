import projectData from './projects';
const gamesList = projectData.games;
const initialState = {
    selectedProject: gamesList[0]
};

export default initialState;