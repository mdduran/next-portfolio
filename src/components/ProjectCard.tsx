import * as React from 'react';
import { Card, CardContent, Typography, List, ListItem, Link } from '@material-ui/core';
import styled from 'styled-components';
import { Project } from "../types";

const StyledCard = styled(Card)`
  width: 650px;
  height: 500px;
  overflow-y: auto;
  /* TODO: Add mobile styles */
`;

const StyledListItem = styled(ListItem)`
  display: block;
  text-align: center;
`;

const ProjectCard = (props: { selectedProject: Project; }): React.ReactElement => {
  const { selectedProject } = props;
  return (
    <StyledCard>
      <div style={{ padding: '2em', display: 'block', textAlign: 'center' }}>
        <CardContent>
          <Typography variant="h4" component="h2">
            {selectedProject.title ?? 'Project title'}
          </Typography>
          <List>
            <StyledListItem button>Year developed: {selectedProject.yearDeveloped}</StyledListItem>
            <StyledListItem button>Platform: {selectedProject.platform}</StyledListItem>
            <StyledListItem button>Genre: {selectedProject.genre}</StyledListItem>

            {selectedProject.downloadLink && (
              <StyledListItem button>
                <Link href={selectedProject.downloadLink}>Download</Link>
              </StyledListItem>
            )}
            {selectedProject.website && (
              <StyledListItem button>
                <Link href={selectedProject.website} target="_blank">
                  Website
                </Link>
              </StyledListItem>
            )}
          </List>
          <Typography variant="body1" component="p">
            Accomplishments: {selectedProject.accomplishments}
          </Typography>
        </CardContent>
        <p>{selectedProject.yearDeveloped}</p>
      </div>
    </StyledCard>
  );
};

export default ProjectCard;
