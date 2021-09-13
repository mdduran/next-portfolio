import { createTheme } from '@material-ui/core';
import colors from './colors';

const theme = createTheme({
  typography: {
    fontFamily: "'Press Start 2P', cursive"
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
      root: {
        fontFamily: "'Press Start 2P', cursive",
        fontSize: 'small'
      }
    }
  }
});

export default theme;
