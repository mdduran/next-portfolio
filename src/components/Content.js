import { Typography, Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemText } from '@material-ui/core';
import styled from 'styled-components';
import { FixedSizeList } from 'react-window';
import { makeStyles } from '@material-ui/core/styles';
import * as React from 'react';
import Project from './Project';
import projectData from '../data/projects';
import colors from '../styles/colors';
import theme from '../styles/theme';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    width: '100%',
    maxWidth: 300,
    backgroundColor: theme.palette.primary.main
  }
}));

const gamesList = projectData.games;
const softwareList = projectData.software;

const renderGameRow = (props) => {
  const { index } = props;
  return (
    <ListItem button key={index}>
      <ListItemText primary={gamesList[index].title} />
    </ListItem>
  );
};

const renderSoftwareRow = (props) => {
  const { index } = props;
  return (
    <ListItem button key={index}>
      <ListItemText primary={softwareList[index].title} />
    </ListItem>
  );
};

const Content = () => {
  const classes = useStyles(theme);
  const [expanded, setExpanded] = React.useState('games');
  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <div className={classes.root}>
      <Accordion expanded={expanded === 'games'} onChange={handleChange('games')}>
        <AccordionSummary aria-controls="games-content" id="games-header">
          <Typography variant="h5">Games</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FixedSizeList height={300} width={200} itemSize={10} itemCount={gamesList.length}>
            {renderGameRow}
          </FixedSizeList>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'software'} onChange={handleChange('software')}>
        <AccordionSummary aria-controls="software-content" id="software-header">
          <Typography variant="h5" align="left" gutterBottom>
            Software
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FixedSizeList height={300} width={200} itemSize={10} itemCount={softwareList.length}>
            {renderSoftwareRow}
          </FixedSizeList>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

const StyledContent = styled(Content)``;

export default StyledContent;
