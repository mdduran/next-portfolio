import projectData from './data/projects';

const gamesList = projectData.games;

export const initialState = {
  selectedProject: gamesList[0]
};

export const reducer = (state, action) => {
  switch (action.type) {
    case 'setSelectedProject':
      return { selectedProject: state.selectedProject };
  }
};
