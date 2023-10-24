import type { Project } from 'types/types';
import * as React from 'react';
import styled from '@emotion/styled';
import { Box, Card, CardContent, CardMedia, Modal, Typography, List, ListItem, ListItemText, Link, Button } from '@mui/material';
import { isMobile } from 'react-device-detect';
import theme, { MediaQueries } from '@theme';

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

const StyledDescriptionModal = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  border: 2px solid #000;
  background-color: ${theme.palette.primary.main};
  padding: 20px;
  box-shadow: 10px 5px 5px black;
  display: flex;
  flex-direction: column;

  --aug-inlay: initial;
  --aug-delegated-inlay: initial;
  --aug-border-all: 4px;

  & > #modal-modal-title {
    text-align: center;
    margin-top: 5px;
  }

  & > #modal-modal-description {
    margin: 15px 25px 0 25px;
    text-align: center;
  }

  & > #modal-modal-close {
    justify-content: center;
    margin-top: 20px;
  }
`;

const ProjectCard = ({ selectedProject }: { selectedProject: Project }): React.ReactElement => {
  const { title, yearDeveloped, platform, genre, downloadLink, website, description, projectType, shortDescription, trailer } =
    selectedProject;
  const [openModal, setOpenModal] = React.useState(false);
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

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
                <Button onClick={handleOpen} variant="contained">
                  Read More
                </Button>
                <Modal
                  open={openModal}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <StyledDescriptionModal data-augmented-ui="t-round-x b-round-x r-round-xy l-round-xy both">
                    <Typography id="modal-modal-title" variant='h6' component="h2">Description</Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>{description}</Typography>
                    <Button id="modal-modal-close" onClick={handleClose} variant="contained">Close</Button>
                  </StyledDescriptionModal>
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
