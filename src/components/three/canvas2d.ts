import * as React from 'react';
import type { Project } from '@type';
import { ART_COLS, ART_ROWS, getArtSpec } from '@lib/projectArt';

// 2D canvas drawing helpers with no three.js dependency, shared by textures and
// the non-WebGL play renderer.

export const FONT_FAMILY = '"Press Start 2P", monospace';

export function createCanvas(width: number, height: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return [canvas, canvas.getContext('2d')!];
}

// Sets the largest font (up to size) at which the text fits the width
export function fitText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, size: number): void {
  let fontSize = size;
  do {
    ctx.font = `${fontSize}px ${FONT_FAMILY}`;
    fontSize -= 1;
  } while (ctx.measureText(text).width > maxWidth && fontSize > 6);
}

// Draws the project's generated art scaled to cover the rectangle (cropping the overflow)
export function drawArt(
  ctx: CanvasRenderingContext2D,
  project: Pick<Project, 'slug' | 'tags'>,
  x: number,
  y: number,
  width: number,
  height: number
): void {
  const art = getArtSpec(project);
  const scale = Math.max(width / ART_COLS, height / ART_ROWS);
  const left = x + (width - ART_COLS * scale) / 2;
  const top = y + (height - ART_ROWS * scale) / 2;

  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.clip();
  const sky = ctx.createLinearGradient(0, top, 0, top + ART_ROWS * scale);
  sky.addColorStop(0, art.skyTop);
  sky.addColorStop(1, art.skyBottom);
  ctx.fillStyle = sky;
  ctx.fillRect(x, y, width, height);
  for (const rect of art.rects) {
    ctx.globalAlpha = rect.opacity ?? 1;
    ctx.fillStyle = rect.fill;
    // Overlap by a pixel so scaled rects don't leave hairline gaps
    ctx.fillRect(left + rect.x * scale, top + rect.y * scale, rect.w * scale + 1, rect.h * scale + 1);
  }
  ctx.restore();
}

// True once the pixel font is available for canvas drawing
export function useFontReady(): boolean {
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    let active = true;
    document.fonts
      .load(`16px ${FONT_FAMILY}`)
      .catch(() => undefined)
      .then(() => active && setReady(true));
    return () => {
      active = false;
    };
  }, []);
  return ready;
}
