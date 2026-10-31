import { CanvasTexture } from 'three';
import type { Project } from '@type';
import colors from 'styles/colors.json';
import { createCanvas, drawArt, fitText, toTexture } from './canvasTexture';

export type LabelProject = Pick<Project, 'slug' | 'title' | 'type' | 'tags' | 'year' | 'platform' | 'genre'>;

const LABEL_SIZE = 1024;

// Regions of the cartridge label UV map, as fractions of the texture (see
// public/webp/cartLabelBlank.webp, the template custom labels should follow)
const CART_FRONT = { x: 0.059, y: 0, w: 0.882, h: 0.469 };
// The front's top strip wraps over the cartridge's top edge, so the title goes
// in a band just below it
const CART_FRONT_HEADER = 0.092;
const CART_FRONT_TITLE = 0.075;
const CART_BACK = { x: 0.121, y: 0.492, w: 0.758, h: 0.508 };

// The label side of the CD texture is the top-left disc. Its UVs are mirrored
// and rotated relative to the geometry: a reflection across a line at 47.25°
// (fitted from the label face's vertex positions vs UVs). Drawing through the
// same reflection, which is its own inverse, makes the label read correctly.
const DISC_CENTER = { x: 0.2842, y: 0.2864 };
const DISC_RADIUS = 0.255;
const DISC_HUB_RADIUS = 0.1;
const DISC_UV_ANGLE = (47.25 * Math.PI) / 180;

const scaled = (region: { x: number; y: number; w: number; h: number }) => ({
  x: region.x * LABEL_SIZE,
  y: region.y * LABEL_SIZE,
  w: region.w * LABEL_SIZE,
  h: region.h * LABEL_SIZE
});

// Cartridge label: art with a title header on the front; details on the back
export function createCartLabelTexture(project: LabelProject): CanvasTexture {
  const [canvas, ctx] = createCanvas(LABEL_SIZE, LABEL_SIZE);
  ctx.fillStyle = colors.blackCoffee;
  ctx.fillRect(0, 0, LABEL_SIZE, LABEL_SIZE);
  ctx.textBaseline = 'middle';

  const front = scaled(CART_FRONT);
  const header = CART_FRONT_HEADER * LABEL_SIZE;
  const titleBand = CART_FRONT_TITLE * LABEL_SIZE;
  ctx.fillStyle = colors.white;
  ctx.fillRect(front.x, front.y, front.w, header + titleBand);
  ctx.fillStyle = colors.blackCoffee;
  ctx.textAlign = 'center';
  fitText(ctx, project.title, front.w - 96, 40);
  ctx.fillText(project.title, front.x + front.w / 2, front.y + header + titleBand / 2 + 2);
  const artTop = front.y + header + titleBand;
  drawArt(ctx, project, front.x, artTop, front.w, front.y + front.h - artTop);

  const back = scaled(CART_BACK);
  const padding = 40;
  const artHeight = back.h * 0.4;
  drawArt(ctx, project, back.x, back.y, back.w, artHeight);
  const lines = [
    project.title,
    `${project.year} · ${project.type === 'game' ? 'Game' : 'Software'}`,
    project.platform,
    project.genre,
    project.tags.length > 0 ? project.tags.join(' ') : undefined
  ].filter((line): line is string => !!line);
  ctx.textAlign = 'left';
  const lineHeight = (back.h - artHeight - padding) / Math.max(lines.length, 4);
  lines.forEach((line, i) => {
    ctx.fillStyle = i === 0 ? colors.caribbeanGreen : colors.queenPink;
    fitText(ctx, line, back.w - padding * 2, i === 0 ? 40 : 28);
    ctx.fillText(line, back.x + padding, back.y + artHeight + padding / 2 + lineHeight * (i + 0.5));
  });

  return toTexture(canvas, { flipY: false, pixelated: false });
}

// CD texture with the project's art printed on the label side of the disc
export function createDiscLabelTexture(project: LabelProject, base: CanvasImageSource & { width: number; height: number }): CanvasTexture {
  const size = base.width;
  const [canvas, ctx] = createCanvas(size, base.height);
  ctx.drawImage(base, 0, 0);

  const cx = DISC_CENTER.x * size;
  const cy = DISC_CENTER.y * size;
  const outer = DISC_RADIUS * size;
  const hub = DISC_HUB_RADIUS * size;

  // Art on the ring between the hub and the rim
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, outer, 0, Math.PI * 2);
  ctx.arc(cx, cy, hub, 0, Math.PI * 2, true);
  ctx.clip('evenodd');
  // Draw centered on the disc, in the reflected frame described above
  ctx.translate(cx, cy);
  const cos = Math.cos(DISC_UV_ANGLE);
  const sin = Math.sin(DISC_UV_ANGLE);
  ctx.transform(cos, sin, sin, -cos, 0, 0);
  drawArt(ctx, project, -outer, -outer, outer * 2, outer * 2);
  // Title band below the hub
  const bandTop = hub + outer * 0.12;
  const bandHeight = outer * 0.3;
  ctx.fillStyle = colors.white;
  ctx.fillRect(-outer, bandTop, outer * 2, bandHeight);
  ctx.fillStyle = colors.blackCoffee;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  fitText(ctx, project.title, outer * 1.3, 28);
  ctx.fillText(project.title, 0, bandTop + bandHeight / 2 + 1);
  ctx.restore();

  ctx.strokeStyle = colors.outerSpaceCrayola;
  ctx.lineWidth = size * 0.004;
  ctx.beginPath();
  ctx.arc(cx, cy, outer, 0, Math.PI * 2);
  ctx.stroke();

  return toTexture(canvas, { flipY: false, pixelated: false });
}
