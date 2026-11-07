import type { Project } from '@type';
import { ART_COLS, ART_ROWS } from '@lib/projectArt';
import colors from 'styles/colors.json';
import { createCanvas, drawArt, fitText } from '@components/three/canvas2d';

// Billboard and sign panels drawn on a 2D canvas, used as textures by the WebGL
// scene and drawn directly by the 2D fallback

const ART_SCALE = 8;

// Station billboard: the project's generated art with its title underneath
export function drawBillboard(project: Pick<Project, 'slug' | 'tags' | 'title'>): HTMLCanvasElement {
  const width = ART_COLS * ART_SCALE;
  const artHeight = ART_ROWS * ART_SCALE;
  const titleHeight = 32;
  const [canvas, ctx] = createCanvas(width, artHeight + titleHeight);

  drawArt(ctx, project, 0, 0, width, artHeight);

  ctx.fillStyle = colors.white;
  ctx.fillRect(0, artHeight, width, titleHeight);
  ctx.fillStyle = colors.blackCoffee;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  fitText(ctx, project.title, width - 16, 14);
  ctx.fillText(project.title, width / 2, artHeight + titleHeight / 2 + 1);

  return canvas;
}

// Zone sign text on a dark panel
export function drawSign(text: string): HTMLCanvasElement {
  const [canvas, ctx] = createCanvas(256, 64);
  ctx.fillStyle = colors.outerSpaceCrayola;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = colors.caribbeanGreen;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  fitText(ctx, text, canvas.width - 24, 24);
  ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 2);
  return canvas;
}
