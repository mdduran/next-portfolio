import { AppBar, IconButton, Typography, Toolbar } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import GitHubIcon from '@material-ui/icons/GitHub';
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
          <IconButton><GitHubIcon /></IconButton>
          <IconButton>Projects</IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
