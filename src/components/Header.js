import { AppBar, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import * as React from "react";
import theme from "../styles/theme";

const StyledAppBar = withStyles({
  root: {
    color: theme.palette.secondary,
    backgroundColor: theme.palette.primary,
    zIndex: 1,
  },
})(AppBar);

const Header = () => {
  return (
    <StyledAppBar position="static">
      <Typography variant="h5">Marco Daniel Duran</Typography>
    </StyledAppBar>
  );
};

export default Header;
