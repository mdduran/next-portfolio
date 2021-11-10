import * as React from 'react';
import { Container, Grid, Paper, Typography } from '@material-ui/core';
import styled from 'styled-components';

const StyledPaper = styled(Paper)`
  padding: 1em;
  height: 85vh;
  margin: auto;
  background-color: theme;
  @media screen and (max-width: 800px) {
    text-align: center;
  }
`;
export default function Home(): React.ReactNode {
  return (
    <>
      <Container id="home" style={{ paddingTop: '1em' }}>
        <StyledPaper variant="outlined">
          <Grid>
            <Typography component="h1">What do I do?</Typography>
          </Grid>
          <h2>Is it for money? No, it&apos;s for building my skills</h2>
          <h3>It&apos;s the people I meet along the way who teach me the important things in life</h3>
        </StyledPaper>
      </Container>
    </>
  );
}
