import type { Project } from '@type';
import * as React from 'react';
import { Box, Button, ButtonGroup, Slider, Stack } from '@mui/material';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useProgress, Preload } from '@react-three/drei';
import dynamic from 'next/dynamic';
import type { Vector3 } from '@react-three/fiber';
import ProjectCard from './ProjectCard';
import styles from './ProjectPanel.module.scss';

// Rendered as a DOM overlay outside the Canvas. drei's <Html> inside the Canvas
// mounts a separate React root that crashes (removeChild) when the Canvas unmounts.
function ModelLoader(): React.ReactElement | null {
  const { active, progress } = useProgress();
  if (!active) return null;
  return <div className={styles.loader}>{Math.round(progress)}% loaded</div>;
}

const GameCartModel = dynamic(() => import('./GameCartModel'), {
  loading: () => null
});
const CDRomModel = dynamic(() => import('./CDRomModel'), {
  loading: () => null
});

let webglSupportedCache: boolean | undefined;
const getWebglSupported = (): boolean => {
  if (webglSupportedCache === undefined) {
    try {
      const canvas = document.createElement('canvas');
      webglSupportedCache = !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch (e) {
      webglSupportedCache = false;
    }
  }
  return webglSupportedCache;
};
const subscribeNoop = (): (() => void) => () => {};

type ProjectPanelProps = {
  project: Project;
  // Rendered long-form description, passed through to ProjectCard
  children?: React.ReactNode;
};

const ProjectPanel = ({ project, children }: ProjectPanelProps): React.ReactElement => {
  const controlsRef = React.useRef<any>(null);
  const [autoRotate, setAutoRotate] = React.useState(true);
  const [autoRotateSpeed, setAutoRotateSpeed] = React.useState(5);
  const currentProjectType = project.type;
  const modelPosition: Vector3 = currentProjectType === 'game' ? [0, 0, 0] : [0, -5, 0];

  // Detect WebGL support on client (null during SSR)
  const webglSupported = React.useSyncExternalStore(subscribeNoop, getWebglSupported, () => null);

  const fallbackSrc = React.useMemo(() => {
    if (currentProjectType === 'game') {
      return '/webp/game-placeholder.webp';
    }
    return '/webp/software-placeholder.webp';
  }, [currentProjectType]);

  return (
    <Box className={styles.outerBox}>
      <Box className={styles.contentLayout}>
        <Box className={styles.visualsColumn}>
          {webglSupported === false ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
              <img
                src={fallbackSrc}
                alt={currentProjectType === 'game' ? 'Game cartridge preview' : 'CD-ROM preview'}
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </Box>
          ) : (
            <>
              <Box className={styles.innerBox}>
                <div className={styles.modelWrapper}>
                  <Canvas className={styles.canvas}>
                    <OrbitControls
                      ref={controlsRef}
                      autoRotate={autoRotate}
                      autoRotateSpeed={autoRotateSpeed}
                      addEventListener={undefined}
                      hasEventListener={undefined}
                      removeEventListener={undefined}
                      dispatchEvent={undefined}
                      position0={modelPosition}
                    />
                    {currentProjectType === 'game' ? (
                      <React.Suspense fallback={null}>
                        <GameCartModel project={project} position={modelPosition} />
                      </React.Suspense>
                    ) : (
                      <React.Suspense fallback={null}>
                        <CDRomModel position={modelPosition} />
                      </React.Suspense>
                    )}
                    <Preload all />
                  </Canvas>
                  <ModelLoader />
                </div>
              </Box>
              <Box className={styles.modelControls}>
                <Stack spacing={1} alignItems="center">
                  <ButtonGroup size="small" variant="contained">
                    <Button onClick={() => setAutoRotate(true)} disabled={autoRotate}>
                      Start
                    </Button>
                    <Button onClick={() => setAutoRotate(false)} disabled={!autoRotate}>
                      Stop
                    </Button>
                  </ButtonGroup>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box sx={{ color: '#fff', fontSize: 12, minWidth: 36 }}>Speed</Box>
                  <Slider
                    size="medium"
                    min={0}
                    max={10}
                    step={0.5}
                    value={autoRotateSpeed}
                    onChange={(_, v) => setAutoRotateSpeed(v as number)}
                    sx={{ width: '90%', color: '#fff' }}
                  />
                </Stack>
              </Box>
            </>
          )}
        </Box>

        <Box className={styles.projectCardBox} sx={{ justifyContent: 'center' }}>
          <ProjectCard project={project}>{children}</ProjectCard>
        </Box>
      </Box>
    </Box>
  );
};

export default ProjectPanel;
