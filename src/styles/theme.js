import { createTheme } from '@mui/material/styles';
import colors from './colors';

const theme = createTheme({
  typography: {
    fontFamily: "'Press Start 2P', cursive"
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 700,
      md: 900,
      lg: 1200,
      xl: 1536
    }
  },
  palette: {
    primary: {
      light: colors.zomp,
      main: colors.castletonGreen,
      dark: colors.phthaloGreen
    },
    secondary: {
      light: colors.cadetBlue,
      main: colors.feldgrau,
      dark: colors.outerSpaceCrayola
    },
    error: {
      light: colors.puce,
      main: colors.popstar,
      dark: colors.solidPink
    },
    success: {
      light: colors.caribbeanGreen,
      main: colors.spanishViridian,
      dark: colors.tropicalRainforest
    },
    warning: {
      light: colors.queenPink,
      main: colors.tuscany,
      dark: colors.roseDust
    },
    info: {
      light: colors.rocketMetallic,
      main: colors.deepTaupe,
      dark: colors.blackCoffee
    },
    header: {
      light: colors.zomp,
      main: colors.white,
      dark: colors.black
    }
  },
  overrides: {
    MuiIconButton: {
      styleOverrides: {
        root: {
          'font-family': "'Press Start 2P', cursive",
          'font-size': 'small'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: colors.black
        }
      }
    }
  }
});

export default theme;
