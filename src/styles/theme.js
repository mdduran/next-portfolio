import { createTheme } from '@mui/material/styles';
import colors from './colors';

const themeBreakpoints = {
  xs: 0,
  sm: 700,
  md: 900,
  lg: 1200,
  xl: 1536
};
export const MediaQueries = Object.values(themeBreakpoints).map((breakpoint) => `@media (min-width: ${breakpoint}px)`);
const theme = createTheme({
  typography: {
    fontFamily: "'Press Start 2P', cursive"
  },
  breakpoints: {
    values: themeBreakpoints
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
  },
  components: {
    MuiCardMedia: {
      styleOverrides: {
        media: {
          width: '100%',
          [MediaQueries[0]]: {
            height: '300px'
          },
          [MediaQueries[1]]: {
            height: '300px'
          },
          [MediaQueries[2]]: {
            height: '400px'
          },
          [MediaQueries[3]]: {
            height: '600px',
            width: '90%'
          }
        }
      }
    }
  }
});

export default theme;
