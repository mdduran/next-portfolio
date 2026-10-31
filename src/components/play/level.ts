import type { Project } from '@type';

// Level layout for the /play platformer, generated from the project list.
// Units are world units; y is up, the floor top is y = 0, and gameplay happens
// on the z = 0 plane. Stations sit behind the play plane.

// Axis-aligned box: x/y is the bottom-left corner
export type Box = { x: number; y: number; w: number; h: number; oneWay?: boolean };

export type StationLayout = {
  project: Project;
  // Center x and the height the station stands on
  x: number;
  y: number;
};

export type SignLayout = { text: string; x: number; y: number };

// Fast travel destination: just past a zone's sign
export type ZoneLayout = { type: Project['type']; label: string; x: number };

export type Level = {
  platforms: Box[];
  stations: StationLayout[];
  signs: SignLayout[];
  zones: ZoneLayout[];
  minX: number;
  maxX: number;
  spawnX: number;
};

const STATION_SPACING = 9;
const ZONE_GAP = 6;
const FIRST_STATION_X = 8;
const PEDESTAL_HEIGHT = 1.5;
const PEDESTAL_WIDTH = 4;

const ZONES: { type: Project['type']; label: string }[] = [
  { type: 'game', label: 'GAMES' },
  { type: 'software', label: 'SOFTWARE' }
];

export function buildLevel(projects: Project[]): Level {
  const platforms: Box[] = [];
  const stations: StationLayout[] = [];
  const signs: SignLayout[] = [];
  const zones: ZoneLayout[] = [];

  let x = FIRST_STATION_X;
  let index = 0;
  for (const zone of ZONES) {
    const zoneProjects = projects.filter((project) => project.type === zone.type);
    if (zoneProjects.length === 0) continue;

    const signX = x - STATION_SPACING / 2 - (index > 0 ? ZONE_GAP / 2 : 0);
    signs.push({ text: zone.label, x: signX, y: 0 });
    zones.push({ type: zone.type, label: zone.label, x: signX + 1.5 });

    for (const project of zoneProjects) {
      // Every other station stands on a pedestal you have to jump onto
      const raised = index % 2 === 1;
      if (raised) {
        platforms.push({ x: x - PEDESTAL_WIDTH / 2, y: 0, w: PEDESTAL_WIDTH, h: PEDESTAL_HEIGHT });
      }
      stations.push({ project, x, y: raised ? PEDESTAL_HEIGHT : 0 });

      // Optional floating platform to hop across before the next station. Jump
      // apex is ~2.85, so its top is reachable from the ground (2.3) or from
      // the pedestal it follows (3.3).
      platforms.push({ x: x + STATION_SPACING / 2 - 1, y: raised ? 2.9 : 1.9, w: 2, h: 0.4, oneWay: true });

      x += STATION_SPACING;
      index += 1;
    }
    x += ZONE_GAP;
  }

  const minX = -6;
  const maxX = x;
  // Floor spans the whole level (and past its ends, out of view) so there are no pits
  platforms.unshift({ x: minX - 12, y: -2, w: maxX - minX + 24, h: 2 });

  return { platforms, stations, signs, zones, minX, maxX, spawnX: 0 };
}
