import type { Project } from '@type';
import * as React from 'react';
import { Box } from '@mui/material';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, OrbitControls, useProgress } from '@react-three/drei';
import dynamic from 'next/dynamic';
import { useWebglSupported } from '@lib/webgl';
import ProjectCard from './ProjectCard';
import styles from './ProjectPanel.module.scss';

// Rendered as a DOM overlay outside the Canvas. drei's <Html> inside the Canvas
// mounts a separate React root that crashes (removeChild) when the Canvas unmounts.
function ModelLoader(): React.ReactElement | null {
  const { active, progress } = useProgress();
  if (!active) return null;
  return <div className={styles.loader}>{Math.round(progress)}% loaded</div>;
}

// How to interact with the model; pointer-specific lines are switched in CSS
function ModelInstructions({ type }: { type: Project['type'] }): React.ReactElement {
  const model = type === 'game' ? 'cartridge' : 'CD';
  const otherSide = type === 'game' ? 'read the label on the back' : 'see its other side';
  return (
    <ul className={styles.modelHint} aria-label="Model controls">
      <li>
        <strong>Drag</strong> to spin the {model} around and look at it from any angle.
      </li>
      <li className={styles.finePointer}>
        <strong>Click</strong> the {model} to flip it over and {otherSide}.
      </li>
      <li className={styles.coarsePointer}>
        <strong>Tap</strong> the {model} to flip it over and {otherSide}.
      </li>
      <li className={styles.finePointer}>
        <strong>Hover</strong> over it to pause the automatic rotation.
      </li>
    </ul>
  );
}

const ArtifactShowcase = dynamic(() => import('./ArtifactShowcase'), {
  loading: () => null
});

type ProjectPanelProps = {
  project: Project;
  // Rendered long-form description, passed through to ProjectCard
  children?: React.ReactNode;
};

const ProjectPanel = ({ project, children }: ProjectPanelProps): React.ReactElement => {
  // Auto-rotation pauses while the pointer is over the model
  const [hovered, setHovered] = React.useState(false);

  // Detect WebGL support on client (null during SSR)
  const webglSupported = useWebglSupported();
  const fallbackSrc = project.type === 'game' ? '/webp/game-placeholder.webp' : '/webp/software-placeholder.webp';

  return (
    <Box className={styles.outerBox}>
      <Box className={styles.contentLayout}>
        <Box className={styles.visualsColumn}>
          {webglSupported === false ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
              <img
                src={fallbackSrc}
                alt={project.type === 'game' ? 'Game cartridge preview' : 'CD-ROM preview'}
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </Box>
          ) : (
            <>
              <Box className={styles.innerBox}>
                <div className={styles.modelWrapper}>
                  <Canvas className={styles.canvas} camera={{ position: [0, 0.4, 4.2], fov: 45 }}>
                    <ambientLight intensity={0.7} />
                    <directionalLight position={[3, 5, 4]} intensity={1.6} />
                    <directionalLight position={[-3, 2, -4]} intensity={0.6} />
                    <ArtifactShowcase project={project} onHoverChange={setHovered} />
                    <ContactShadows position={[0, -1.4, 0]} opacity={0.45} blur={2.5} scale={6} />
                    {/* Zoom and pan off so scrolling the page over the model still scrolls */}
                    <OrbitControls autoRotate={!hovered} autoRotateSpeed={3} enableZoom={false} enablePan={false} />
                  </Canvas>
                  <ModelLoader />
                </div>
              </Box>
              <ModelInstructions type={project.type} />
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
