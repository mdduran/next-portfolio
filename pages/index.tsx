import * as React from 'react';
import { Container, Card, CardContent, Divider, Link, Typography } from '@mui/material';
import styles from './Index.module.scss';

export default function Home(): React.ReactNode {
  return (
    <Container className={styles.container}>
      <Card className={styles.card} data-augmented-ui="tl-2-scoop r-round-xy br-2-round-xy b-clip l-rect-x both">
        <Typography component="h1" variant="h3">
          About me
        </Typography>
        <Divider variant="middle" />
        <CardContent className={styles.cardContent}>
          <Typography component="p">I&apos;m Marco, and I am a software engineer, game developer and musician.</Typography>

          <Typography component="p">
            There is something about how technology fascinates me, and ways it can be used to teach others, inspiring curiosity. This drives
            me to create an experience for all through the lens of my mind.
          </Typography>

          <Typography component="p">
            Currently enjoying mastering front end web development but excited to further my development skills using game engines such as{' '}
            <Link href="https://www.unrealengine.com/en-US/">Unreal Engine</Link> and <Link href="https://unity.com/">Unity</Link>.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
