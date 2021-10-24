import type { Project } from '@type';
import * as React from 'react';
import styled, { CSSProperties } from 'styled-components';
import { MenuList, MenuItem, ListItem, ListItemText, Tooltip } from '@material-ui/core';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import theme from '@theme';

const StyledWrapper = styled.div`
  background-color: ${theme.palette.secondary.main};
  height: 100%;
  overflow-x: none;
`;

const StyledMenuItem = styled(ListItem)`
  color: #fff;
  display: flex;
`;

const StyledSubMenuItem = styled(MenuItem)`
  color: #fff;
  display: flex;
  width: 100%;
`;

const StyledMenuText = styled.p`
  white-space: nowrap;
  overflow-x: hidden;
  text-overflow: ellipsis;
  font-size: small;
  padding: 15px 15px;
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
  const GUTTER_SIZE = 10;
  const COLUMN_WIDTH = 200;
  const ROW_HEIGHT = 100;
  const renderProjectList = ({ index, style }: { index: number; style: CSSProperties }) => {
    const currentProject = projects[index];
    const listItemTitle = currentProject.title;
    // const isListHeader = listItemTitle === ('Games' || 'Software');

    return (
      <>
        {listItemTitle === ('Games' || 'Software') ? (
          <>
            <StyledMenuItem
              button
              key={listItemTitle}
              style={{
                ...style,
                bottom: (style.bottom as number) + GUTTER_SIZE * 2
              }}
            >
              <ListItemText>{listItemTitle}</ListItemText>
            </StyledMenuItem>
          </>
        ) : (
          <Tooltip title={listItemTitle} enterDelay={500} leaveDelay={50}>
            <StyledSubMenuItem
              key={listItemTitle}
              selected={selectedProject.title === listItemTitle}
              onClick={() => setSelectedProject(currentProject)}
              style={{
                ...style,
                top: (style.top as number) + GUTTER_SIZE
              }}
            >
              <StyledMenuText>{listItemTitle}</StyledMenuText>
            </StyledSubMenuItem>
          </Tooltip>
        )}
      </>
    );
  };

  type InnerElProps = { rest?: { children?: React.ReactNode }; style: unknown };
  // eslint-disable-next-line react/display-name
  const innerElementType = React.forwardRef<InnerElProps, HTMLElement>(
    ({ style, ...rest }: InnerElProps, ref: React.MutableRefObject<HTMLDivElement>) => (
      <div
        ref={ref}
        style={{
          ...(style as Record<string, unknown>),
          paddingLeft: GUTTER_SIZE,
          paddingTop: GUTTER_SIZE
        }}
        {...rest}
      />
    )
  );

  return (
    <StyledWrapper>
      <MenuList style={{ height: '100%', width: '100%', maxWidth: '36ch' }}>
        <AutoSizer>
          {({ height, width }) => (
            <FixedSizeList
              height={height}
              width={width}
              itemSize={30}
              itemCount={projectsLength}
              rowHeight={ROW_HEIGHT + GUTTER_SIZE}
              columnWidth={COLUMN_WIDTH + GUTTER_SIZE}
              innerElementType={innerElementType}
            >
              {renderProjectList}
            </FixedSizeList>
          )}
        </AutoSizer>
      </MenuList>
    </StyledWrapper>
  );
};

export default ProjectList;
