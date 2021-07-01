import { AppBar, IconButton, Typography, Toolbar } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import GitHubIcon from '@material-ui/icons/GitHub';
import FolderIcon from '@material-ui/icons/Folder';
import styled from "styled-components";
import * as React from 'react';
import Link from 'next/link';
import { isMobile } from 'react-device-detect';
const StyledIconButton = styled(IconButton)`
  margin-right: 2rem;
`;

const Header = () => {  
  return (
    <AppBar position="static">
      <Toolbar>
        {isMobile && (
          <StyledIconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </StyledIconButton>
        )}
          <Link href="/">
            <Typography variant="h5" style={{ cursor: 'pointer' }}>Marco Daniel Duran</Typography>
          </Link>
          <div style={{ flexGrow: '1' }} />
        <Link href="https://github.com/mdduran" target="_blank">
          <IconButton >
            <GitHubIcon aria-label="github icon" style={{ paddingRight: '0.25em' }} />
            Github
          </IconButton>
        </Link>
        <Link href="/projects">
          <IconButton>
            <FolderIcon style={{ paddingRight: '0.25em' }} />
            {!isMobile && (<>Projects</>)}
          </IconButton>
        </Link>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
