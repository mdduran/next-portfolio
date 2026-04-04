import type { Project } from 'types/types';
import * as React from 'react';
import { Box, IconButton, Slider, Stack, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SpeedIcon from '@mui/icons-material/Speed';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html, useProgress, Preload } from '@react-three/drei';
import dynamic from 'next/dynamic';
import type { Vector3 } from '@react-three/fiber';
import ProjectCard from './ProjectCard';
import styles from './ProjectPanel.module.scss';
import clsx from 'clsx';

function ModelLoader(): React.ReactElement {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    // Synchronize initial state
    setProgress(Math.round((useProgress as any).getState().progress));

    // Subscribe to progress changes and update state asynchronously
    // to avoid the "Cannot update a component while rendering a different component" warning in React 19.
    return (useProgress as any).subscribe((state: any) => {
      // Defer the update to ensure it doesn't happen during another component's render
      Promise.resolve().then(() => {
        setProgress(Math.round(state.progress));
      });
    });

  }, []);

  return <Html center>{progress} % loaded</Html>;
}

const GameCartModel = dynamic(() => import('./GameCartModel'), {
  ssr: false,
});
const CDRomModel = dynamic(() => import('./CDRomModel'), {
  ssr: false,
});

const ProjectPanel = ({ selectedProject }: { selectedProject: Project }): React.ReactElement => {
  const controlsRef = React.useRef<any>(null);
  const [autoRotate, setAutoRotate] = React.useState(true);
  const [autoRotateSpeed, setAutoRotateSpeed] = React.useState(5);
  const [currentProjectType, setCurrentProjectType] = React.useState(selectedProject.projectType);
  React.useEffect(() => {
    setCurrentProjectType(selectedProject.projectType);
  }, [selectedProject]);
  const modelPosition: Vector3 = currentProjectType === 'game' ? [0, 0, 0] : [0, -5, 0];

  // Detect WebGL support on client
  const [webglSupported, setWebglSupported] = React.useState<boolean | null>(null);
  React.useEffect(() => {
    const isSupported = (): boolean => {
      try {
        const canvas = document.createElement('canvas');
        return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
      } catch (e) {
        return false;
      }
    };
    setWebglSupported(isSupported());
  }, []);

  const fallbackSrc = React.useMemo(() => {
    if (currentProjectType === 'game') {
      return '/webp/game-placeholder.webp';
    }
    return '/webp/software-placeholder.webp';
  }, [currentProjectType]);

  const handleZoomIn = () => {
    if (controlsRef.current) {
      controlsRef.current.dollyIn(1.1);
      controlsRef.current.update();
    }
  };

  const handleZoomOut = () => {
    if (controlsRef.current) {
      controlsRef.current.dollyOut(1.1);
      controlsRef.current.update();
    }
  };

  return (
    selectedProject && (
      <Box className={styles.outerBox}>
        <Box className={styles.contentLayout}>
          <Box className={styles.visualsColumn}>
            {webglSupported === false ? (
                <Box className={clsx(styles.innerBox, styles.fallbackContainer)} data-augmented-ui="tl-2-clip-x tr-2-clip-x br-2-clip-x bl-2-clip-x both">
                  <img
                    src={fallbackSrc}
                    alt={currentProjectType === 'game' ? 'Game cartridge preview' : 'CD-ROM preview'}
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                </Box>
              ):(
                <>
                  <Box className={styles.innerBox} data-augmented-ui="tl-2-clip-x tr-2-clip-x br-2-clip-x bl-2-clip-x both">
                    <div className={styles.modelWrapper}>
                      <Canvas className={styles.canvas} shadows="basic" camera={{ position: [0, 0, 7.5], fov: 45 }}>
                        <OrbitControls
                          ref={controlsRef}
                          autoRotate={autoRotate}
                          autoRotateSpeed={autoRotateSpeed}
                          enableDamping
                          dampingFactor={0.05}
                          makeDefault
                          enablePan={false}
                          enableZoom
                          position0={modelPosition}
                        />
                        {currentProjectType === 'game' ? (
                          <React.Suspense fallback={<ModelLoader />}>
                            <GameCartModel selectedProject={selectedProject} position={modelPosition} />
                          </React.Suspense>
                        ) : (
                          <React.Suspense fallback={<ModelLoader />}>
                            <CDRomModel position={modelPosition} />
                          </React.Suspense>
                        )}
                        <Preload all />
                      </Canvas>
                    </div>
                  </Box>
                  <Box className={styles.modelControls} data-augmented-ui="tl-clip tr-clip br-clip bl-clip border both">
                    <Stack className={styles.controlsStack}>
                        <Stack direction="row" alignItems="center" className={styles.mainControlsStack}>
                          <Stack direction="row" spacing={0.5}>
                            <IconButton
                              onClick={() => setAutoRotate(!autoRotate)}
                              size="small"
                              aria-label={autoRotate ? 'Stop rotation' : 'Start rotation'}
                              className={clsx(styles.controlButton, autoRotate && styles.active)}
                            >
                              {autoRotate ? <PauseIcon /> : <PlayArrowIcon />}
                            </IconButton>

                            <IconButton
                              onClick={handleZoomIn}
                              size="small"
                              aria-label="Zoom in"
                              className={styles.controlButton}
                            >
                              <ZoomInIcon />
                            </IconButton>

                            <IconButton
                              onClick={handleZoomOut}
                              size="small"
                              aria-label="Zoom out"
                              className={styles.controlButton}
                            >
                              <ZoomOutIcon />
                            </IconButton>
                          </Stack>

                          <Stack direction="row" alignItems="center" className={styles.sliderStack}>
                            <SpeedIcon aria-hidden="true" />
                            <Slider
                              size="small"
                              min={0}
                              max={10}
                              step={0.5}
                              value={autoRotateSpeed}
                              onChange={(_, v) => setAutoRotateSpeed(v as number)}
                              className={styles.slider}
                              aria-label="Auto rotate speed"
                            />
                          </Stack>
                        </Stack>
                      </Stack>
                    </Box>
                  </>
              )}
          </Box>

          <Box className={styles.projectCardBox}>
            <ProjectCard selectedProject={selectedProject} />
          </Box>
        </Box>
      </Box>
    )
  );
};

export default ProjectPanel;
