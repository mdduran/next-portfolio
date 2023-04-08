import type { Project } from 'types/types';
import * as React from 'react';
import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html, useProgress, Preload } from '@react-three/drei';
import theme from '@theme';
import dynamic from 'next/dynamic';
import type { Vector3 } from '@react-three/fiber';
import ProjectCard from './ProjectCard';

function ModelLoader(): React.ReactElement {
  const { progress } = useProgress();
  return <Html center>{progress} % loaded</Html>;
}

const GameCartModel = dynamic(() => import('./GameCartModel'), {
  loading: () => <ModelLoader />
});
const CDRomModel = dynamic(() => import('./CDRomModel'), {
  loading: () => <ModelLoader />
});

const StyledOuterBox = styled(Box)`
  background-color: ${theme.palette.primary.main};
  margin-top: 1rem;
`;
const mediaQueries = Object.values(theme.breakpoints.values).map((bp) => `@media (min-width: ${bp}px)`);
const StyledInnerBox = styled(Box)`
  background-color: ${theme.palette.secondary.main};
  border: 2px solid;
  ${mediaQueries[0]} {
    width: 300px;
    height: 300px;
    margin: 0 10%;
  }
  ${mediaQueries[1]} {
    width: 400px;
    height: 300px;
    margin: 0 25%;
  }
  ${mediaQueries[2]} {
    width: 800px;
    height: 600px;
    margin: 0 25%;
  }
`;

const StyledProjectCardBox = styled(Box)`
  background-color: ${theme.palette.primary.main};
`;
const StyledCanvas = styled(Canvas)`
  ${mediaQueries[0]} {
    width: 300px;
    height: 200px;
  }
  ${mediaQueries[1]} {
    width: 400px;
    height: 300px;
  }
  ${mediaQueries[2]} {
    width: 800px;
    height: 600px;
  }
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
      <StyledOuterBox>
        <StyledInnerBox sx={{ justifyContent: 'center' }}>
          {/* Using a provider to specify the project type as there is an issue with re-rendering state objects in the canvas.
                  https://docs.pmnd.rs/react-three-fiber/advanced/gotchas
              */}
          <StyledCanvas>
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
            {currentProjectType === 'game' ? (
              <React.Suspense fallback={null}>
                <GameCartModel selectedProject={selectedProject} position={modelPosition} />
              </React.Suspense>
            ) : (
              <React.Suspense fallback={null}>
                <CDRomModel position={modelPosition} />
              </React.Suspense>
            )}
            <Preload all />
          </StyledCanvas>
        </StyledInnerBox>
        <StyledProjectCardBox sx={{ justifyContent: 'center' }}>
          <ProjectCard selectedProject={selectedProject} />
        </StyledProjectCardBox>
      </StyledOuterBox>
    )
  );
};

export default ProjectPanel;
