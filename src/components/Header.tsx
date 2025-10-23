/* eslint-disable react/jsx-no-bind */
import { AppBar, Box, IconButton, MenuItem, Toolbar, Link as MLink, Button, Menu, Typography, Grid } from '@mui/material';
import ContactIcon from '@mui/icons-material/ContactMail';
import FolderIcon from '@mui/icons-material/Folder';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';
import * as React from 'react';
import Link from 'next/link';
import { isMobile } from 'react-device-detect';
import styles from './Header.module.scss';

const Header = (): React.ReactElement => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar className={styles.appbar} position="sticky">
      <Box className={styles.box}>
        <Toolbar className={styles.toolbar}>
          <Link className={styles.link} href="/" passHref>
            <Button className={styles.button} aria-label="Home">
              Marco Duran
            </Button>
          </Link>
          <div className={styles.divGrow} />
          <Box className={styles.navItems}>
            <Link className={styles.link} href="/projects" passHref>
              <IconButton className={styles.iconButton} size="small" aria-label="Projects">
                <Grid container spacing={0} alignItems="center" wrap="nowrap">
                  <Grid>
                    <FolderIcon className={styles.icon} />
                  </Grid>
                  <Grid>
                    <Typography className={styles.buttonText} variant="button">
                      Projects
                    </Typography>
                  </Grid>
                </Grid>
              </IconButton>
            </Link>
            <div id="contacts" aria-label="contacts">
              <IconButton
                className={styles.iconButton}
                id="contacts-button"
                onClick={handleClick}
                aria-haspopup="true"
                aria-controls={open ? 'contact-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                size="small"
                aria-label="Contact"
              >
                <Grid container spacing={0} alignItems="center" wrap="nowrap">
                  <Grid>
                    <ContactIcon className={styles.icon} />
                  </Grid>
                  <Grid>
                    <Typography className={styles.buttonText} variant="button">
                      Contact
                    </Typography>
                  </Grid>
                </Grid>
              </IconButton>
            </div>
          </Box>
        </Toolbar>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="contact-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          root: { disableScrollLock: true },
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: { xs: 1, sm: 8 },
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
