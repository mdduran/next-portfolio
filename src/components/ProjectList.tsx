import type { Project } from '@type';
import * as React from 'react';
import styled, { CSSProperties } from 'styled-components';
import { MenuList, MenuItem, ListItem, ListItemText } from '@material-ui/core';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import theme from '@theme';

const StyledWrapper = styled.div`
  background-color: ${theme.palette.secondary.main};
  height: 100%;
`;

const StyledMenuItem = styled(ListItem)`
  color: #fff;
  font-size: large;
  display: flex;
  align-items: flex-start;
`;

const StyledSubMenuItem = styled(MenuItem)`
  color: #fff;
  font-size: small;
  display: flex;
  align-items: flex-start;
`;

const StyledMenuText = styled.p`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProjectList = ({
  projects,
  selectedProject,
  setSelectedProject
}: {
  projects: Project[];
  selectedProject: Project;
  setSelectedProject: React.Dispatch<React.SetStateAction<Project>>;
}): React.ReactElement => {
  const projectsLength = projects.length;
  const renderProjectList = ({ index, style }: { index: number; style: CSSProperties }) => {
    const currentProject = projects[index];
    const listItemTitle = currentProject.title;
    const isListHeader = listItemTitle === ('Games' || 'Software');

    return (
      <>
        {isListHeader ? (
          <StyledMenuItem button key={listItemTitle} style={style}>
            <ListItemText>{listItemTitle}</ListItemText>
          </StyledMenuItem>
        ) : (
          <StyledSubMenuItem
            key={listItemTitle}
            selected={selectedProject.title === listItemTitle}
            onClick={() => setSelectedProject(currentProject)}
            style={style}
          >
            <StyledMenuText>{listItemTitle}</StyledMenuText>
          </StyledSubMenuItem>
        )}
      </>
    );
  };

  return (
    <StyledWrapper>
      <MenuList style={{ height: '100%' }}>
        <AutoSizer>
          {({ height, width }) => (
            <FixedSizeList height={height} width={width} itemSize={projectsLength} itemCount={projectsLength}>
              {renderProjectList}
            </FixedSizeList>
          )}
        </AutoSizer>
      </MenuList>
    </StyledWrapper>
  );
};

export default ProjectList;
