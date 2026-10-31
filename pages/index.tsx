import * as React from 'react';
import type { GetStaticProps } from 'next';
import Link from 'next/link';
import { Button, Card, CardContent, Container, Divider, Link as MLink, Typography } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import PlayIcon from '@mui/icons-material/SportsEsports';
import type { Project } from '@type';
import { getAllProjects } from '@lib/projects';
import FeaturedCarousel from '@components/FeaturedCarousel';
import styles from './Index.module.scss';

type HomeProps = {
  featured: Project[];
};

export const getStaticProps: GetStaticProps<HomeProps> = () => {
  return { props: { featured: getAllProjects().filter((project) => project.featured) } };
};

export default function Home({ featured }: HomeProps): React.ReactNode {
  return (
    <div className={styles.page}>
      <Container className={styles.container}>
        <section className={styles.hero}>
          <div className={styles.intro}>
            <Typography className={styles.name} component="h1" variant="h3">
              Marco Duran
            </Typography>
            <Typography className={styles.tagline} component="p">
              I build games and software that spark curiosity.
            </Typography>
            <div className={styles.actions}>
              <Button component={Link} href="/play" variant="contained" color="success" startIcon={<PlayIcon />}>
                Play to explore
              </Button>
              <Button component={Link} href="/projects" variant="outlined" color="inherit" startIcon={<FolderIcon />}>
                Browse projects
              </Button>
            </div>
          </div>
          <div className={styles.featured}>
            <FeaturedCarousel projects={featured} />
          </div>
        </section>

        <Card className={styles.card} data-augmented-ui="tl-2-scoop r-round-xy br-2-round-xy b-clip l-rect-x both">
          <Typography component="h2" variant="h3">
            About me
          </Typography>
          <Divider variant="middle" />
          <CardContent className={styles.cardContent}>
            <Typography component="p">I&apos;m Marco, and I am a software engineer, game developer and musician.</Typography>

            <Typography component="p">
              There is something about how technology fascinates me, and ways it can be used to teach others, inspiring curiosity. This
              drives me to create an experience for all through the lens of my mind.
            </Typography>

            <Typography component="p">
              Currently enjoying mastering front end web development but excited to further my development skills using game engines such
              as <MLink href="https://www.unrealengine.com/en-US/">Unreal Engine</MLink> and <MLink href="https://unity.com/">Unity</MLink>.
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
