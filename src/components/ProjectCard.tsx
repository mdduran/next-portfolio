import type { Project } from 'types/types';
import * as React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Link, styled, Button } from '@material-ui/core';

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
  const { title, yearDeveloped, platform, genre, downloadLink, website, description, projectType, shortDescription } = selectedProject;
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
          {projectType === 'game' && (
            <>
              <ListItem>
                <ListItemText>Platform: {platform}</ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText>Genre: {genre}</ListItemText>
              </ListItem>
            </>
          )}

          {downloadLink && downloadLink.length > 0 && (
            <ListItem button>
              <Link href={downloadLink}>Download</Link>
            </ListItem>
          )}
          {website && website.length > 0 && (
            <ListItem button>
              <Link href={website} target="_blank">
                Website
              </Link>
            </ListItem>
          )}
          {shortDescription && (
            <>
              <ListItem style={{ marginBottom: '32px', paddingBottom: '32px', overflowY: 'scroll' }}>
                <ListItemText>Short Description: {shortDescription}</ListItemText>
              </ListItem>
              <ListItem button>
                <Button variant="contained" href={`#-${shortDescription}`}>
                  Read more
                </Button>
              </ListItem>
            </>
          )}
          {!shortDescription && (
            <ListItem style={{ marginBottom: '32px', overflowY: 'scroll' }}>
              <ListItemText>Description: {description}</ListItemText>
            </ListItem>
          )}
        </List>
      </CardContent>
    </StyledCard>
  );
};

export default ProjectCard;
