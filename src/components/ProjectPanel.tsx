import type { Project } from 'types/types';
import * as React from 'react';
import Box from '@mui/material/Box';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html, useProgress, Preload } from '@react-three/drei';
import dynamic from 'next/dynamic';
import type { Vector3 } from '@react-three/fiber';
import ProjectCard from './ProjectCard';
import styles from './ProjectPanel.module.scss';

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
      <Box className={styles.outerBox}>
        {hasVideo === false && (
          <Box className={styles.innerBox} sx={{ justifyContent: 'center' }}>
            <Canvas className={styles.canvas}>
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
            </Canvas>
          </Box>
        )}
        <Box className={styles.projectCardBox} sx={{ justifyContent: 'center' }}>
          <ProjectCard selectedProject={selectedProject} />
        </Box>
      </Box>
    )
  );
};

export default ProjectPanel;
