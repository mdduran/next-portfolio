import * as React from 'react';
import { Html, useProgress } from '@react-three/drei';

export default function ModelLoader(): React.ReactElement {
  const { progress } = useProgress();
  return <Html center>{progress} % loaded</Html>;
}
