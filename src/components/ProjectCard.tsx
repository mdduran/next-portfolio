import type { Project } from 'types/types';
import * as React from 'react';
import { Box, Card, CardContent, Modal, Typography, List, ListItem, ListItemText, Link, Button, CardMedia } from '@mui/material';
import { isMobile } from 'react-device-detect';
import DescriptionModal from './DescriptionModal';
import styles from './ProjectCard.module.scss';

const ProjectCard = ({ selectedProject }: { selectedProject: Project }): React.ReactElement => {
  const { title, yearDeveloped, platform, genre, downloadLink, website, description, projectType, shortDescription, trailer } =
    selectedProject;
  const [openModal, setOpenModal] = React.useState(false);
  const open = Boolean(openModal);
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  return (
    <Card className={styles.card} data-augmented-ui="tl-2-scoop-x tr-2-scoop-x br-round bl-round both">
      <div className={styles.scrollArea}>
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
              <ListItem sx={{ marginBottom: isMobile ? 0 : '48px', paddingBottom: '48px' }}>
                <ListItemText>Short Description: {shortDescription}</ListItemText>
              </ListItem>
              <ListItem>
                <Button onClick={handleOpen} variant="contained">
                  Read More
                </Button>
                <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                  <DescriptionModal description={description} handleClose={handleClose} />
                </Modal>
              </ListItem>
            </>
          )}
          {!shortDescription && (
            <ListItem sx={{ marginBottom: isMobile ? '25px' : '200px', paddingBottom: '32px' }}>
              <ListItemText>Description: {description}</ListItemText>
            </ListItem>
          )}
        </List>
        {trailer && (
          <Box className={styles.trailerWrapper}>
            <CardMedia
              component="iframe"
              title={title}
              src={trailer}
              className={styles.trailer}
            />
          </Box>
        )}
      </CardContent>
      </div>
    </Card>
  );
};

export default ProjectCard;
