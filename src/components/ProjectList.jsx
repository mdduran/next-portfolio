import styled from 'styled-components';
import { MenuList, MenuItem, ListItem } from '@material-ui/core';
import { FixedSizeList } from 'react-window';
import projectData from '../data/projects';
import theme from '../styles/theme';

const gamesList = projectData.games;
const softwareList = projectData.software;

const StyledWrapper = styled.div`
  width: 325px;
  background-color: ${theme.palette.secondary.main};
`;

const StyledMenuItem = styled(ListItem)`
  color: #fff;
  font-size: x-large;
  cursor: default;
`;

const StyledSubMenuItem = styled(MenuItem)`
  color: #fff;
  font-size: large;
`;

const StyledMenuText = styled.p`
  white-space: nowrap;
  overflow: hidden;
  width: 300px;
  text-overflow: ellipsis;
`;

const renderGameRow = (props) => {
  const { index } = props;
  return <StyledSubMenuItem key={index + 1}><StyledMenuText>{gamesList[index].title}</StyledMenuText></StyledSubMenuItem>;
};

const renderSoftwareRow = (props) => {
  const { index } = props;
  return <StyledSubMenuItem key={index + gamesList.length + 2}><StyledMenuText>{softwareList[index].title}</StyledMenuText></StyledSubMenuItem>;
};

const ProjectList = () => {
  return (
    <StyledWrapper>
      <MenuList>
        <StyledMenuItem key={0}>Games</StyledMenuItem>
        <FixedSizeList height={425} width={325} itemSize={10} itemCount={gamesList.length}>
          {renderGameRow}
        </FixedSizeList>
        <StyledMenuItem>Software</StyledMenuItem>
        <FixedSizeList height={350} width={325} itemSize={10} itemCount={softwareList.length}>
          {renderSoftwareRow}
        </FixedSizeList>
      </MenuList>
    </StyledWrapper>
  );
};

export default ProjectList;
