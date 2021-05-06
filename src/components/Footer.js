import { Typography } from "@material-ui/core";
import styled from "styled-components";
import * as React from "react";

const Footer = () => {
  return (
    <footer style={{ zIndex: 1 }}>
      <Typography>Links go here</Typography>
    </footer>
  );
};

const StyledFooter = styled(Footer)``;

export default StyledFooter;
