import { Container, Paper } from '@material-ui/core';
import styled from 'styled-components';
const StyledPaper = styled(Paper)`
  padding: 1em;
  height: 85vh;
  margin: auto;

  @media screen and (max-width: 800px) {
    text-align: center;
  }
`;
export default function Home() {
  return (
    <>
      <Container style={{ paddingTop: '1em'}}>
        <StyledPaper>This is currently under construction.</StyledPaper>
      </Container>
    </>
  );
}
