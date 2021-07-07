import { AppBar, IconButton, Typography, Toolbar, Link as MLink } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import FolderIcon from '@material-ui/icons/Folder';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import GitHubIcon from '@material-ui/icons/GitHub';
import EmailIcon from '@material-ui/icons/Email';
import styled from "styled-components";
import * as React from 'react';
import Link from 'next/link';
import { isMobile } from 'react-device-detect';
const StyledIconButton = styled(IconButton)`
  margin-right: 2rem;
`;

const StyledMLink = styled(MLink)`
  text-decoration: none;
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
        <Link href="/projects">
          <IconButton>
            <FolderIcon style={{ paddingRight: '0.25em' }} />
          {!isMobile && (<>Projects</>)}
          </IconButton>
        </Link>
        <div id="contacts">
          <StyledMLink href="https://www.linkedin.com/in/mdduran" target="_blank">
            <IconButton>
              <LinkedInIcon />
            </IconButton>
          </StyledMLink>
          <StyledMLink href="https://github.com/mdduran" target="_blank">
            <IconButton>
              <GitHubIcon aria-label="github icon" />
            </IconButton>
          </StyledMLink>
          <StyledMLink href="mailto:marco.duran456@gmail.com" target="_blank">
            <IconButton>
              <EmailIcon />
            </IconButton>
          </StyledMLink>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
