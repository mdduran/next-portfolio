import * as React from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { Group, PointLight } from 'three';
import colors from 'styles/colors.json';
import ProjectArtifact, { type ArtifactProject } from './ProjectArtifact';

const ARTIFACT_SIZE = 2.4;
// Swap animation when the project changes: drop out, then rise back in
const SWAP_OUT_SECONDS = 0.25;
const SWAP_IN_SECONDS = 0.4;
const SWAP_DROP = 2.5;
const HOVER_SCALE = 0.08;
const HOVER_LIGHT = 6;
// Pointer travel (px) beyond which a press counts as a drag, not a click
const CLICK_TOLERANCE = 4;

type ShowcaseProps = {
  project: ArtifactProject;
  onHoverChange: (hovered: boolean) => void;
};

// The project page's artifact: swaps with an eject/insert animation when the
// project changes, glows on hover and flips over on click to show its back.
const ArtifactShowcase = ({ project, onHoverChange }: ShowcaseProps): React.ReactElement => {
  const [shown, setShown] = React.useState(project);
  const [hovered, setHovered] = React.useState(false);
  const groupRef = React.useRef<Group>(null);
  const lightRef = React.useRef<PointLight>(null);
  // Starts in the "in" phase so the artifact rises into view on load
  const anim = React.useRef({ phase: 'in' as 'idle' | 'out' | 'in', t: 0, shownSlug: project.slug, flip: 0, flipTarget: 0, hover: 0 });

  React.useEffect(() => () => void (document.body.style.cursor = ''), []);

  useFrame((_, delta) => {
    const a = anim.current;
    const group = groupRef.current;
    if (!group) return;

    if (project.slug !== a.shownSlug && a.phase !== 'out') {
      a.phase = 'out';
      a.t = 0;
    }
    if (a.phase === 'out') {
      a.t = Math.min(1, a.t + delta / SWAP_OUT_SECONDS);
      if (a.t === 1) {
        a.shownSlug = project.slug;
        setShown(project);
        a.phase = 'in';
        a.t = 0;
        a.flip = 0;
        a.flipTarget = 0;
      }
    } else if (a.phase === 'in') {
      a.t = Math.min(1, a.t + delta / SWAP_IN_SECONDS);
      if (a.t === 1) a.phase = 'idle';
    }

    // 0 = in place, 1 = fully ejected; ease in on the way out, ease out on the way in
    const ejected = a.phase === 'out' ? a.t * a.t : a.phase === 'in' ? (1 - a.t) ** 3 : 0;
    const ease = (rate: number) => 1 - Math.exp(-delta * rate);
    a.hover += ((hovered ? 1 : 0) - a.hover) * ease(10);
    a.flip += (a.flipTarget - a.flip) * ease(8);

    group.position.y = -ejected * SWAP_DROP;
    group.scale.setScalar((1 - ejected * 0.5) * (1 + a.hover * HOVER_SCALE));
    group.rotation.y = a.flip;
    if (lightRef.current) lightRef.current.intensity = a.hover * HOVER_LIGHT;
  });

  const setHover = (value: boolean) => (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setHovered(value);
    onHoverChange(value);
    document.body.style.cursor = value ? 'pointer' : '';
  };

  const flip = (event: ThreeEvent<MouseEvent>) => {
    if (event.delta > CLICK_TOLERANCE) return;
    anim.current.flipTarget += Math.PI;
  };

  return (
    <>
      <pointLight ref={lightRef} position={[0, 0.5, 3]} intensity={0} color={colors.caribbeanGreen} />
      <group ref={groupRef} onPointerOver={setHover(true)} onPointerOut={setHover(false)} onClick={flip}>
        <React.Suspense fallback={null}>
          <ProjectArtifact project={shown} size={ARTIFACT_SIZE} />
        </React.Suspense>
      </group>
    </>
  );
};

export default ArtifactShowcase;
