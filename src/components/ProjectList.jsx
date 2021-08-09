import styled from 'styled-components';
import { MenuList, MenuItem, ListItem } from '@material-ui/core';
import { FixedSizeList } from 'react-window';
import projectData from '../data/projects';
import theme from '../styles/theme';

const gamesList = projectData.games;
const softwareList = projectData.software;

const StyledWrapper = styled.div`
  background-color: ${theme.palette.secondary.main};
`;

const StyledMenuItem = styled(ListItem)`
  color: #fff;
  font-size: large;
  cursor: default;
  padding: 1em 0 1.5em 0.5em;
`;

const StyledSubMenuItem = styled(MenuItem)`
  color: #fff;
  font-size: small;
  padding: 0 0.5em;
`;

const StyledMenuText = styled.p`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProjectList = ({ state, setProjectState }) => {
  const setGameProject = (index) => {
    setProjectState({ selectedProject: gamesList[index] });
  };
  const setSoftwareProject = (index) => {
    setProjectState({ selectedProject: softwareList[index] });
  };
  const { selectedProject } = state;
  const renderGameRow = (props) => {
    const { index } = props;
    return (
      <>
        {selectedProject && (
          <StyledSubMenuItem key={index + 1} selected={selectedProject.title === gamesList[index].title} onClick={() => setGameProject(index)}>
            <StyledMenuText>{gamesList[index].title}</StyledMenuText>
          </StyledSubMenuItem>
        )}
      </>
    );
  };

  const renderSoftwareRow = (props) => {
    const { index } = props;
    return (
      <>
        {selectedProject && (
          <StyledSubMenuItem key={index + gamesList.length + 2} selected={selectedProject.title === softwareList[index].title} onClick={() => setSoftwareProject(index)}>
            <StyledMenuText>{softwareList[index].title}</StyledMenuText>
          </StyledSubMenuItem>
        )}
      </>
    );
  };

  return (
    <StyledWrapper>
      <MenuList>
        <StyledMenuItem key={0}>Games</StyledMenuItem>
        <FixedSizeList height={425} width={'100%'} itemSize={10} itemCount={gamesList.length}>
          {renderGameRow}
        </FixedSizeList>
        <StyledMenuItem>Software</StyledMenuItem>
        <FixedSizeList height={350} width={'100%'} itemSize={10} itemCount={softwareList.length}>
          {renderSoftwareRow}
        </FixedSizeList>
      </MenuList>
    </StyledWrapper>
  );
};

export default ProjectList;
