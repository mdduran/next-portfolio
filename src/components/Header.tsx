import { AppBar, IconButton, Menu, MenuItem, Button, Toolbar, Link as MLink } from '@material-ui/core';
import ContactIcon from '@material-ui/icons/ContactMail';
import FolderIcon from '@material-ui/icons/Folder';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import GitHubIcon from '@material-ui/icons/GitHub';
import EmailIcon from '@material-ui/icons/Email';
import * as React from 'react';
import Link from 'next/link';
import { isMobile } from 'react-device-detect';

const Header = (): React.ReactElement => {
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
        <Link href="/" passHref>
          <Button component="h1">Marco Daniel Duran</Button>
        </Link>
        <div style={{ flexGrow: 1 }} />
        <Link href="/projects" passHref>
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
              <MLink href="https://www.linkedin.com/in/mdduran" target="_blank" underline="none">
                <IconButton disableFocusRipple disableRipple>
                  <LinkedInIcon style={{ paddingRight: '0.25em' }} /> LinkedIn
                </IconButton>
              </MLink>
            </MenuItem>
            <MenuItem>
              <MLink href="https://github.com/mdduran" target="_blank" underline="none">
                <IconButton disableFocusRipple disableRipple>
                  <GitHubIcon aria-label="github icon" style={{ paddingRight: '0.25em' }} /> Github
                </IconButton>
              </MLink>
            </MenuItem>
            <MenuItem>
              <MLink href="mailto:marco.duran456@gmail.com" target="_blank" underline="none">
                <IconButton disableFocusRipple disableRipple>
                  <EmailIcon style={{ paddingRight: '0.25em' }} /> Email
                </IconButton>
              </MLink>
            </MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
