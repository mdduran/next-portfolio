import * as React from 'react';
import { ART_COLS, ART_ROWS } from '@lib/projectArt';
import colors from 'styles/colors.json';
import { createCanvas, drawArt, useFontReady } from '@components/three/canvas2d';
import type { Box, Level, StationLayout } from './level';
import { PLAYER_HEIGHT, type PlayerState } from './physics';
import { clampDelta, createGame, LANDING_SQUASH_TIME, LOW_FUEL, spawnPoint, stepGame, TRAIL_LENGTH, type Game } from './simulation';
import { drawBillboard, drawSign } from './panels';
import type { PlaySceneProps } from './PlayScene';

// Flat side-view renderer for browsers without WebGL. Shares the level, physics
// and controls with the WebGL scene; everything is drawn on a 2D canvas in world
// units (y up) through the context transform.

// World units visible vertically, matching the WebGL camera's view of the play plane
const VIEW_HEIGHT = 12;
// Zoom when opening a station
const OPENING_ZOOM = 2;
const CAMERA_HEIGHT = 1.5;
// Hills move slower than the play plane, as they're further from the WebGL camera
const HILL_PARALLAX = 0.48;
const GRASS_HEIGHT = 0.1;
const GAUGE_WIDTH = 0.9;
const MAX_DPR = 2;

// Station motion, as in Station.tsx
const IDLE_SPIN = 0.8;
const ACTIVE_SPIN = 2;
const SPIN_ACCEL = 3;
const MAX_SPIN = 14;
const ACTIVE_SCALE = 1.3;
const ACTIVE_LIFT = 0.3;

type Camera = { x: number; y: number; zoom: number };
type StationMotion = { timeInReach: number; angle: number; spin: number; scale: number; lift: number };
// Pre-drawn panels per station and sign
type Panels = { billboards: Map<string, HTMLCanvasElement>; art: Map<string, HTMLCanvasElement>; signs: Map<string, HTMLCanvasElement> };

const ease = (dt: number, rate: number) => 1 - Math.exp(-dt * rate);

// Draws a canvas upright in the y-up world transform, with its bottom-left at x/y
function drawUpright(ctx: CanvasRenderingContext2D, image: HTMLCanvasElement, x: number, y: number, w: number, h: number): void {
  ctx.save();
  ctx.translate(x, y + h);
  ctx.scale(1, -1);
  ctx.drawImage(image, 0, 0, w, h);
  ctx.restore();
}

function drawHills(ctx: CanvasRenderingContext2D, level: Level, camera: Camera): void {
  // Hills scroll around the camera at a slower rate and smaller scale
  ctx.save();
  ctx.translate(camera.x, camera.y);
  ctx.scale(HILL_PARALLAX, HILL_PARALLAX);
  ctx.translate(-camera.x, -camera.y);
  // Faded toward the background, like the WebGL scene's fog
  ctx.globalAlpha = 0.6;
  ctx.fillStyle = colors.phthaloGreen;
  for (let x = level.minX - 20; x < level.maxX + 20; x += 5) {
    const h = 4 + Math.abs(Math.sin(x * 0.37) * 5) + Math.abs(Math.sin(x * 0.11) * 3);
    ctx.fillRect(x - 2.6, -1, 5.2, h);
  }
  ctx.restore();
}

function drawPlatform(ctx: CanvasRenderingContext2D, box: Box): void {
  ctx.fillStyle = box.oneWay ? colors.feldgrau : colors.outerSpaceCrayola;
  ctx.fillRect(box.x, box.y, box.w, box.h - GRASS_HEIGHT);
  ctx.fillStyle = colors.caribbeanGreen;
  ctx.fillRect(box.x, box.y + box.h - GRASS_HEIGHT, box.w, GRASS_HEIGHT);
}

// Cartridge or disc standing in for the WebGL scene's spinning model. The spin is
// faked by squashing horizontally; the label only shows on the front.
function drawArtifact(
  ctx: CanvasRenderingContext2D,
  station: StationLayout,
  art: HTMLCanvasElement | undefined,
  motion: StationMotion,
  time: number
): void {
  const { project, x, y } = station;
  const turn = Math.cos(motion.angle);
  ctx.save();
  ctx.translate(x, y + 1.6 + Math.sin(time * 2 + x) * 0.1 + motion.lift);
  ctx.scale(motion.scale * Math.max(Math.abs(turn), 0.08), motion.scale);
  if (project.type === 'game') {
    ctx.fillStyle = colors.rocketMetallic;
    ctx.fillRect(-0.55, -0.65, 1.1, 1.3);
    ctx.fillStyle = colors.deepTaupe;
    ctx.fillRect(-0.55, -0.65, 1.1, 0.15);
    if (turn > 0 && art) drawUpright(ctx, art, -0.42, -0.35, 0.84, 0.84);
  } else {
    ctx.fillStyle = colors.queenPink;
    ctx.beginPath();
    ctx.arc(0, 0, 0.62, 0, Math.PI * 2);
    ctx.fill();
    if (turn > 0 && art) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, 0, 0.55, 0, Math.PI * 2);
      ctx.clip();
      drawUpright(ctx, art, -0.75, -0.55, 1.5, 1.1);
      ctx.restore();
    }
    ctx.fillStyle = colors.castletonGreen;
    ctx.beginPath();
    ctx.arc(0, 0, 0.1, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawPlayer(ctx: CanvasRenderingContext2D, game: Game, flying: boolean, time: number): void {
  const state: PlayerState = game.player;
  const running = state.grounded && Math.abs(state.vx) > 0.5;
  const stretch = flying ? 1.1 : state.grounded || state.hovering ? 1 : state.vy > 0 ? 1.1 : 0.95;
  const squash = (game.landingSquash / LANDING_SQUASH_TIME) * 0.3;

  ctx.save();
  ctx.translate(state.x, state.y);
  // Lean forward while flying
  if (flying) ctx.rotate(-state.facing * 0.3);
  ctx.scale(state.facing, stretch - squash + (running ? Math.sin(time * 20) * 0.05 : 0));
  // Jetpack, with a flame while flying (full) or hovering (smaller)
  ctx.fillStyle = colors.cadetBlue;
  ctx.fillRect(-0.625, 0.25, 0.25, 0.6);
  if (flying || state.hovering) {
    const flame = ((flying ? 1 : 0.6) + Math.sin(time * 40) * 0.3) * 0.4;
    ctx.fillStyle = colors.tuscany;
    ctx.fillRect(-0.59, 0.05 - flame / 2, 0.18, flame);
  }
  ctx.fillStyle = colors.popstar;
  ctx.fillRect(-0.4, 0, 0.8, 0.9);
  ctx.fillStyle = colors.queenPink;
  ctx.fillRect(-0.3, 0.8, 0.6, 0.4);
  ctx.fillStyle = colors.black;
  ctx.fillRect(0.13, 1.0, 0.1, 0.1);
  ctx.restore();
}

function drawGauge(ctx: CanvasRenderingContext2D, state: PlayerState): void {
  const x = state.x - GAUGE_WIDTH / 2;
  const y = state.y + PLAYER_HEIGHT + 0.45;
  ctx.fillStyle = colors.blackCoffee;
  ctx.fillRect(x - 0.04, y - 0.1, GAUGE_WIDTH + 0.08, 0.2);
  ctx.fillStyle = state.fuel < LOW_FUEL ? colors.popstar : colors.caribbeanGreen;
  ctx.fillRect(x, y - 0.06, GAUGE_WIDTH * state.fuel, 0.12);
}

const PlayScene2D = ({
  level,
  inputRef,
  spawnSlug,
  openingSlug,
  onNearChange,
  travel,
  instantTravel,
  onTravelEnd,
  onReady
}: PlaySceneProps): React.ReactElement => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const fontReady = useFontReady();
  const panels = React.useMemo<Panels>(() => {
    const art = new Map<string, HTMLCanvasElement>();
    for (const { project } of level.stations) {
      const [canvas, ctx] = createCanvas(ART_COLS * 4, ART_ROWS * 4);
      drawArt(ctx, project, 0, 0, canvas.width, canvas.height);
      art.set(project.slug, canvas);
    }
    return {
      billboards: new Map(level.stations.map(({ project }) => [project.slug, drawBillboard(project)])),
      art,
      signs: new Map(level.signs.map((sign) => [sign.text, drawSign(sign.text)]))
    };
  }, [level, fontReady]);

  // The loop runs once per mount and reads the latest props from here
  const props = React.useRef({ level, inputRef, openingSlug, onNearChange, travel, instantTravel, onTravelEnd, onReady, panels });
  React.useEffect(() => {
    props.current = { level, inputRef, openingSlug, onNearChange, travel, instantTravel, onTravelEnd, onReady, panels };
  });

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return undefined;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    const game = createGame(props.current.level, spawnSlug);
    const spawn = spawnPoint(props.current.level, spawnSlug);
    const camera: Camera = { x: spawn.x, y: Math.max(spawn.y, 0) * 0.6 + CAMERA_HEIGHT, zoom: 1 };
    const motions = new Map<string, StationMotion>();
    let nearSlug: string | null = null;
    let last: number | null = null;
    let frame = 0;
    let started = false;

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      const p = props.current;
      const dt = last === null ? 0 : clampDelta((now - last) / 1000);
      last = now;
      const time = now / 1000;

      const { flying, near, landed } = stepGame(game, {
        level: p.level,
        input: p.inputRef.current,
        dt,
        travel: p.travel,
        instantTravel: p.instantTravel
      });
      if (landed) p.onTravelEnd();
      const slug = near?.project.slug ?? null;
      if (slug !== nearSlug) {
        nearSlug = slug;
        p.onNearChange(near?.project ?? null);
      }

      // Follow the player, or zoom in on the station being opened
      const state = game.player;
      const opening = p.level.stations.find((s) => s.project.slug === p.openingSlug);
      const target = opening
        ? { x: opening.x, y: opening.y + 1.8, zoom: OPENING_ZOOM }
        : { x: state.x, y: Math.max(state.y, 0) * 0.6 + CAMERA_HEIGHT, zoom: 1 };
      const t = ease(dt, opening || flying ? 6 : 4);
      camera.x += (target.x - camera.x) * t;
      camera.y += (target.y - camera.y) * t;
      camera.zoom += (target.zoom - camera.zoom) * t;

      // World units to device pixels, y up, centered on the camera
      const scale = (canvas.height / VIEW_HEIGHT) * camera.zoom;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.imageSmoothingEnabled = false;
      ctx.fillStyle = colors.castletonGreen;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(scale, 0, 0, -scale, canvas.width / 2 - camera.x * scale, canvas.height / 2 + camera.y * scale);

      drawHills(ctx, p.level, camera);

      for (const station of p.level.stations) {
        const billboard = p.panels.billboards.get(station.project.slug);
        if (billboard) drawUpright(ctx, billboard, station.x - 1.6, station.y + 2.9, 3.2, 2.2);
      }

      for (const sign of p.level.signs) {
        ctx.fillStyle = colors.blackCoffee;
        ctx.fillRect(sign.x - 0.075, sign.y, 0.15, 1.6);
        const panel = p.panels.signs.get(sign.text);
        if (panel) drawUpright(ctx, panel, sign.x - 1.2, sign.y + 1.6, 2.4, 0.6);
      }

      // Ground continues below the floor; the WebGL camera never sees under it
      const floor = p.level.platforms[0];
      ctx.fillStyle = colors.outerSpaceCrayola;
      ctx.fillRect(floor.x, floor.y - VIEW_HEIGHT, floor.w, VIEW_HEIGHT);
      for (const box of p.level.platforms) drawPlatform(ctx, box);

      for (const station of p.level.stations) {
        const { slug: stationSlug } = station.project;
        const active = stationSlug === nearSlug;
        let m = motions.get(stationSlug);
        if (!m) {
          m = { timeInReach: 0, angle: 0, spin: IDLE_SPIN, scale: 1, lift: 0 };
          motions.set(stationSlug, m);
        }
        // Spin up the longer the player stays in reach, easing back after they leave
        m.timeInReach = active ? m.timeInReach + dt : 0;
        const targetSpin = active ? Math.min(MAX_SPIN, ACTIVE_SPIN + SPIN_ACCEL * m.timeInReach) : IDLE_SPIN;
        m.spin += (targetSpin - m.spin) * ease(dt, 4);
        m.scale += ((active ? ACTIVE_SCALE : 1) - m.scale) * ease(dt, 8);
        m.lift += ((active ? ACTIVE_LIFT : 0) - m.lift) * ease(dt, 8);
        m.angle += dt * m.spin;

        ctx.fillStyle = active ? colors.caribbeanGreen : colors.outerSpaceCrayola;
        ctx.fillRect(station.x - 0.8, station.y, 1.6, 0.5);
        drawArtifact(ctx, station, p.panels.art.get(stationSlug), m, time);
      }

      // Trail puffs, shrinking toward the oldest
      ctx.globalAlpha = 0.7;
      ctx.fillStyle = colors.queenPink;
      game.trail.forEach((point, i) => {
        const size = (1 - i / TRAIL_LENGTH) * 0.35;
        ctx.fillRect(point.x - size / 2, point.y - size / 2, size, size);
      });
      ctx.globalAlpha = 1;

      drawPlayer(ctx, game, flying, time);
      if (state.fuel < 0.999 && !flying) drawGauge(ctx, state);

      if (!started) {
        started = true;
        p.onReady?.();
      }
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
    // The game is created once; props are read through the ref each frame
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, display: 'block', width: '100%', height: '100%' }} />;
};

export default PlayScene2D;
