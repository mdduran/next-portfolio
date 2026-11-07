import type { Level, StationLayout } from './level';
import {
  createPlayer,
  flightDuration,
  flightPosition,
  PLAYER_HEIGHT,
  stepPlayer,
  type Flight,
  type PlayerInput,
  type PlayerState
} from './physics';

// Per-frame game logic shared by the WebGL and 2D renderers: player physics,
// fast travel flights, the flight trail and which station is in reach.

// How close (in x) the player must be to a station to interact with it
export const STATION_REACH = 1.8;
export const TRAIL_LENGTH = 12;
export const LANDING_SQUASH_TIME = 0.25;
export const LOW_FUEL = 0.25;

// A fast travel request; id distinguishes repeated trips to the same place
export type TravelRequest = { toX: number; id: number };

export type Game = {
  player: PlayerState;
  flight: (Flight & { id: number }) | null;
  lastTravelId: number | null;
  landingSquash: number;
  // Recent positions while flying, newest first
  trail: { x: number; y: number }[];
};

export type StepOptions = {
  level: Level;
  input: PlayerInput;
  dt: number;
  travel: TravelRequest | null;
  // Skip the flight animation (prefers-reduced-motion)
  instantTravel: boolean;
};

export type StepResult = {
  flying: boolean;
  // Nearest station within reach (none mid-flight)
  near: StationLayout | undefined;
  // True on the frame a fast travel flight lands
  landed: boolean;
};

export function spawnPoint(level: Level, slug: string | null): { x: number; y: number } {
  const station = level.stations.find((s) => s.project.slug === slug);
  // Just left of the station, within reach, standing on its pedestal if raised
  return station ? { x: station.x - 1, y: station.y } : { x: level.spawnX, y: 0 };
}

export function createGame(level: Level, spawnSlug: string | null): Game {
  const spawn = spawnPoint(level, spawnSlug);
  return { player: createPlayer(spawn.x, spawn.y), flight: null, lastTravelId: null, landingSquash: 0, trail: [] };
}

// Clamp so a background tab doesn't teleport the player on return
export const clampDelta = (rawDelta: number): number => Math.min(rawDelta, 1 / 30);

// Advances the game by dt seconds (already clamped), mutating it
export function stepGame(game: Game, { level, input, dt, travel, instantTravel }: StepOptions): StepResult {
  const state = game.player;
  let landed = false;

  // Start a new fast travel flight
  if (travel && travel.id !== game.lastTravelId) {
    game.lastTravelId = travel.id;
    game.flight = {
      id: travel.id,
      fromX: state.x,
      fromY: state.y,
      toX: travel.toX,
      elapsed: 0,
      duration: flightDuration(state.x, travel.toX, instantTravel)
    };
  }

  const flying = game.flight;
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
      game.flight = null;
      state.grounded = true;
      game.landingSquash = flying.duration > 0 ? LANDING_SQUASH_TIME : 0;
      landed = true;
    }
  } else {
    stepPlayer(state, input, dt, level);
  }
  game.landingSquash = Math.max(0, game.landingSquash - dt);

  // Trail of recent positions while flying; it shrinks away after landing
  const history = game.trail;
  if (flying) history.unshift({ x: state.x, y: state.y + 0.3 });
  else history.pop();
  if (history.length > TRAIL_LENGTH) history.length = TRAIL_LENGTH;

  const near = flying
    ? undefined
    : level.stations.find((s) => Math.abs(state.x - s.x) < STATION_REACH && state.y >= s.y - 0.5 && state.y < s.y + PLAYER_HEIGHT * 2);

  return { flying: !!flying, near, landed };
}
