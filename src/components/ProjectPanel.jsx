import * as React from 'react';
import { Card, CardContent, Grid, Link, List, ListItem, Typography } from '@material-ui/core';
import styled from 'styled-components';
import theme from '../styles/theme';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from '@react-three/drei';

const StyledCard = styled(Card)`
  max-width: 650px;
  max-height: 90vh;
`;

const StyledGrid = styled(Grid)`
  background-color: ${theme.palette.primary.main};
`;

const CartrageMesh = () => {
  const gltf = useLoader(GLTFLoader, './gltf/gamecart.gltf');
  useFrame(() => {
    if (gltf.scene.rotation.y === 360) gltf.scene.rotation.y = 0;
    else gltf.scene.rotation.y += 0.01;
  });
  return (
    <>
      <primitive object={gltf.scene} />
    </>
  );
};

const ProjectPanel = ({ state }) => {
  const { selectedProject } = state;
  return (
    <>
      {selectedProject && (
        <StyledGrid container style={{ marginTop: '0.5rem' }} spacing={0}>
          <StyledGrid container item justify={'center'}>
            <Canvas style={{ width: '400px', height: '300px' }}>
              <ambientLight intensity={2} />
              <pointLight position={[10, 10, 10]} />
              <React.Suspense fallback={null}>
                <CartrageMesh position={[1.2, 0, 0]} />
                <OrbitControls />
              </React.Suspense>
            </Canvas>
          </StyledGrid>
          <StyledGrid container item justify={'center'}>
            <StyledCard>
              <div style={{ padding: '2em' }}>
                <CardContent>
                  <Typography variant="h4" component="h2">
                    {selectedProject.title ?? 'Project title'}
                  </Typography>
                  <List>
                    <ListItem>Year developed: {selectedProject.yearDeveloped}</ListItem>
                    <ListItem>Platform: {selectedProject.platform}</ListItem>
                    <ListItem>Genre: {selectedProject.genre}</ListItem>

                    {selectedProject.downloadLink && (
                      <ListItem>
                        <Link href={selectedProject.downloadLink}>Download</Link>
                      </ListItem>
                    )}
                    {selectedProject.website && (
                      <ListItem>
                        <Link href={selectedProject.website} target="_blank">
                          Website
                        </Link>
                      </ListItem>
                    )}
                  </List>
                  <Typography variant="body1" component="p">
                    Accomplishments: {selectedProject.accomplishments}
                  </Typography>
                </CardContent>
                <p>{selectedProject.yearDeveloped}</p>
              </div>
            </StyledCard>
          </StyledGrid>
        </StyledGrid>
      )}
    </>
  );
};

export default ProjectPanel;
