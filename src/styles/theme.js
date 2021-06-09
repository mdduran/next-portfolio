import { createMuiTheme } from '@material-ui/core';
import colors from './colors';

const theme = createMuiTheme({
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
    }
  }
});

export default theme;
