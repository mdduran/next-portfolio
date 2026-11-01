import * as React from 'react';
import { useProgress } from '@react-three/drei';
import styles from './ModelLoader.module.scss';

// Load progress for 3D models, laid over the Canvas from a positioned parent.
// Rendered as a DOM overlay outside the Canvas. drei's <Html> inside the Canvas
// mounts a separate React root that crashes (removeChild) when the Canvas unmounts.
const ModelLoader = (): React.ReactElement | null => {
  const { active, progress } = useProgress();
  if (!active) return null;
  return <div className={styles.loader}>{Math.round(progress)}% loaded</div>;
};

export default ModelLoader;
