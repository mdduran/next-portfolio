import type { Project } from '@type';
import * as React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Link, styled } from '@material-ui/core';

const StyledCard = styled(Card)({
  width: '80%',
  height: '70%',
  '--aug-inlay': 'initial',
  '--aug-delegated-inlay': 'initial',
  '--aug-border-all': '8px',
  padding: '32px',
  marginBottom: '48px',
  display: 'block',
  textAlign: 'center',
  '& .MuiListItem-root': {
    display: 'block',
    textAlign: 'center'
  }
  /* TODO: Add mobile styles */
});

const ProjectCard = ({ selectedProject }: { selectedProject: Project }): React.ReactElement => {
  const { title, yearDeveloped, platform, genre, downloadLink, website, description } = selectedProject;
  return (
    <StyledCard data-augmented-ui="tl-2-scoop t-round-xy r-round-xy br-2-round-xy b-clip l-rect-x both">
      <CardContent>
        <Typography variant="h4" component="h2">
          {title ?? 'Project title'}
        </Typography>
        <List>
          <ListItem>
            <ListItemText>Year developed: {yearDeveloped}</ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>Platform: {platform}</ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>Genre: {genre}</ListItemText>
          </ListItem>

          {downloadLink && (
            <ListItem button>
              <Link href={downloadLink}>Download</Link>
            </ListItem>
          )}
          {website && (
            <ListItem button>
              <Link href={website} target="_blank">
                Website
              </Link>
            </ListItem>
          )}
          <ListItem style={{ marginBottom: '32px' }}>
            <ListItemText>Description: {description}</ListItemText>
          </ListItem>
        </List>
      </CardContent>
    </StyledCard>
  );
};

export default ProjectCard;
