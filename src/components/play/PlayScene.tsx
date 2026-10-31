import * as React from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Group, Vector3 } from 'three';
import type { Project } from '@type';
import colors from 'styles/colors.json';
import type { Box, Level, SignLayout, StationLayout } from './level';
import { createPlayer, PLAYER_HEIGHT, stepPlayer, type PlayerInput } from './physics';
import { createSignTexture, useCanvasTexture } from './textures';
import Station from './Station';

const CAMERA_DISTANCE = 13;
const CAMERA_HEIGHT = 3;
// How close (in x) the player must be to a station to interact with it
const STATION_REACH = 1.8;

export type PlaySceneProps = {
  level: Level;
  inputRef: React.RefObject<PlayerInput>;
  // Station to spawn next to (e.g. when returning from a project page)
  spawnSlug: string | null;
  // Station being opened; the camera zooms in on it
  openingSlug: string | null;
  onNearChange: (project: Project | null) => void;
  onReady?: () => void;
};

function spawnPoint(level: Level, slug: string | null): { x: number; y: number } {
  const station = level.stations.find((s) => s.project.slug === slug);
  // Just left of the station, within reach, standing on its pedestal if raised
  return station ? { x: station.x - 1, y: station.y } : { x: level.spawnX, y: 0 };
}

function Platform({ box }: { box: Box }): React.ReactElement {
  // The floor and pedestals extend back under the stations; floating platforms are thin
  const depth = box.oneWay ? 1.5 : 4;
  const z = box.oneWay ? 0 : -1;
  return (
    <group position={[box.x + box.w / 2, 0, z]}>
      <mesh position={[0, box.y + box.h / 2, 0]}>
        <boxGeometry args={[box.w, box.h, depth]} />
        <meshStandardMaterial color={box.oneWay ? colors.feldgrau : colors.outerSpaceCrayola} />
      </mesh>
      <mesh position={[0, box.y + box.h - 0.05, 0]}>
        <boxGeometry args={[box.w + 0.02, 0.1, depth + 0.02]} />
        <meshStandardMaterial color={colors.caribbeanGreen} />
      </mesh>
    </group>
  );
}

function Sign({ sign }: { sign: SignLayout }): React.ReactElement {
  const texture = useCanvasTexture(() => createSignTexture(sign.text), sign.text);
  return (
    <group position={[sign.x, sign.y, -0.8]}>
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[0.15, 1.6, 0.15]} />
        <meshStandardMaterial color={colors.blackCoffee} />
      </mesh>
      <mesh position={[0, 1.9, 0]}>
        <planeGeometry args={[2.4, 0.6]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
    </group>
  );
}

// Distant hills for depth
function Backdrop({ level }: { level: Level }): React.ReactElement {
  const hills = React.useMemo(() => {
    const result: { x: number; h: number }[] = [];
    for (let x = level.minX - 20; x < level.maxX + 20; x += 5) {
      result.push({ x, h: 4 + Math.abs(Math.sin(x * 0.37) * 5) + Math.abs(Math.sin(x * 0.11) * 3) });
    }
    return result;
  }, [level]);
  return (
    <group position={[0, 0, -14]}>
      {hills.map(({ x, h }) => (
        <mesh key={x} position={[x, h / 2 - 1, 0]}>
          <boxGeometry args={[5.2, h, 1]} />
          <meshStandardMaterial color={colors.phthaloGreen} />
        </mesh>
      ))}
    </group>
  );
}

function PlayerAvatar({ avatarRef }: { avatarRef: React.RefObject<Group | null> }): React.ReactElement {
  return (
    <group ref={avatarRef}>
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[0.8, 0.9, 0.6]} />
        <meshStandardMaterial color={colors.popstar} />
      </mesh>
      <mesh position={[0, 1.0, 0]}>
        <boxGeometry args={[0.6, 0.4, 0.5]} />
        <meshStandardMaterial color={colors.queenPink} />
      </mesh>
      {/* Eye on the facing side */}
      <mesh position={[0.18, 1.05, 0.26]}>
        <boxGeometry args={[0.1, 0.1, 0.02]} />
        <meshBasicMaterial color={colors.black} />
      </mesh>
    </group>
  );
}

function World({ level, inputRef, spawnSlug, openingSlug, onNearChange }: PlaySceneProps): React.ReactElement {
  const spawn = spawnPoint(level, spawnSlug);
  const player = React.useRef(createPlayer(spawn.x, spawn.y));
  const avatarRef = React.useRef<Group>(null);
  const lookAt = React.useRef(new Vector3(spawn.x, CAMERA_HEIGHT - 1.5, 0));
  const nearSlug = React.useRef<string | null>(null);
  const [activeSlug, setActiveSlug] = React.useState<string | null>(null);

  useFrame(({ camera, clock }, rawDelta) => {
    // Clamp so a background tab doesn't teleport the player on return
    const dt = Math.min(rawDelta, 1 / 30);
    const state = stepPlayer(player.current, inputRef.current, dt, level);

    if (avatarRef.current) {
      avatarRef.current.position.set(state.x, state.y, 0);
      avatarRef.current.scale.x = state.facing;
      const running = state.grounded && Math.abs(state.vx) > 0.5;
      const stretch = state.grounded ? 1 : state.vy > 0 ? 1.1 : 0.95;
      avatarRef.current.scale.y = stretch + (running ? Math.sin(clock.elapsedTime * 20) * 0.05 : 0);
    }

    // Nearest station within reach, reported only when it changes
    const near: StationLayout | undefined = level.stations.find(
      (s) => Math.abs(state.x - s.x) < STATION_REACH && state.y >= s.y - 0.5 && state.y < s.y + PLAYER_HEIGHT * 2
    );
    const slug = near?.project.slug ?? null;
    if (slug !== nearSlug.current) {
      nearSlug.current = slug;
      setActiveSlug(slug);
      onNearChange(near?.project ?? null);
    }

    // Follow the player, or zoom in on the station being opened
    const opening = level.stations.find((s) => s.project.slug === openingSlug);
    const target = opening
      ? new Vector3(opening.x, opening.y + 2, 5)
      : new Vector3(state.x, Math.max(state.y, 0) * 0.6 + CAMERA_HEIGHT, CAMERA_DISTANCE);
    const focus = opening ? new Vector3(opening.x, opening.y + 1.6, -1.5) : new Vector3(target.x, target.y - 1.5, 0);
    const t = 1 - Math.exp(-dt * (opening ? 6 : 4));
    camera.position.lerp(target, t);
    lookAt.current.lerp(focus, t);
    camera.lookAt(lookAt.current);
  });

  return (
    <>
      <Backdrop level={level} />
      {level.platforms.map((box) => (
        <Platform key={`${box.x}:${box.y}`} box={box} />
      ))}
      {level.signs.map((sign) => (
        <Sign key={sign.text} sign={sign} />
      ))}
      {level.stations.map((station) => (
        <Station key={station.project.slug} station={station} active={station.project.slug === activeSlug} />
      ))}
      <PlayerAvatar avatarRef={avatarRef} />
    </>
  );
}

const PlayScene = (props: PlaySceneProps): React.ReactElement => {
  const spawn = spawnPoint(props.level, props.spawnSlug);
  return (
    <Canvas dpr={[1, 2]} camera={{ fov: 50, position: [spawn.x, CAMERA_HEIGHT, CAMERA_DISTANCE] }} onCreated={() => props.onReady?.()}>
      <color attach="background" args={[colors.castletonGreen]} />
      <fog attach="fog" args={[colors.castletonGreen, 18, 40]} />
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 10, 8]} intensity={1.6} />
      <World {...props} />
    </Canvas>
  );
};

export default PlayScene;
