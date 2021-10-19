import type { Project } from '@type';
import * as React from 'react';
import { Card, CardContent, Typography, List, ListItem, Link } from '@material-ui/core';
import styled from 'styled-components';

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

const ProjectCard = ({ selectedProject }: { selectedProject: Project }): React.ReactElement => {
  const { title, yearDeveloped, platform, genre, downloadLink, website, accomplishments } = selectedProject;
  return (
    <StyledCard>
      <div style={{ padding: '2em', display: 'block', textAlign: 'center' }}>
        <CardContent>
          <Typography variant="h4" component="h2">
            {title ?? 'Project title'}
          </Typography>
          <List>
            <StyledListItem button>Year developed: {yearDeveloped}</StyledListItem>
            <StyledListItem button>Platform: {platform}</StyledListItem>
            <StyledListItem button>Genre: {genre}</StyledListItem>

            {downloadLink && (
              <StyledListItem button>
                <Link href={downloadLink}>Download</Link>
              </StyledListItem>
            )}
            {website && (
              <StyledListItem button>
                <Link href={website} target="_blank">
                  Website
                </Link>
              </StyledListItem>
            )}
          </List>
          <Typography variant="body1" component="p">
            Accomplishments: {accomplishments}
          </Typography>
        </CardContent>
        <p>{yearDeveloped}</p>
      </div>
    </StyledCard>
  );
};

export default ProjectCard;
