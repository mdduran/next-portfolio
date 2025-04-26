import type { Project } from 'types/types';
import * as React from 'react';
import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html, useProgress, Preload } from '@react-three/drei';
import theme, { MediaQueries, MediaQueryIndex } from '@theme';
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
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
`;
const StyledInnerBox = styled(Box)`
  background-color: ${theme.palette.secondary.main};
  border: 2px solid;
  ${MediaQueries[MediaQueryIndex.xs]} {
    width: 240px;
    height: 200px;
    margin: 0 20px;
  }
  ${MediaQueries[MediaQueryIndex.sm]} {
    width: 400px;
    height: 300px;
    margin: 0 25%;
  }
  ${MediaQueries[MediaQueryIndex.md]} {
    width: 800px;
    height: 600px;
    margin: 0 25%;
  }
`;

const StyledProjectCardBox = styled(Box)`
  background-color: ${theme.palette.primary.main};
`;
const StyledCanvas = styled(Canvas)`
  ${MediaQueries[MediaQueryIndex.xs]} {
    width: 200px;
    height: 200px;
  }
  ${MediaQueries[MediaQueryIndex.sm]} {
    width: 400px;
    height: 300px;
  }
  ${MediaQueries[MediaQueryIndex.md]} {
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
  const hasVideo = !!selectedProject.trailer;

  return (
    selectedProject && (
      <StyledOuterBox>
        {hasVideo === false && (
          <StyledInnerBox sx={{ justifyContent: 'center' }}>
            <StyledCanvas>
              <OrbitControls
                ref={ref}
                autoRotate
                autoRotateSpeed={5}
                addEventListener={undefined}
                hasEventListener={undefined}
                removeEventListener={undefined}
                dispatchEvent={undefined}
                position0={modelPosition}
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
        )}
        <StyledProjectCardBox sx={{ justifyContent: 'center' }}>
          <ProjectCard selectedProject={selectedProject} />
        </StyledProjectCardBox>
      </StyledOuterBox>
    )
  );
};

export default ProjectPanel;
