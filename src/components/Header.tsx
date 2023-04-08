import { AppBar, IconButton, Menu, MenuItem, Toolbar, Link as MLink, styled } from '@mui/material';
import Button from '@mui/material/Button';
import ContactIcon from '@mui/icons-material/ContactMail';
import FolderIcon from '@mui/icons-material/Folder';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';
import * as React from 'react';
import Link from 'next/link';
import { isMobile } from 'react-device-detect';

const Header = (): React.ReactElement => {
  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);
  const handleOpen = (event: React.SyntheticEvent) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const StyledDiv = styled('div')`
    flex-grow: 1;
  `;
  const StyledIconButton = styled(IconButton)`
    font-family: 'Press Start 2P', cursive;
    font-size: small;
  `;
  const StyledButton = styled(Button)`
    font-family: 'Press Start 2P', cursive;
    font-size: medium;
    color: black;
  `;
  const StyledLink = styled(Link)`
    text-decoration: none;
  `;

  return (
    <AppBar position="static">
      <Toolbar>
        <StyledLink href="/" passHref>
          <StyledButton>Marco Duran</StyledButton>
        </StyledLink>
        <StyledDiv />
        <StyledLink href="/portfolio" passHref>
          <StyledIconButton size="large">
            <FolderIcon style={{ paddingRight: '0.25em' }} />
            {!isMobile && <>Portfolio</>}
          </StyledIconButton>
        </StyledLink>
        <div id="contacts" aria-label="contacts">
          <StyledIconButton id="contacts-button" onClick={handleOpen} aria-haspopup="true" aria-controls="contacts-menu" size="large">
            <ContactIcon style={{ paddingRight: '0.25em' }} />
            {!isMobile && <>Contact</>}
          </StyledIconButton>
          <Menu
            id="contacts-menu"
            aria-labelledby="contacts-button"
            open={open}
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
            onClose={handleClose}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center'
            }}
          >
            <MenuItem>
              <MLink href="https://www.linkedin.com/in/mdduran" target="_blank" underline="none">
                <IconButton disableFocusRipple disableRipple size="large">
                  <LinkedInIcon style={{ paddingRight: '0.25em' }} /> LinkedIn
                </IconButton>
              </MLink>
            </MenuItem>
            <MenuItem>
              <MLink href="https://github.com/mdduran" target="_blank" underline="none">
                <IconButton disableFocusRipple disableRipple size="large">
                  <GitHubIcon aria-label="github icon" style={{ paddingRight: '0.25em' }} /> Github
                </IconButton>
              </MLink>
            </MenuItem>
            <MenuItem>
              <MLink href="mailto:marco.duran456@gmail.com" target="_blank" underline="none">
                <IconButton disableFocusRipple disableRipple size="large">
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
