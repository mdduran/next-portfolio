import * as React from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { Group, PointLight } from 'three';
import colors from 'styles/colors.json';
import type { Project } from '@type';
import ProjectArtifact from './ProjectArtifact';

const ARTIFACT_SIZE = 1.9;
const RING_RADIUS = 3.4;
// Side items shrink so the front one reads as selected
const SIDE_SCALE = 0.75;
const HOVER_SCALE = 0.08;
const HOVER_LIGHT = 5;
// The front item sways back and forth to show off its label
const SWAY_ANGLE = 0.35;
const SWAY_SPEED = 0.8;
const RISE_DROP = 2;

type RingProps = {
  projects: Project[];
  // Unbounded step count; the front item is position mod projects.length.
  // Counting steps instead of wrapping lets the ring always turn the short way.
  position: number;
  reducedMotion: boolean;
  onSelect: (index: number) => void;
  onOpen: (project: Project) => void;
  onHoverChange: (hovered: boolean) => void;
};

const mod = (n: number, m: number) => ((n % m) + m) % m;

// The home page carousel: featured projects' artifacts on a turning ring, with
// the front one facing the camera. Clicking a side item brings it to the front;
// clicking the front one opens the project.
const FeaturedRing = ({ projects, position, reducedMotion, onSelect, onOpen, onHoverChange }: RingProps): React.ReactElement => {
  const step = (Math.PI * 2) / projects.length;
  const active = mod(position, projects.length);
  const [hovered, setHovered] = React.useState<number | null>(null);
  const ringRef = React.useRef<Group>(null);
  const itemRefs = React.useRef<(Group | null)[]>([]);
  const lightRef = React.useRef<PointLight>(null);
  // Starts below and rises into view on load
  const anim = React.useRef({ angle: -position * step, rise: reducedMotion ? 1 : 0, hover: 0, time: 0 });

  React.useEffect(() => () => void (document.body.style.cursor = ''), []);

  useFrame((_, delta) => {
    const a = anim.current;
    const ring = ringRef.current;
    if (!ring) return;
    const ease = (rate: number) => (reducedMotion ? 1 : 1 - Math.exp(-delta * rate));

    a.time += delta;
    a.angle += (-position * step - a.angle) * ease(5);
    a.rise += (1 - a.rise) * ease(4);
    a.hover += ((hovered === active ? 1 : 0) - a.hover) * ease(10);

    ring.rotation.y = a.angle;
    ring.position.y = -(1 - a.rise) * RISE_DROP;
    itemRefs.current.forEach((item, i) => {
      if (!item) return;
      const isActive = i === active;
      const target = isActive ? 1 + a.hover * HOVER_SCALE : SIDE_SCALE;
      item.scale.setScalar(item.scale.x + (target - item.scale.x) * ease(8));
      const sway = isActive && !reducedMotion && hovered !== i ? Math.sin(a.time * SWAY_SPEED) * SWAY_ANGLE : 0;
      item.rotation.y += (i * step + sway - item.rotation.y) * ease(4);
    });
    if (lightRef.current) lightRef.current.intensity = a.hover * HOVER_LIGHT;
  });

  const setHover = (index: number | null) => (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setHovered(index);
    onHoverChange(index !== null);
    document.body.style.cursor = index !== null ? 'pointer' : '';
  };

  const click = (index: number) => (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (index === active) onOpen(projects[index]);
    else onSelect(index);
  };

  return (
    <>
      <pointLight ref={lightRef} position={[0, 0.5, 2.5]} intensity={0} color={colors.caribbeanGreen} />
      {/* Ring centered behind the front item, so the front item sits at the origin */}
      <group position={[0, 0, -RING_RADIUS]}>
        <group ref={ringRef}>
          {projects.map((project, i) => (
            <group
              key={project.slug}
              ref={(item) => void (itemRefs.current[i] = item)}
              position={[Math.sin(i * step) * RING_RADIUS, 0, Math.cos(i * step) * RING_RADIUS]}
              rotation={[0, i * step, 0]}
              scale={i === active ? 1 : SIDE_SCALE}
              onPointerOver={setHover(i)}
              onPointerOut={setHover(null)}
              onClick={click(i)}
            >
              <React.Suspense fallback={null}>
                <ProjectArtifact project={project} size={ARTIFACT_SIZE} />
              </React.Suspense>
            </group>
          ))}
        </group>
      </group>
    </>
  );
};

export default FeaturedRing;
