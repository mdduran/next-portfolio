import type { Project } from 'types/types';
import * as React from 'react';
import styled from '@emotion/styled';
import { Box, Card, CardContent, CardMedia, Typography, List, ListItem, ListItemText, Link, Button } from '@mui/material';
import { isMobile } from 'react-device-detect';

const StyledCard = styled(Card)({
  width: '80cw',
  height: '50cw',
  '--aug-inlay': 'initial',
  '--aug-delegated-inlay': 'initial',
  '--aug-border-all': '8px',
  padding: '32px',
  margin: '32px',
  display: 'block',
  textAlign: 'center',
  '& .MuiListItem-root': {
    display: 'block',
    textAlign: 'center'
  }
});

const StyledDescription = styled(ListItem)`
  margin-bottom: ${isMobile ? '25px' : '200px'},
  padding-bottom: '32px'
`;

const StyledShortDescription = styled(ListItem)`
  margin-bottom: ${isMobile ? '0' : '48px'};
  padding-bottom: '48px';
`;

const ProjectCard = ({ selectedProject }: { selectedProject: Project }): React.ReactElement => {
  const { title, yearDeveloped, platform, genre, downloadLink, website, description, projectType, shortDescription, trailer } =
    selectedProject;
  return (
    <StyledCard data-augmented-ui="tl-2-scoop t-round-xy r-round-xy br-2-round-xy b-clip l-rect-x both">
      {trailer && (
        <Box component="div" display="flex" justifyContent="center" alignItems="center" mt={2}>
          <CardMedia component="iframe" title={title} src={trailer} />
        </Box>
      )}
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
              <Link href={downloadLink} underline="hover">
                Download
              </Link>
            </ListItem>
          )}
          {website && website.length > 0 && (
            <ListItem button>
              <Link href={website} target="_blank" underline="hover">
                Website
              </Link>
            </ListItem>
          )}
          {shortDescription && (
            <>
              <StyledShortDescription>
                <ListItemText>Short Description: {shortDescription}</ListItemText>
              </StyledShortDescription>
              <ListItem button>
                <Button variant="contained" href="#">
                  Read more
                </Button>
              </ListItem>
            </>
          )}
          {!shortDescription && (
            <StyledDescription>
              <ListItemText>Description: {description}</ListItemText>
            </StyledDescription>
          )}
        </List>
      </CardContent>
    </StyledCard>
  );
};

export default ProjectCard;
