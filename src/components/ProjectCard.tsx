import type { Project } from 'types/types';
import * as React from 'react';
import styled from '@emotion/styled';
import { Box, Card, CardContent, CardMedia, Modal, Typography, List, ListItem, ListItemText, Link, Button } from '@mui/material';
import { isMobile } from 'react-device-detect';
import { MediaQueries } from '@theme';
import DescriptionModal from './DescriptionModal';

const StyledCard = styled(Card)`
  ${MediaQueries[0]} {
    width: 270px;
    padding: 15px 10px;
    margin: 15px 5px;
  }

  ${MediaQueries[1]} {
    width: 600px;
    padding: 32px;
    margin: 32px;i
  }

  ${MediaQueries[2]} {
    width: 800px;
    padding: 32px;
    margin: 32px;
  }

  '--aug-inlay':initial;
  '--aug-delegated-inlay':initial;
  '--aug-border-all':8px;

  & .MuiListItem-root {
    display: flex;
    justify-content: center;
  }

  h2 {
    ${MediaQueries[0]} {
      font-size: 1.20rem;
      padding-top: 20px;
      display: flex;
      justify-content: center;
    }
  }
`;

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
  const [openModal, setOpenModal] = React.useState(false);
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  return (
    <StyledCard data-augmented-ui="tl-2-scoop-x tr-2-scoop-x br-round bl-round both">
      {trailer && (
        <Box component="div" display="flex" justifyContent="center" alignItems="center" mt={4}>
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
            <ListItem>
              <Link href={downloadLink} underline="hover">
                Download
              </Link>
            </ListItem>
          )}
          {website && website.length > 0 && (
            <ListItem>
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
              <ListItem>
                <Button onClick={handleOpen} variant="contained">
                  Read More
                </Button>
                <Modal
                  open={openModal}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <DescriptionModal description={description} handleClose={handleClose} />
                </Modal>
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
