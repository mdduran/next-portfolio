import type { Project } from '@type';
import * as React from 'react';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import theme from '@theme';
import ProjectCard from './ProjectCard';
import GameCartModel from './GameCartModel';
import ModelLoader from './ModelLoader';

const StyledGrid = styled(Grid)`
  background-color: ${theme.palette.primary.main};
`;

const ProjectPanel = ({ selectedProject }: { selectedProject: Project }): React.ReactElement => {
  const ref = React.useRef(null);
  return (
    <>
      {selectedProject && (
        <StyledGrid container style={{ marginTop: '0.5rem' }} spacing={0}>
          <StyledGrid container item justifyContent="center">
            <Canvas shadows dpr={[1, 2]} camera={{ fov: 50 }} style={{ width: '400px', height: '300px' }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 15, 5]} />
              <React.Suspense fallback={<ModelLoader />}>
                <Stage controls={ref} preset="rembrandt" intensity={1} environment="city">
                  <GameCartModel />
                </Stage>
                <OrbitControls
                  ref={ref}
                  autoRotate
                  autoRotateSpeed={5}
                  addEventListener={undefined}
                  hasEventListener={undefined}
                  removeEventListener={undefined}
                  dispatchEvent={undefined}
                />
              </React.Suspense>
            </Canvas>
          </StyledGrid>
          <StyledGrid container item justifyContent="center">
            <ProjectCard selectedProject={selectedProject} />
          </StyledGrid>
        </StyledGrid>
      )}
    </>
  );
};

export default ProjectPanel;
