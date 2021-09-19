import * as React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { MenuList, MenuItem, ListItem } from '@material-ui/core';
import { FixedSizeList } from 'react-window';
import projectData from '../data/projects';
import theme from '../styles/theme';
import { Project } from '../types';

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

type ProjectListPropsType = {
  state: any;
  setProjectState: React.SetStateAction<any>;
}

const ProjectList = ({ state, setProjectState }: ProjectListPropsType): React.ReactElement => {
  const setGameProject = (index) => {
    setProjectState({ selectedProject: gamesList[index] });
  };
  const setSoftwareProject = (index) => {
    setProjectState({ selectedProject: softwareList[index] });
  };
  const { selectedProject } = state;
  const renderGameRow = (props) => {
    // eslint-disable-next-line react/prop-types
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

  renderGameRow.propTypes = {
    index: PropTypes.number
  };
  renderGameRow.defaultProps = {
    index: -1
  };

  const renderSoftwareRow = (props) => {
    // eslint-disable-next-line react/prop-types
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

  renderSoftwareRow.propTypes = {
    index: PropTypes.number
  };
  renderSoftwareRow.defaultProps = {
    index: -1
  };

  return (
    <StyledWrapper>
      <MenuList>
        <StyledMenuItem button key='games'>Games</StyledMenuItem>
        <FixedSizeList height={425} width="100%" itemSize={10} itemCount={gamesList.length}>
          {renderGameRow}
        </FixedSizeList>
        <StyledMenuItem button key='software'>Software</StyledMenuItem>
        <FixedSizeList height={350} width="100%" itemSize={10} itemCount={softwareList.length}>
          {renderSoftwareRow}
        </FixedSizeList>
      </MenuList>
    </StyledWrapper>
  );
};

export default ProjectList;
