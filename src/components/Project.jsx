import * as React from 'react';
import PropTypes from 'prop-types';
import { Container, Grid, Paper, Typography, List, ListItem, ListItemAvatar, ListItemText, Avatar } from '@material-ui/core';
import FolderIcon from '@material-ui/icons/Folder';
import styled from 'styled-components';

const generate = (element) => {
  return [0, 1, 2].map((value) =>
    React.cloneElement(element, {
      key: value
    })
  );
};

// eslint-disable-next-line no-unused-vars
const Project = ({ title, yearDeveloped, platform, genre, accomplishments, splashImage, description, downloadLink, trailer }) => {
  return (
    <Container fixed maxWidth="sm">
      <Paper style={{ width: '90vw' }}>
        <Grid container>
          <Grid item md>
            <Typography variant="h3">{title}</Typography>
          </Grid>
          <Grid container>
            <List>
              {generate(
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <FolderIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Single-line item" />
                </ListItem>
              )}
            </List>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

Project.propTypes = {
  title: PropTypes.string,
  yearDeveloped: PropTypes.string,
  platform: PropTypes.string,
  genre: PropTypes.string,
  accomplishments: PropTypes.string,
  splashImage: PropTypes.string,
  description: PropTypes.string,
  downloadLink: PropTypes.string,
  trailer: PropTypes.string
};

Project.defaultProps = {
  title: '',
  yearDeveloped: '',
  platform: '',
  genre: '',
  accomplishments: '',
  splashImage: '',
  description: '',
  downloadLink: '',
  trailer: ''
};

const StyledProject = styled(Project)``;

export default StyledProject;
