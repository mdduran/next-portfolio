import * as React from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Box3, Group, Vector3 } from 'three';
import type { Project } from '@type';
import colors from 'styles/colors.json';
import type { StationLayout } from './level';
import { createBillboardTexture, useCanvasTexture } from './textures';

const MODEL_PATHS: Record<Project['type'], string> = {
  game: '/gltf/gamecart/gamecart.gltf',
  software: '/gltf/lowpoly_cd/lowpolycd.gltf'
};
Object.values(MODEL_PATHS).forEach((path) => useGLTF.preload(path));

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

// The project's cartridge/CD, centered and scaled to MODEL_SIZE
function ArtifactModel({ type }: { type: Project['type'] }): React.ReactElement {
  const { scene } = useGLTF(MODEL_PATHS[type]);
  const object = React.useMemo(() => {
    const model = scene.clone(true);
    const box = new Box3().setFromObject(model);
    const size = box.getSize(new Vector3());
    model.position.sub(box.getCenter(new Vector3()));
    const wrapper = new Group();
    wrapper.add(model);
    wrapper.scale.setScalar(MODEL_SIZE / Math.max(size.x, size.y, size.z));
    return wrapper;
  }, [scene]);
  return <primitive object={object} />;
}

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
          <ArtifactModel type={project.type} />
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
