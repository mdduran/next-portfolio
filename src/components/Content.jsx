import * as React from 'react';
import { Grid } from '@material-ui/core';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import ProjectList from './ProjectList';
import ProjectPanel from './ProjectPanel';
import theme from '../styles/theme';

const StyledGrid = styled(Grid)`
  background-color: ${theme.palette.primary.main};
`;

const Content = ({ isMobile, state, dispatch }) => {
  return (
    <StyledGrid container>
      {!isMobile && (
        <StyledGrid item xs={2} md={2}>
          <ProjectList state={state} dispatch={dispatch} />
        </StyledGrid>
      )}
      <StyledGrid container item xs={10}>
        <ProjectPanel state={state} />
      </StyledGrid>
    </StyledGrid>
  );
};

Content.propTypes = {
  isMobile: PropTypes.bool,
  state: PropTypes.object,
  dispatch: PropTypes.object
};

Content.defaultProps = {
  isMobile: false,
  state: {},
  dispatch: {}
};

const StyledContent = styled(Content)``;

export default StyledContent;
