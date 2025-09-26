import { createTheme } from '@mui/material/styles';
import colors from './colors.json';
import themeBreakpoints from './breakpoints.json';

export const { lg, md, sm, xs, xxs } = {
  xxs: 0,
  xs: 1,
  sm: 2,
  md: 3,
  lg: 4,
  xl: 5
};
export const MediaQueries = Object.values(themeBreakpoints).map((breakpoint) => `@media (min-width: ${breakpoint}px)`);
const applyMedias = (queries, styles) => queries.reduce((acc, q) => ({ ...acc, [q]: styles }), {});
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
    MuiModal: {
      defaultProps: {
        disableScrollLock: true
      }
    },
    MuiCardMedia: {
      styleOverrides: {
        media: {
          width: '100%',
          ...applyMedias([MediaQueries[xxs], MediaQueries[xs], MediaQueries[sm]], { height: '300px' }),
          [MediaQueries[md]]: {
            height: '400px'
          },
          [MediaQueries[lg]]: {
            height: '600px',
            width: '90%'
          }
        }
      }
    }
  }
});

export default theme;
