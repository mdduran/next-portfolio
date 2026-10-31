import * as React from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Group, Mesh, MeshBasicMaterial, Vector3 } from 'three';
import type { Project } from '@type';
import colors from 'styles/colors.json';
import type { Box, Level, SignLayout, StationLayout } from './level';
import { createPlayer, flightDuration, flightPosition, PLAYER_HEIGHT, stepPlayer, type Flight, type PlayerInput } from './physics';
import { createSignTexture, useCanvasTexture } from './textures';
import Station from './Station';

const CAMERA_DISTANCE = 13;
const CAMERA_HEIGHT = 3;
// How close (in x) the player must be to a station to interact with it
const STATION_REACH = 1.8;
const GRASS_HEIGHT = 0.1;
const TRAIL_LENGTH = 12;
const LANDING_SQUASH_TIME = 0.25;
const GAUGE_WIDTH = 0.9;
const LOW_FUEL = 0.25;

// A fast travel request; id distinguishes repeated trips to the same place
export type TravelRequest = { toX: number; id: number };

export type PlaySceneProps = {
  level: Level;
  inputRef: React.RefObject<PlayerInput>;
  // Station to spawn next to (e.g. when returning from a project page)
  spawnSlug: string | null;
  // Station being opened; the camera zooms in on it
  openingSlug: string | null;
  onNearChange: (project: Project | null) => void;
  travel: TravelRequest | null;
  // Skip the flight animation (prefers-reduced-motion)
  instantTravel: boolean;
  onTravelEnd: () => void;
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
  // The grass strip sits on top of the body rather than overlapping it; coplanar
  // faces z-fight and flicker as the camera moves
  const bodyHeight = box.h - GRASS_HEIGHT;
  return (
    <group position={[box.x + box.w / 2, 0, z]}>
      <mesh position={[0, box.y + bodyHeight / 2, 0]}>
        <boxGeometry args={[box.w, bodyHeight, depth]} />
        <meshStandardMaterial color={box.oneWay ? colors.feldgrau : colors.outerSpaceCrayola} />
      </mesh>
      <mesh position={[0, box.y + bodyHeight + GRASS_HEIGHT / 2, 0]}>
        <boxGeometry args={[box.w + 0.02, GRASS_HEIGHT, depth + 0.02]} />
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
      {hills.map(({ x, h }, i) => (
        // Neighbors overlap slightly; stagger depth so their faces don't z-fight
        <mesh key={x} position={[x, h / 2 - 1, (i % 2) * 0.3]}>
          <boxGeometry args={[5.2, h, 1]} />
          <meshStandardMaterial color={colors.phthaloGreen} />
        </mesh>
      ))}
    </group>
  );
}

type PlayerAvatarProps = {
  avatarRef: React.RefObject<Group | null>;
  flameRef: React.RefObject<Mesh | null>;
};

function PlayerAvatar({ avatarRef, flameRef }: PlayerAvatarProps): React.ReactElement {
  return (
    <group ref={avatarRef}>
      {/* Jetpack on the back, with a flame shown while flying */}
      <mesh position={[-0.5, 0.55, 0]}>
        <boxGeometry args={[0.25, 0.6, 0.4]} />
        <meshStandardMaterial color={colors.cadetBlue} />
      </mesh>
      <mesh ref={flameRef} position={[-0.5, 0.05, 0]} visible={false}>
        <boxGeometry args={[0.18, 0.4, 0.18]} />
        <meshBasicMaterial color={colors.tuscany} />
      </mesh>
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

function World({
  level,
  inputRef,
  spawnSlug,
  openingSlug,
  onNearChange,
  travel,
  instantTravel,
  onTravelEnd
}: PlaySceneProps): React.ReactElement {
  const spawn = spawnPoint(level, spawnSlug);
  const player = React.useRef(createPlayer(spawn.x, spawn.y));
  const avatarRef = React.useRef<Group>(null);
  const flameRef = React.useRef<Mesh>(null);
  const trailRef = React.useRef<Group>(null);
  const flight = React.useRef<(Flight & { id: number }) | null>(null);
  const lastTravelId = React.useRef<number | null>(null);
  const trail = React.useRef<Vector3[]>([]);
  const landingSquash = React.useRef(0);
  const gaugeRef = React.useRef<Group>(null);
  const gaugeFillRef = React.useRef<Mesh<any, MeshBasicMaterial>>(null);
  const lookAt = React.useRef(new Vector3(spawn.x, CAMERA_HEIGHT - 1.5, 0));
  const nearSlug = React.useRef<string | null>(null);
  const [activeSlug, setActiveSlug] = React.useState<string | null>(null);

  useFrame(({ camera, clock }, rawDelta) => {
    // Clamp so a background tab doesn't teleport the player on return
    const dt = Math.min(rawDelta, 1 / 30);
    const state = player.current;

    // Start a new fast travel flight
    if (travel && travel.id !== lastTravelId.current) {
      lastTravelId.current = travel.id;
      flight.current = {
        id: travel.id,
        fromX: state.x,
        fromY: state.y,
        toX: travel.toX,
        elapsed: 0,
        duration: flightDuration(state.x, travel.toX, instantTravel)
      };
    }

    const flying = flight.current;
    if (flying) {
      // Scripted flight replaces physics until landing
      flying.elapsed += dt;
      const progress = flying.duration > 0 ? Math.min(1, flying.elapsed / flying.duration) : 1;
      const { x, y } = flightPosition(flying, progress);
      if (x !== state.x) state.facing = x > state.x ? 1 : -1;
      state.x = x;
      state.y = y;
      state.vx = 0;
      state.vy = 0;
      if (progress >= 1) {
        flight.current = null;
        state.grounded = true;
        landingSquash.current = flying.duration > 0 ? LANDING_SQUASH_TIME : 0;
        onTravelEnd();
      }
    } else {
      stepPlayer(state, inputRef.current, dt, level);
    }
    landingSquash.current = Math.max(0, landingSquash.current - dt);

    if (avatarRef.current) {
      avatarRef.current.position.set(state.x, state.y, 0);
      avatarRef.current.scale.x = state.facing;
      // Lean forward while flying
      avatarRef.current.rotation.z = flying ? -state.facing * 0.3 : 0;
      const running = state.grounded && Math.abs(state.vx) > 0.5;
      const stretch = flying ? 1.1 : state.grounded || state.hovering ? 1 : state.vy > 0 ? 1.1 : 0.95;
      const squash = (landingSquash.current / LANDING_SQUASH_TIME) * 0.3;
      avatarRef.current.scale.y = stretch - squash + (running ? Math.sin(clock.elapsedTime * 20) * 0.05 : 0);
    }
    if (flameRef.current) {
      // Full flame for fast travel, a smaller one while hovering
      flameRef.current.visible = !!flying || state.hovering;
      flameRef.current.scale.y = (flying ? 1 : 0.6) + Math.sin(clock.elapsedTime * 40) * 0.3;
    }

    // Jetpack fuel gauge above the player, shown while not full
    if (gaugeRef.current && gaugeFillRef.current) {
      gaugeRef.current.visible = state.fuel < 0.999 && !flying;
      gaugeRef.current.position.set(state.x, state.y + PLAYER_HEIGHT + 0.45, 0.4);
      gaugeFillRef.current.scale.x = Math.max(state.fuel, 0.001);
      gaugeFillRef.current.position.x = -(1 - state.fuel) * (GAUGE_WIDTH / 2);
      gaugeFillRef.current.material.color.set(state.fuel < LOW_FUEL ? colors.popstar : colors.caribbeanGreen);
    }

    // Trail of recent positions while flying; it shrinks away after landing
    const history = trail.current;
    if (flying) history.unshift(new Vector3(state.x, state.y + 0.3, 0));
    else history.pop();
    if (history.length > TRAIL_LENGTH) history.length = TRAIL_LENGTH;
    trailRef.current?.children.forEach((puff, i) => {
      const point = history[i];
      puff.visible = !!point;
      if (point) {
        puff.position.copy(point);
        puff.scale.setScalar((1 - i / TRAIL_LENGTH) * 0.35);
      }
    });

    // Nearest station within reach, reported only when it changes (none mid-flight)
    const near: StationLayout | undefined = flying
      ? undefined
      : level.stations.find((s) => Math.abs(state.x - s.x) < STATION_REACH && state.y >= s.y - 0.5 && state.y < s.y + PLAYER_HEIGHT * 2);
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
    const t = 1 - Math.exp(-dt * (opening || flying ? 6 : 4));
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
      <PlayerAvatar avatarRef={avatarRef} flameRef={flameRef} />
      <group ref={gaugeRef} visible={false}>
        <mesh>
          <planeGeometry args={[GAUGE_WIDTH + 0.08, 0.2]} />
          <meshBasicMaterial color={colors.blackCoffee} />
        </mesh>
        <mesh ref={gaugeFillRef} position={[0, 0, 0.01]}>
          <planeGeometry args={[GAUGE_WIDTH, 0.12]} />
          <meshBasicMaterial color={colors.caribbeanGreen} />
        </mesh>
      </group>
      <group ref={trailRef}>
        {Array.from({ length: TRAIL_LENGTH }, (_, i) => (
          <mesh key={i} visible={false}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial color={colors.queenPink} transparent opacity={0.7} />
          </mesh>
        ))}
      </group>
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
