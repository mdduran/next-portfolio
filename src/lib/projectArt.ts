import colors from 'styles/colors.json';
import type { Project } from '@type';

// Generates pixel art for projects without a cover image, driven by their tags.
// Pure and client-safe: returns rectangles on a COLS x ROWS grid, so the same art
// can be rendered as SVG (ProjectArt) or painted onto a canvas texture.
//
// Each project gets one scene (the highest priority scene matching any of its
// tags, else a default) plus up to two decorations from its other tags. Layout
// details are randomized from the slug, so a project's art never changes.

export const ART_COLS = 32;
export const ART_ROWS = 18;

export type ArtRect = { x: number; y: number; w: number; h: number; fill: string; opacity?: number };

export type ArtSpec = {
  scene: string;
  decorations: string[];
  skyTop: string;
  skyBottom: string;
  rects: ArtRect[];
};

type Rand = () => number;
type Paint = (rand: Rand, accent: string) => ArtRect[];

type Scene = {
  name: string;
  tags: string[];
  skyTop: string;
  skyBottom: string;
  accent: string;
  // Whether a generic sky decoration (stars/clouds) fits when no tag adds one
  openSky: boolean;
  paint: Paint;
};

type Decoration = {
  name: string;
  tags: string[];
  paint: Paint;
};

// Deterministic PRNG (FNV-1a seed + mulberry32)
function seededRandom(seed: string): Rand {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h = Math.imul(h ^ seed.charCodeAt(i), 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Random integer in [min, max]
const int = (rand: Rand, min: number, max: number): number => min + Math.floor(rand() * (max - min + 1));

// Column heights that drift up and down by at most one pixel per column
function walk(rand: Rand, min: number, max: number): number[] {
  const heights: number[] = [];
  let height = int(rand, min, max);
  for (let x = 0; x < ART_COLS; x += 1) {
    height = Math.min(max, Math.max(min, height + int(rand, -1, 1)));
    heights.push(height);
  }
  return heights;
}

const px = (x: number, y: number, fill: string, opacity?: number): ArtRect => ({ x, y, w: 1, h: 1, fill, opacity });

// Scenes in priority order; the first one matching any tag wins.
const SCENES: Scene[] = [
  {
    name: 'underwater',
    tags: ['boids', 'behavioral-animation', 'fish', 'ocean', 'underwater'],
    skyTop: colors.spanishViridian,
    skyBottom: colors.phthaloGreen,
    accent: colors.caribbeanGreen,
    openSky: true,
    paint: (rand) => {
      const floor = walk(rand, 1, 3);
      const rects = floor.map((h, x) => ({ x, y: ART_ROWS - h, w: 1, h, fill: colors.tuscany }));
      for (let i = 0; i < 4; i += 1) {
        const x = int(rand, 1, ART_COLS - 2);
        const h = int(rand, 2, 5);
        rects.push({ x, y: ART_ROWS - floor[x] - h, w: 1, h, fill: colors.tropicalRainforest });
      }
      return rects;
    }
  },
  {
    name: 'arena',
    tags: ['fighting', 'arena', 'brawler'],
    skyTop: colors.blackCoffee,
    skyBottom: colors.popstar,
    accent: colors.queenPink,
    openSky: true,
    paint: (rand, accent) => {
      const fighter = (x: number, fill: string): ArtRect[] => [
        { x, y: 7, w: 2, h: 2, fill },
        { x, y: 9, w: 2, h: 3, fill }
      ];
      return [
        // Floating stage that tapers underneath
        { x: 5, y: 12, w: 22, h: 2, fill: colors.outerSpaceCrayola },
        { x: 5, y: 12, w: 22, h: 1, fill: accent },
        { x: 8, y: 14, w: 16, h: 1, fill: colors.outerSpaceCrayola },
        { x: 11, y: 15, w: 10, h: 1, fill: colors.outerSpaceCrayola },
        ...fighter(int(rand, 8, 12), colors.white),
        ...fighter(int(rand, 18, 22), colors.caribbeanGreen)
      ];
    }
  },
  {
    name: 'table',
    tags: ['card-game', 'cards', 'solitaire', 'board-game'],
    skyTop: colors.tropicalRainforest,
    skyBottom: colors.spanishViridian,
    accent: colors.popstar,
    openSky: false,
    paint: (rand, accent) => {
      const rects: ArtRect[] = [
        { x: 0, y: 0, w: ART_COLS, h: 1, fill: colors.blackCoffee },
        { x: 0, y: ART_ROWS - 1, w: ART_COLS, h: 1, fill: colors.blackCoffee },
        { x: 0, y: 0, w: 1, h: ART_ROWS, fill: colors.blackCoffee },
        { x: ART_COLS - 1, y: 0, w: 1, h: ART_ROWS, fill: colors.blackCoffee }
      ];
      const left = int(rand, 6, 10);
      for (let i = 0; i < 3; i += 1) {
        const x = left + i * 6;
        const y = i === 1 ? 4 : 5;
        rects.push({ x, y, w: 5, h: 7, fill: colors.white });
        rects.push(px(x + 2, y + 3, i === 1 ? accent : colors.blackCoffee));
      }
      return rects;
    }
  },
  {
    name: 'synthwave',
    tags: ['opengl', 'webgl', '3d', 'unreal-engine-4', 'graphics', 'shaders'],
    skyTop: colors.blackCoffee,
    skyBottom: colors.solidPink,
    accent: colors.caribbeanGreen,
    openSky: true,
    paint: (rand, accent) => {
      const rects: ArtRect[] = [];
      const horizon = 11;
      const radius = 5;
      const sunX = int(rand, 10, 21);
      // Striped sun setting on the horizon
      for (let i = 0; i < radius; i += 1) {
        if (i >= radius / 2 && i % 2 === 1) continue;
        const d = radius - i - 0.5;
        const half = Math.round(Math.sqrt(radius * radius - d * d));
        rects.push({ x: sunX - half, y: horizon - radius + i, w: half * 2, h: 1, fill: colors.popstar });
      }
      // Floor with a perspective grid
      rects.push({ x: 0, y: horizon, w: ART_COLS, h: ART_ROWS - horizon, fill: colors.blackCoffee });
      for (const y of [horizon, horizon + 2, horizon + 5]) {
        rects.push({ x: 0, y, w: ART_COLS, h: 1, fill: accent, opacity: 0.8 });
      }
      // Lines fan out from a vanishing point above the horizon
      for (let line = -4; line <= 4; line += 1) {
        for (let y = horizon + 1; y < ART_ROWS; y += 1) {
          const x = Math.round(ART_COLS / 2 + line * (y - horizon + 2) * 1.2);
          if (x >= 0 && x < ART_COLS) rects.push(px(x, y, accent, 0.6));
        }
      }
      return rects;
    }
  },
  {
    name: 'castle',
    tags: ['rpg', 'fantasy', 'adventure', 'medieval'],
    skyTop: colors.outerSpaceCrayola,
    skyBottom: colors.cadetBlue,
    accent: colors.tuscany,
    openSky: true,
    paint: (rand, accent) => {
      const rects: ArtRect[] = [];
      const peaks = Array.from({ length: 3 }, () => ({ x: int(rand, 0, ART_COLS - 1), h: int(rand, 6, 10) }));
      for (let x = 0; x < ART_COLS; x += 1) {
        const h = Math.max(2, ...peaks.map((peak) => peak.h - Math.abs(x - peak.x)));
        rects.push({ x, y: ART_ROWS - h, w: 1, h, fill: colors.feldgrau });
        if (h >= 8) rects.push(px(x, ART_ROWS - h, colors.white, 0.7));
      }
      const left = int(rand, 4, 22);
      const wall = colors.blackCoffee;
      rects.push(
        { x: left, y: ART_ROWS - 5, w: 6, h: 5, fill: wall },
        { x: left - 1, y: ART_ROWS - 8, w: 2, h: 8, fill: wall },
        { x: left + 5, y: ART_ROWS - 8, w: 2, h: 8, fill: wall },
        px(left - 1, ART_ROWS - 9, wall),
        px(left + 6, ART_ROWS - 9, wall),
        px(left + 1, ART_ROWS - 6, wall),
        px(left + 3, ART_ROWS - 6, wall),
        { x: left + 2, y: ART_ROWS - 2, w: 2, h: 2, fill: accent }
      );
      return rects;
    }
  },
  {
    name: 'skyline',
    tags: ['mobile', 'location-based', 'web', 'city'],
    skyTop: colors.outerSpaceCrayola,
    skyBottom: colors.roseDust,
    accent: colors.queenPink,
    openSky: true,
    paint: (rand, accent) => {
      const rects: ArtRect[] = [];
      let x = 0;
      while (x < ART_COLS) {
        const w = int(rand, 2, 4);
        const h = int(rand, 4, 11);
        rects.push({ x, y: ART_ROWS - h, w, h, fill: colors.blackCoffee });
        // Lit windows on every other row
        for (let wy = ART_ROWS - h + 1; wy < ART_ROWS - 1; wy += 2) {
          for (let wx = x; wx < x + w; wx += 1) {
            if (rand() < 0.3) rects.push(px(wx, wy, accent));
          }
        }
        x += w + (rand() < 0.3 ? 1 : 0);
      }
      return rects;
    }
  },
  {
    name: 'terrain',
    tags: ['procedural-generation', 'platformer', 'roguelike', 'survival'],
    skyTop: colors.phthaloGreen,
    skyBottom: colors.zomp,
    accent: colors.caribbeanGreen,
    openSky: true,
    paint: (rand, accent) =>
      walk(rand, 2, 9).flatMap((h, x) => [{ x, y: ART_ROWS - h, w: 1, h, fill: colors.phthaloGreen }, px(x, ART_ROWS - h, accent, 0.5)])
  }
];
const DEFAULT_SCENE = SCENES[SCENES.length - 1];

const stars: Decoration = {
  name: 'stars',
  tags: ['space', 'night'],
  paint: (rand, accent) => Array.from({ length: 10 }, () => px(int(rand, 0, ART_COLS - 1), int(rand, 0, 6), accent, 0.7))
};

const clouds: Decoration = {
  name: 'clouds',
  tags: ['sky', 'clouds'],
  paint: (rand) =>
    Array.from({ length: 2 }).flatMap(() => {
      const x = int(rand, 0, ART_COLS - 6);
      const y = int(rand, 2, 6);
      return [
        { x, y, w: 5, h: 1, fill: colors.white, opacity: 0.5 },
        { x: x + 1, y: y - 1, w: 3, h: 1, fill: colors.white, opacity: 0.5 }
      ];
    })
};

const DECORATIONS: Decoration[] = [
  stars,
  clouds,
  {
    name: 'school',
    tags: ['boids', 'behavioral-animation', 'birds', 'flocking', 'simulation'],
    paint: (rand, accent) => {
      const cx = int(rand, 6, 24);
      const cy = int(rand, 3, 8);
      return Array.from({ length: 6 }).flatMap(() => {
        const x = cx + int(rand, -4, 4);
        const y = cy + int(rand, -2, 2);
        return [{ x, y, w: 2, h: 1, fill: accent }, px(x - 1, y, colors.white, 0.6)];
      });
    }
  },
  {
    name: 'equalizer',
    tags: ['fmod', 'audio', 'music', 'rhythm', 'sound'],
    paint: (rand, accent) => {
      const left = int(rand, 2, 18);
      return Array.from({ length: 7 }).flatMap((_, i) => {
        const h = int(rand, 1, 6);
        const x = left + i * 2;
        return [{ x, y: 9 - h, w: 1, h, fill: accent }, px(x, 9 - h, colors.white)];
      });
    }
  },
  {
    name: 'blocks',
    tags: ['puzzle', 'level-editor', 'tetris'],
    paint: (rand) =>
      [colors.popstar, colors.tuscany, colors.cadetBlue].flatMap((fill, i) => {
        const x = int(rand, i * 10 + 1, i * 10 + 7);
        const y = int(rand, 2, 7);
        return [{ x, y, w: 2, h: 2, fill }, px(x, y, colors.white, 0.6)];
      })
  },
  {
    name: 'pins',
    tags: ['location-based', 'map', 'gps'],
    paint: (rand) =>
      Array.from({ length: 2 }).flatMap((_, i) => {
        const x = int(rand, i * 15 + 2, i * 15 + 12);
        const y = int(rand, 2, 6);
        return [
          { x, y, w: 3, h: 2, fill: colors.popstar },
          { x: x + 1, y: y + 2, w: 1, h: 2, fill: colors.popstar },
          px(x + 1, y, colors.white)
        ];
      })
  },
  {
    name: 'sparks',
    tags: ['fighting', 'action', 'combat'],
    paint: (rand, accent) =>
      Array.from({ length: 4 }).flatMap(() => {
        const x = int(rand, 1, ART_COLS - 2);
        const y = int(rand, 1, 6);
        return [
          { x, y: y - 1, w: 1, h: 3, fill: accent, opacity: 0.8 },
          { x: x - 1, y, w: 3, h: 1, fill: accent, opacity: 0.8 }
        ];
      })
  }
];
const MAX_DECORATIONS = 2;

export function getArtSpec(project: Pick<Project, 'slug' | 'tags'>): ArtSpec {
  const rand = seededRandom(project.slug);
  const tags = project.tags.map((tag) => tag.toLowerCase());
  const matches = (candidate: { tags: string[] }) => candidate.tags.some((tag) => tags.includes(tag));

  const scene = SCENES.find(matches) ?? DEFAULT_SCENE;
  // Decorations in tag order, one per kind
  const decorations: Decoration[] = [];
  for (const tag of tags) {
    const decoration = DECORATIONS.find((d) => d.tags.includes(tag));
    if (decoration && !decorations.includes(decoration)) decorations.push(decoration);
  }
  if (decorations.length === 0 && scene.openSky) {
    decorations.push(rand() < 0.5 ? stars : clouds);
  }
  const chosen = decorations.slice(0, MAX_DECORATIONS);

  return {
    scene: scene.name,
    decorations: chosen.map((d) => d.name),
    skyTop: scene.skyTop,
    skyBottom: scene.skyBottom,
    rects: [...scene.paint(rand, scene.accent), ...chosen.flatMap((d) => d.paint(rand, scene.accent))]
  };
}
