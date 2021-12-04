import * as React from 'react';
import { Container, Card, CardContent, Divider, Link, Typography, styled, useTheme } from '@material-ui/core';

export default function Home(): React.ReactNode {
  const theme = useTheme();
  const StyledContainer = styled(Container)({
    width: '100vw',
    paddingTop: theme.spacing(4),
    display: 'flex',
    '& h1': {
      textAlign: 'center',
      padding: `${theme.spacing(2)}px 0 0 ${theme.spacing(2)}px`
    },
    '& p': {
      padding: `${theme.spacing(2)}px 0 ${theme.spacing(2)}px 0`
    }
  });

  const StyledCard = styled(Card)({
    marginTop: theme.spacing(4),
    minHeight: '80%',
    '--aug-inlay': 'initial',
    '--aug-delegated-inlay': 'initial',
    '--aug-border-all': '8px'
  });

  const StyledCardContent = styled(CardContent)({
    flex: '1 0 auto',
    margin: `0 ${theme.spacing(4)}px ${theme.spacing(2)}px ${theme.spacing(4)}px`
  });

  return (
    <StyledContainer>
      <StyledCard data-augmented-ui="tl-2-scoop r-round-xy br-2-round-xy b-clip l-rect-x both">
        <Typography component="h1" variant="h3">
          About me
        </Typography>
        <Divider variant="middle" />
        <StyledCardContent>
          <Typography component="p">I&apos;m Marco, and I am a software engineer, game developer and musician.</Typography>

          <Typography component="p">
            There is something about how technology fascinates me, and ways it can be used to teach others, inspiring curiosity. This drives
            me to create an experience for all through the lens of my mind.
          </Typography>

          <Typography component="p">
            Currently enjoying mastering front end web development but excited to further my development skills using game engines such as{' '}
            <Link href="https://www.unrealengine.com/en-US/">Unreal Engine</Link> and <Link href="https://unity.com/">Unity</Link>.
          </Typography>
        </StyledCardContent>
      </StyledCard>
    </StyledContainer>
  );
}
