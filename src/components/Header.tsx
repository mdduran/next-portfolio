/* eslint-disable react/jsx-no-bind */
import { AppBar, Box, IconButton, MenuItem, Toolbar, Link as MLink, Button, Menu, Typography, Grid } from '@mui/material';
import ContactIcon from '@mui/icons-material/ContactMail';
import FolderIcon from '@mui/icons-material/Folder';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';
import * as React from 'react';
import Link from 'next/link';
import styled from '@emotion/styled';
import { MediaQueries } from '@theme';
import { isMobile } from 'react-device-detect';

const Header = (): React.ReactElement => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const StyledDiv = styled.div`
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
  const StyledBox = styled(Box)`
    display: flex;
    align-items: center;
    text-align: center;
    width: 100%;
  `;
  const StyledToolbar = styled(Toolbar)`
    width: 100%;
    display: flex;
  `;
  const StyledButtonText = styled(Typography)`
    font-size: 8px;
    margin-left: 4px;
  `;
  const StyledMobileButtonText = styled(Typography)`
    font-size: 8px;
  `;

  const StyledNavItems = styled(Box)`
    ${MediaQueries[1]},
    ${MediaQueries[2]} {
      float: right;
    }
    display: flex;
  `;

  return (
    <AppBar position="static">
      <StyledBox>
        <StyledToolbar>
          <StyledLink href="/" passHref>
            <StyledButton>Marco Duran</StyledButton>
          </StyledLink>
          <StyledDiv />
          <StyledNavItems>
            <StyledLink href="/projects" passHref>
              <StyledIconButton size="large">
                <Grid container spacing={2}>
                  <Grid sx={{ marginLeft: '26px', marginTop: '6px', padding: '0' }}>
                    <FolderIcon />
                  </Grid>
                  <Grid sx={{ paddingTop: '10px' }}>
                    {isMobile ? (
                      <StyledMobileButtonText variant="button">Projects</StyledMobileButtonText>
                    ) : (
                      <StyledButtonText variant="button">Projects</StyledButtonText>
                    )}
                  </Grid>
                </Grid>
              </StyledIconButton>
            </StyledLink>
            <div id="contacts" aria-label="contacts">
              <StyledIconButton
                id="contacts-button"
                onClick={handleClick}
                aria-haspopup="true"
                aria-controls={open ? 'contacts-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                size="large"
              >
                <Grid container spacing={2}>
                  <Grid sx={{ marginLeft: '24px', marginTop: '6px', padding: '0' }}>
                    <ContactIcon />
                  </Grid>
                  <Grid sx={{ paddingTop: '10px' }}>
                    {isMobile ? (
                      <StyledMobileButtonText variant="button">Contact</StyledMobileButtonText>
                    ) : (
                      <StyledButtonText variant="button">Contact</StyledButtonText>
                    )}
                  </Grid>
                </Grid>
              </StyledIconButton>
            </div>
          </StyledNavItems>
        </StyledToolbar>
      </StyledBox>
      <Menu
        anchorEl={anchorEl}
        id="contact-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 8,
              right: 25,
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0
              }
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
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
    </AppBar>
  );
};

export default Header;
