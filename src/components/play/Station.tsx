import * as React from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import colors from 'styles/colors.json';
import ProjectArtifact from '@components/ProjectArtifact';
import { useCanvasTexture } from '@components/three/canvasTexture';
import type { StationLayout } from './level';
import { createBillboardTexture } from './textures';

// Stations sit behind the play plane so the player walks in front of them
export const STATION_Z = -1.5;
const MODEL_SIZE = 1.3;

// Spin in radians/second. While the player stands in reach the spin speeds up
// the longer they stay, up to MAX_SPIN; it eases back down after they leave.
const IDLE_SPIN = 0.8;
const ACTIVE_SPIN = 2;
const SPIN_ACCEL = 3;
const MAX_SPIN = 14;
const ACTIVE_SCALE = 1.3;
const ACTIVE_LIFT = 0.3;

type StationProps = {
  station: StationLayout;
  active: boolean;
};

const Station = ({ station, active }: StationProps): React.ReactElement => {
  const { project, x, y } = station;
  const spinner = React.useRef<Group>(null);
  const motion = React.useRef({ timeInReach: 0, spin: IDLE_SPIN, scale: 1, lift: 0 });
  const billboard = useCanvasTexture(() => createBillboardTexture(project), project.slug);

  useFrame(({ clock }, delta) => {
    if (!spinner.current) return;
    const m = motion.current;
    m.timeInReach = active ? m.timeInReach + delta : 0;
    const targetSpin = active ? Math.min(MAX_SPIN, ACTIVE_SPIN + SPIN_ACCEL * m.timeInReach) : IDLE_SPIN;
    // Ease toward the targets so entering/leaving reach doesn't snap
    const ease = (rate: number) => 1 - Math.exp(-delta * rate);
    m.spin += (targetSpin - m.spin) * ease(4);
    m.scale += ((active ? ACTIVE_SCALE : 1) - m.scale) * ease(8);
    m.lift += ((active ? ACTIVE_LIFT : 0) - m.lift) * ease(8);

    spinner.current.rotation.y += delta * m.spin;
    spinner.current.scale.setScalar(m.scale);
    spinner.current.position.y = y + 1.6 + Math.sin(clock.elapsedTime * 2 + x) * 0.1 + m.lift;
  });

  return (
    <group>
      <mesh position={[x, y + 0.25, STATION_Z]}>
        <boxGeometry args={[1.6, 0.5, 1.6]} />
        <meshStandardMaterial color={active ? colors.caribbeanGreen : colors.outerSpaceCrayola} />
      </mesh>
      <group ref={spinner} position={[x, y + 1.6, STATION_Z]}>
        <React.Suspense fallback={null}>
          <ProjectArtifact project={project} size={MODEL_SIZE} />
        </React.Suspense>
      </group>
      <mesh position={[x, y + 4, STATION_Z - 1]}>
        <planeGeometry args={[3.2, 2.2]} />
        <meshBasicMaterial map={billboard} toneMapped={false} />
      </mesh>
    </group>
  );
};

export default Station;
