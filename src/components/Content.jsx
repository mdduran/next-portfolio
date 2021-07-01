import { Grid } from '@material-ui/core';
import styled from 'styled-components';
import ProjectList from './ProjectList';
import ProjectPanel from './ProjectPanel';
import theme from "../styles/theme";

const StyledGrid = styled(Grid)`
  width: '100%';
  height: '100%';
  background-color: ${theme.palette.primary.main};
  flex-grow: 1;
`;

const Content = (props) => {
  const { dispatch, state, isMobile } = props;
  return (
    <StyledGrid container>
      {!isMobile && (
        <StyledGrid item>
          <ProjectList dispatch={dispatch} />
        </StyledGrid>
      )}
      <StyledGrid item style={{ marginLeft: '3em', paddingLeft: '3em' }}>
        <StyledGrid container alignItems='center' justify='center'>
          <StyledGrid item>
            <ProjectPanel project={state?.selectedProject} />
          </StyledGrid>
        </StyledGrid>
      </StyledGrid>
    </StyledGrid>
  );
};

const StyledContent = styled(Content)``;

export default StyledContent;
