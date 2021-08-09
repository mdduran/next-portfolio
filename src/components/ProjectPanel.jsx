import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import styled from 'styled-components';
import theme from '../styles/theme';
import ProjectCard from './ProjectCard';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import GameCartModel from './GameCartModel';
import ModelLoader from './ModelLoader';

const StyledGrid = styled(Grid)`
  background-color: ${theme.palette.primary.main};
`;

const ProjectPanel = ({ state }) => {
  const { selectedProject } = state;
  const ref = React.useRef();
  return (
    <>
      {selectedProject && (
        <StyledGrid container style={{ marginTop: '0.5rem' }} spacing={0}>
          <StyledGrid container item justify={'center'}>
            <Canvas shadows dpr={[1, 2]} camera={{ fov: 50 }} style={{ width: '400px', height: '300px' }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 15, 5]} />
              <React.Suspense fallback={<ModelLoader />}>
                <Stage controls={ref} preset="rembrandt" intensity={1} environment="city">
                  <GameCartModel />
                </Stage>
                <OrbitControls ref={ref} autoRotate autoRotateSpeed={5} />
              </React.Suspense>
            </Canvas>
          </StyledGrid>
          <StyledGrid container item justify={'center'}>
            <ProjectCard selectedProject={selectedProject} />
          </StyledGrid>
        </StyledGrid>
      )}
    </>
  );
};

export default ProjectPanel;
