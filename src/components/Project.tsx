import * as React from 'react';
import { Container, Grid, Paper, Typography, List, ListItem, ListItemAvatar, ListItemText, Avatar } from '@material-ui/core';
import FolderIcon from '@material-ui/icons/Folder';
import styled from 'styled-components';
import { Project as ProjectProps } from "../types";

const generate = (element) => {
  return [0, 1, 2].map((value) =>
    React.cloneElement(element, {
      key: value
    })
  );
};

// eslint-disable-next-line no-unused-vars
const Project = ({ title, yearDeveloped, platform, genre, accomplishments, splashImage, description, downloadLink, trailer }: ProjectProps) => {
  return (
    <Container fixed maxWidth="sm">
      <Paper style={{ width: '90vw' }}>
        <Grid container>
          <Grid item md>
            <Typography variant="h3">{title}</Typography>
            <Typography variant="inherit">{yearDeveloped}</Typography>
            <Typography variant="inherit">{platform}</Typography>
            <Typography variant="inherit">{genre}</Typography>
            <Typography variant="inherit">{accomplishments}</Typography>
            <Typography variant="inherit">{splashImage}</Typography>
            <Typography variant="inherit">{description}</Typography>
            <Typography variant="inherit">{downloadLink}</Typography>
            <Typography variant="inherit">{trailer}</Typography>
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

const StyledProject = styled(Project)``;

export default StyledProject;
