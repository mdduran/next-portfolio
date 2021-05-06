import { Typography, Tab, Tabs, Box } from "@material-ui/core";
import styled from "styled-components";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import * as React from "react";
import Project from "./Project";
import projectData from "../data/projects";
import colors from "../styles/colors";

const StyledTabs = withStyles({
  root: {
    height: "100%",
  },
  indicator: {
    display: "flex",
    alignContent: "left",
    "& > span": {
      maxWidth: 40,
      width: "100%",
      background: colors.phthaloGreen,
    },
  },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

const StyledTab = withStyles({
  root: {
    textTransform: "none",
    color: "#000",
    "&:focus": {
      opacity: 1,
    },
  },
  wrapper: {
    alignItems: "flex-start",
  },
})((props) => <Tab disableRipple {...props} />);

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography variant="h5">{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const a11yProps = (index) => {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    height: "100%",
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

const Content = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const projectList = [...projectData.games, ...projectData.software];

  return (
    <div className={classes.root}>
      <StyledTabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Main content navigation"
        className={classes.tabs}
      >
        {projectList.map((project, index) => (
          <StyledTab key={index} label={project.title} {...a11yProps(index)} />
        ))}
      </StyledTabs>
      {projectList.map((project, index) => (
        <TabPanel key={index} value={value} index={index}>
          <Project {...project} />
        </TabPanel>
      ))}
    </div>
  );
};

const StyledContent = styled(Content)``;

export default StyledContent;
