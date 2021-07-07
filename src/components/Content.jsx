import { Grid } from '@material-ui/core';
import styled from 'styled-components';
import ProjectList from './ProjectList';
import ProjectPanel from './ProjectPanel';
import theme from "../styles/theme";

const StyledGrid = styled(Grid)`
  background-color: ${theme.palette.primary.main};
`;

const Content = (props) => {
  const { dispatch, state, isMobile } = props;
  return (
    <StyledGrid container>
      {!isMobile && (
        <StyledGrid item xs={2} md={2}>
          <ProjectList dispatch={dispatch} />
        </StyledGrid>
      )}
      <StyledGrid
        container
        item
        xs={10}
      >
        <ProjectPanel project={state?.selectedProject} />
      </StyledGrid>
    </StyledGrid>
  );
};

const StyledContent = styled(Content)``;

export default StyledContent;
