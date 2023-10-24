/* eslint-disable react/jsx-no-bind */
import {
  AppBar,
  IconButton,
  MenuItem,
  Popper,
  Paper,
  Toolbar,
  Link as MLink,
  styled,
  Grow,
  ClickAwayListener,
  MenuList
} from '@mui/material';
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
  const anchorRef = React.useRef<HTMLButtonElement>(null);
  const [open, setOpen] = React.useState(false);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };
  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }
    setOpen(false);
  };
  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  }
  // Return focus to button when going from closed to open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current?.focus();
    }
    prevOpen.current = open;
  }, [open]);

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
          <StyledIconButton
            id="contacts-button"
            onClick={handleToggle}
            aria-haspopup="true"
            aria-controls={open ? 'contacts-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            size="large"
          >
            <ContactIcon style={{ paddingRight: '0.25em' }} />
            {!isMobile && <>Contact</>}
          </StyledIconButton>
          <Popper open={open} anchorEl={anchorRef.current} role={undefined} placement="bottom-end" transition disablePortal>
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin: placement === 'bottom-start' ? 'left top' : 'right bottom'
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList autoFocusItem={open} id="contacts-menu" aria-labelledby="contacts-button" onKeyDown={handleListKeyDown}>
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
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
