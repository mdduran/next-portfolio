import type { Project } from '@type';
import * as React from 'react';
import { Box, Card, CardContent, Chip, Typography, List, ListItem, ListItemText, Link, CardMedia, Stack } from '@mui/material';
import styles from './ProjectCard.module.scss';

type ProjectCardProps = {
  project: Project;
  // Rendered long-form description
  children?: React.ReactNode;
};

const ProjectCard = ({ project, children }: ProjectCardProps): React.ReactElement => {
  const { title, year, platform, genre, download, website, summary, highlights, tags, trailer } = project;

  return (
    <Card className={styles.card} data-augmented-ui="tl-2-scoop-x tr-2-scoop-x br-round bl-round both">
      <CardContent>
        <Typography className={styles.title} variant="h4" component="h1">
          {title}
        </Typography>
        <Typography className={styles.summary} component="p">
          {summary}
        </Typography>
        <List>
          <ListItem>
            <ListItemText>Year developed: {year}</ListItemText>
          </ListItem>
          {platform && (
            <ListItem>
              <ListItemText>Platform: {platform}</ListItemText>
            </ListItem>
          )}
          {genre && (
            <ListItem>
              <ListItemText>Genre: {genre}</ListItemText>
            </ListItem>
          )}
          {download && (
            <ListItem>
              <Link href={download} target="_blank" rel="noopener" underline="hover">
                Download
              </Link>
            </ListItem>
          )}
          {website && (
            <ListItem>
              <Link href={website} target="_blank" rel="noopener" underline="hover">
                Website
              </Link>
            </ListItem>
          )}
        </List>
        {tags.length > 0 && (
          <Stack className={styles.tags} direction="row" useFlexGap flexWrap="wrap" spacing={1}>
            {tags.map((tag) => (
              <Chip key={tag} label={tag} size="small" variant="outlined" />
            ))}
          </Stack>
        )}
        {highlights.length > 0 && (
          <Box className={styles.section}>
            <Typography variant="h6" component="h2">
              Highlights
            </Typography>
            <ul>
              {highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </Box>
        )}
        {children && <Box className={styles.section}>{children}</Box>}
        {trailer && (
          <Box className={styles.trailerWrapper}>
            <CardMedia component="iframe" title={`${title} trailer`} src={trailer} className={styles.trailer} allowFullScreen />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
