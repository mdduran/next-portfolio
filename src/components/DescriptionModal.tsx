import styled from '@emotion/styled';
import * as React from 'react';
import { Box, Button, Typography } from '@mui/material';
import theme, { MediaQueries } from '@theme';

const StyledDescriptionModal = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  ${MediaQueries[0]} {
    width: 200px;
    height: 400px;
  }
  ${MediaQueries[1]} {
    width: 400px;
  }
  ${MediaQueries[2]} {
    width: 600px;
  }
  border: 2px solid #000;
  background-color: ${theme.palette.primary.main};
  padding: 20px;
  box-shadow: 10px 5px 5px black;
  display: flex;
  flex-direction: column;

  --aug-inlay: initial;
  --aug-delegated-inlay: initial;
  --aug-border-all: 4px;

  & > #modal-modal-title {
    text-align: center;
    margin-top: 5px;
  }

  & > #modal-modal-description {
    margin: 15px 25px 0 25px;
    text-align: center;
  }

  & > #modal-modal-close {
    justify-content: center;
    margin-top: 20px;
  }

  & > .description-container {
    overflow-y: auto;
    overflow-x: auto;
  }
`;

const DescriptionModal = ({ description, handleClose }: { description: string | undefined, handleClose: () => React.ComponentState }): React.ReactElement => {
  return (
    <StyledDescriptionModal data-augmented-ui="t-round-x b-round-x r-round-xy l-round-xy both">
      <Typography id="modal-modal-title" variant="h6" component="h2">
        Description
      </Typography>
      <div className="description-container">
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {description}
        </Typography>
      </div>
      <Button id="modal-modal-close" onClick={handleClose} variant="contained">
        Close
      </Button>
    </StyledDescriptionModal>
  )
};

export default DescriptionModal;
