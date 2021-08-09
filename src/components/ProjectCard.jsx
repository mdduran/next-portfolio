import * as React from 'react';
import PropTypes from 'prop-types';
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

const ProjectCard = (props) => {
  const { selectedProject } = props;
  return (
    <StyledCard>
      <div style={{ padding: '2em', display: 'block', textAlign: 'center' }}>
        <CardContent>
          <Typography variant="h4" component="h2">
            {selectedProject.title ?? 'Project title'}
          </Typography>
          <List>
            <StyledListItem>Year developed: {selectedProject.yearDeveloped}</StyledListItem>
            <StyledListItem>Platform: {selectedProject.platform}</StyledListItem>
            <StyledListItem>Genre: {selectedProject.genre}</StyledListItem>

            {selectedProject.downloadLink && (
              <StyledListItem>
                <Link href={selectedProject.downloadLink}>Download</Link>
              </StyledListItem>
            )}
            {selectedProject.website && (
              <StyledListItem>
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

ProjectCard.propTypes = {
  selectedProject: PropTypes.shape({
    title: PropTypes.string,
    yearDeveloped: PropTypes.string,
    platform: PropTypes.string,
    genre: PropTypes.string,
    downloadLink: PropTypes.string,
    website: PropTypes.string,
    accomplishments: PropTypes.string
  })
};
ProjectCard.defaultProps = {
  selectedProject: {}
};

export default ProjectCard;
