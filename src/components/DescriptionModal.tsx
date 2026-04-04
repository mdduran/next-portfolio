import * as React from 'react';
import { Box, Button, Typography } from '@mui/material';
import styles from './DescriptionModal.module.scss';

export type DescriptionModalType = {
  description: string | undefined;
  handleClose: () => React.ComponentState;
};
const DescriptionModalInner = ({ description, handleClose }: DescriptionModalType): React.ReactElement => {
  return (
    <Box className={styles.descriptionModal} data-augmented-ui="t-round-x b-round-x r-round-xy l-round-xy both">
      <Typography id="modal-title" variant="h6" component="h2">
        {description ? 'Project Description' : 'Description'}
      </Typography>
      <div className="description-container">
        <Typography id="modal-description">
          {description}
        </Typography>
      </div>
      <Button id="modal-modal-close" onClick={handleClose} variant="contained">
        Close
      </Button>
    </Box>
  );
};

const DescriptionModal = React.forwardRef((props: DescriptionModalType, ref) => {
  const { description, handleClose } = props;
  return <DescriptionModalInner description={description} handleClose={handleClose} />;
});

DescriptionModal.displayName = 'DescriptionModal';

export default DescriptionModal;
