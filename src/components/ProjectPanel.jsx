import { Card, CardContent, Grid, Link, List, ListItem, Typography } from '@material-ui/core';
import styled from 'styled-components';
import theme from "../styles/theme";

const StyledCard = styled(Card)`
  max-width: 650px;
`;

const StyledGrid = styled(Grid)`
  width: '100%';
  height: '100%';
  background-color: ${theme.palette.primary.main};
  flex-grow: 1;
`;

const ProjectPanel = (props) => {
  const { project } = props;
  return (
    <StyledGrid container>
    <StyledCard>
      <div style={{ padding: '2em' }}>
          {/* {project.splashImage && <CardMedia
            image={project.splashImage}
            title={project.title ?? 'Project title'}
          />} */}
        <CardContent>
          <Typography variant="h4" component="h2">
            {project.title ?? 'Project title'}
          </Typography>
          <List>
            <ListItem>
              Year developed: {project?.yearDeveloped}
            </ListItem>
            <ListItem>
              Platform: {project.platform}
            </ListItem>
            <ListItem>
              Genre: {project.genre}
            </ListItem>
            
            {project.downloadLink && (
              <ListItem>
                <Link href={project.downloadLink}>Download</Link>
              </ListItem>
              )}
              {project.website && (
                <ListItem>
                  <Link href={project.website} target="_blank">Website</Link>
                </ListItem>
              )}
            
          </List>
          <Typography variant="body1" component="p">
              Accomplishments: {project.accomplishments}
          </Typography>
        </CardContent>
        <p>{project?.yearDeveloped}</p>
        
      </div>
      </StyledCard>
      </StyledGrid>
  );
};

export default ProjectPanel;