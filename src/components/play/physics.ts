import type { Box, Level } from './level';

// Kinematic platformer controller: no physics engine, just velocity, gravity
// and axis-separated collision against axis-aligned boxes.

export const PLAYER_HALF_WIDTH = 0.4;
export const PLAYER_HEIGHT = 1.2;

const RUN_SPEED = 7;
const GROUND_ACCEL = 60;
const AIR_ACCEL = 35;
const GRAVITY = 32;
const JUMP_VELOCITY = 13.5;
// Extra gravity while rising with jump released, for short hops
const JUMP_CUT_MULTIPLIER = 1.5;
const MAX_FALL_SPEED = 25;
// Grace periods that make jumping feel forgiving
const COYOTE_TIME = 0.1;
const JUMP_BUFFER_TIME = 0.12;
// Jetpack hover: holding jump while falling slows to a gentle sink, using fuel
// that recharges whenever jump is released (in the air too) or on the ground
const HOVER_SINK_SPEED = 0.6;
const HOVER_RESPONSIVENESS = 12;
const HOVER_DURATION = 1.5;
const HOVER_RECHARGE_TIME = 0.75;
const EPSILON = 0.001;

export type PlayerState = {
  // x is the center, y is the feet
  x: number;
  y: number;
  vx: number;
  vy: number;
  grounded: boolean;
  facing: 1 | -1;
  coyote: number;
  jumpBuffer: number;
  // Jetpack charge, 0..1
  fuel: number;
  hovering: boolean;
};

export type PlayerInput = {
  left: boolean;
  right: boolean;
  jumpHeld: boolean;
  // Set on key/button press, consumed by the next step
  jumpQueued: boolean;
};

export function createPlayer(x: number, y = 0): PlayerState {
  return { x, y, vx: 0, vy: 0, grounded: true, facing: 1, coyote: 0, jumpBuffer: 0, fuel: 1, hovering: false };
}

const overlapsX = (state: PlayerState, box: Box) => state.x + PLAYER_HALF_WIDTH > box.x && state.x - PLAYER_HALF_WIDTH < box.x + box.w;
const overlapsY = (state: PlayerState, box: Box) => state.y < box.y + box.h - EPSILON && state.y + PLAYER_HEIGHT > box.y + EPSILON;

// Advances the player by dt seconds, mutating and returning state
export function stepPlayer(state: PlayerState, input: PlayerInput, dt: number, level: Level): PlayerState {
  // Horizontal: accelerate toward the target speed
  const direction = Number(input.right) - Number(input.left);
  const accel = (state.grounded ? GROUND_ACCEL : AIR_ACCEL) * dt;
  state.vx += Math.max(-accel, Math.min(accel, direction * RUN_SPEED - state.vx));
  if (direction !== 0) state.facing = direction > 0 ? 1 : -1;

  // Jumping with coyote time and input buffering
  state.coyote = state.grounded ? COYOTE_TIME : Math.max(0, state.coyote - dt);
  if (input.jumpQueued) {
    state.jumpBuffer = JUMP_BUFFER_TIME;
    input.jumpQueued = false;
  } else {
    state.jumpBuffer = Math.max(0, state.jumpBuffer - dt);
  }
  if (state.jumpBuffer > 0 && state.coyote > 0) {
    state.vy = JUMP_VELOCITY;
    state.jumpBuffer = 0;
    state.coyote = 0;
    state.grounded = false;
  }

  // Hover once past the top of a jump (or after walking off a ledge)
  state.hovering = !state.grounded && input.jumpHeld && state.vy <= 0 && state.fuel > 0;
  if (state.hovering) {
    state.fuel = Math.max(0, state.fuel - dt / HOVER_DURATION);
    state.vy += (-HOVER_SINK_SPEED - state.vy) * Math.min(1, dt * HOVER_RESPONSIVENESS);
  } else {
    if (state.grounded || !input.jumpHeld) state.fuel = Math.min(1, state.fuel + dt / HOVER_RECHARGE_TIME);
    const gravity = state.vy > 0 && !input.jumpHeld ? GRAVITY * JUMP_CUT_MULTIPLIER : GRAVITY;
    state.vy = Math.max(-MAX_FALL_SPEED, state.vy - gravity * dt);
  }

  // Move along x, then push out of solid boxes
  state.x += state.vx * dt;
  for (const box of level.platforms) {
    if (box.oneWay || !overlapsX(state, box) || !overlapsY(state, box)) continue;
    state.x = state.vx > 0 ? box.x - PLAYER_HALF_WIDTH : box.x + box.w + PLAYER_HALF_WIDTH;
    state.vx = 0;
  }
  state.x = Math.max(level.minX + PLAYER_HALF_WIDTH, Math.min(level.maxX - PLAYER_HALF_WIDTH, state.x));

  // Move along y: land on tops (one-way boxes only from above), bonk on undersides
  const prevY = state.y;
  state.y += state.vy * dt;
  state.grounded = false;
  for (const box of level.platforms) {
    if (!overlapsX(state, box)) continue;
    const top = box.y + box.h;
    if (state.vy <= 0 && prevY >= top - EPSILON && state.y < top) {
      state.y = top;
      state.vy = 0;
      state.grounded = true;
    } else if (!box.oneWay && state.vy > 0 && prevY + PLAYER_HEIGHT <= box.y + EPSILON && state.y + PLAYER_HEIGHT > box.y) {
      state.y = box.y - PLAYER_HEIGHT;
      state.vy = 0;
    }
  }

  return state;
}

// Fast travel: a scripted jetpack flight that arcs over the level
const FLIGHT_PEAK = 5.5;

export type Flight = {
  fromX: number;
  fromY: number;
  toX: number;
  elapsed: number;
  duration: number;
};

// Longer trips take longer, within limits; 0 skips the flight entirely
export function flightDuration(fromX: number, toX: number, instant: boolean): number {
  if (instant) return 0;
  return Math.min(2.2, Math.max(0.8, 0.6 + Math.abs(toX - fromX) * 0.02));
}

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

// Position along the flight at progress t (0..1); lands on the floor at t = 1
export function flightPosition(flight: Flight, t: number): { x: number; y: number } {
  const eased = easeInOutCubic(t);
  return {
    x: flight.fromX + (flight.toX - flight.fromX) * eased,
    y: flight.fromY * (1 - t) + 4 * FLIGHT_PEAK * t * (1 - t)
  };
}
