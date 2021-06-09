import * as React from 'react';
import { Grid, Paper, Typography, List, ListItem, ListItemAvatar, ListItemText, Avatar } from '@material-ui/core';
import FolderIcon from '@material-ui/icons/Folder';
import styled from 'styled-components';

const generate = (element) => {
  return [0, 1, 2].map((value) =>
    React.cloneElement(element, {
      key: value
    })
  );
};

const Project = ({ title, yearDeveloped, platform, genre, accomplishments, splashImage, description, downloadLink, trailer }) => {
  return (
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
  );
};

const StyledProject = styled(Project)``;

export default StyledProject;
