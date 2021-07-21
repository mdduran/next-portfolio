import { AppBar, IconButton, Menu, MenuItem, Typography, Toolbar, Link as MLink } from '@material-ui/core';
import ContactIcon from '@material-ui/icons/ContactMail';
import MenuIcon from '@material-ui/icons/Menu';
import FolderIcon from '@material-ui/icons/Folder';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import GitHubIcon from '@material-ui/icons/GitHub';
import EmailIcon from '@material-ui/icons/Email';
import styled from 'styled-components';
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
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  return (
    <AppBar position="static">
      <Toolbar>
        {isMobile && (
          <StyledIconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </StyledIconButton>
        )}
        <Link href="/">
          <Typography variant="h5" style={{ cursor: 'pointer' }}>
            Marco Daniel Duran
          </Typography>
        </Link>
        <div style={{ flexGrow: '1' }} />
        <Link href="/projects">
          <IconButton>
            <FolderIcon style={{ paddingRight: '0.25em' }} />
            {!isMobile && <>Projects</>}
          </IconButton>
        </Link>
        <div id="contacts">
          <IconButton onClick={handleOpen} aria-haspopup="true" aria-controls="contacts-menu">
            <ContactIcon style={{ paddingRight: '0.25em' }} />
            {!isMobile && <>Contact</>}
          </IconButton>
          <Menu
            id="contacts-menu"
            open={open}
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            getContentAnchorEl={null}
            onClose={handleClose}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center'
            }}
          >
            <MenuItem>
              <StyledMLink href="https://www.linkedin.com/in/mdduran" target="_blank">
                <IconButton>
                  <LinkedInIcon style={{ paddingRight: '0.25em' }} /> LinkedIn
                </IconButton>
              </StyledMLink>
            </MenuItem>
            <MenuItem>
              <StyledMLink href="https://github.com/mdduran" target="_blank">
                <IconButton>
                  <GitHubIcon aria-label="github icon" style={{ paddingRight: '0.25em' }} /> Github
                </IconButton>
              </StyledMLink>
            </MenuItem>
            <MenuItem>
              <StyledMLink href="mailto:marco.duran456@gmail.com" target="_blank">
                <IconButton>
                  <EmailIcon style={{ paddingRight: '0.25em' }} /> Email
                </IconButton>
              </StyledMLink>
            </MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
