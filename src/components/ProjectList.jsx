import styled from 'styled-components';
import { MenuList, MenuItem } from '@material-ui/core';
import { FixedSizeList } from 'react-window';
import projectData from '../data/projects';
import theme from '../styles/theme';

const gamesList = projectData.games;
const softwareList = projectData.software;

const StyledWrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${theme.palette.secondary.main};
`;

const StyledMenuItem = styled(MenuItem)`
  color: #fff;
  font-size: large;
`;

const StyledSubMenuItem = styled(MenuItem)`
  color: #fff;
  font-size: medium;
`;

const renderGameRow = (props) => {
  const { index } = props;
  return <StyledSubMenuItem key={index + 2}>{gamesList[index].title}</StyledSubMenuItem>;
};

const renderSoftwareRow = (props) => {
  const { index } = props;
  return <StyledSubMenuItem key={index + gamesList.length + 2}>{softwareList[index].title}</StyledSubMenuItem>;
};

const ProjectList = () => {
  return (
    <StyledWrapper>
      <MenuList>
        <StyledMenuItem key={0}>About</StyledMenuItem>
        <StyledMenuItem key={1}>Games</StyledMenuItem>
        <FixedSizeList height={300} width={200} itemSize={10} itemCount={gamesList.length}>
          {renderGameRow}
        </FixedSizeList>
        <StyledMenuItem>Software</StyledMenuItem>
        <FixedSizeList height={300} width={200} itemSize={10} itemCount={softwareList.length}>
          {renderSoftwareRow}
        </FixedSizeList>
      </MenuList>
    </StyledWrapper>
  );
};

export default ProjectList;
