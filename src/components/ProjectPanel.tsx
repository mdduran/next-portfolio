import type { Project } from 'types/types';
import * as React from 'react';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';
import theme from '@theme';
import dynamic from 'next/dynamic';
import ProjectCard from './ProjectCard';
import ModelLoader from './ModelLoader';

const GameCartModel = dynamic(() => import('./GameCartModel'), {
  ssr: false
});
const CDRomModel = dynamic(() => import('./CDRomModel'), {
  ssr: false
});

const StyledGrid = styled(Grid)`
  background-color: ${theme.palette.primary.main};
`;

const ProjectPanel = ({ selectedProject }: { selectedProject: Project }): React.ReactElement => {
  const ref = React.useRef(null);
  const [currentProjectType, setCurrentProjectType] = React.useState(selectedProject.projectType);

  React.useEffect(() => {
    setCurrentProjectType(selectedProject.projectType);
  }, [selectedProject]);

  return (
    <>
      {selectedProject && (
        <StyledGrid container style={{ marginTop: '0.5rem' }} spacing={0}>
          <StyledGrid container item justifyContent="center">
            <Canvas
              shadows
              mode="concurrent"
              dpr={[1, 2]}
              camera={{ fov: 50, position: [0, 0, 0] }}
              style={{ width: '400px', height: '300px' }}
            >
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 15, 5]} />
              <React.Suspense fallback={<ModelLoader />}>
                <Stage controls={ref} preset="rembrandt" intensity={1} environment="city">
                  {currentProjectType === 'game' ? <GameCartModel selectedProject={selectedProject} /> : <CDRomModel />}
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
