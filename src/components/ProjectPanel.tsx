import type { Project } from 'types/types';
import * as React from 'react';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import theme from '@theme';
import dynamic from 'next/dynamic';
import type { Vector3 } from '@react-three/fiber';
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
  const modelPosition: Vector3 = currentProjectType === 'game' ? [0, 0, 0] : [0, -5, 0];

  return (
    selectedProject && (
      <StyledGrid container style={{ marginTop: '0.5rem' }} spacing={0}>
        <StyledGrid container item justifyContent="center">
          {/* Using a provider to specify the project type as there is an issue with re-rendering state objects in the canvas.
                  https://docs.pmnd.rs/react-three-fiber/advanced/gotchas
              */}
          <Canvas style={{ width: '600px', height: '400px' }}>
            <OrbitControls
              ref={ref}
              autoRotate
              autoRotateSpeed={5}
              addEventListener={undefined}
              hasEventListener={undefined}
              removeEventListener={undefined}
              dispatchEvent={undefined}
              position={modelPosition}
            />
            <React.Suspense fallback={<ModelLoader />}>
              {currentProjectType === 'game' ? (
                <GameCartModel selectedProject={selectedProject} position={modelPosition} />
              ) : (
                <CDRomModel position={modelPosition} />
              )}
            </React.Suspense>
          </Canvas>
        </StyledGrid>
        <StyledGrid container item justifyContent="center">
          <ProjectCard selectedProject={selectedProject} />
        </StyledGrid>
      </StyledGrid>
    )
  );
};

export default ProjectPanel;
