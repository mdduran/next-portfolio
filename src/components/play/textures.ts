import * as React from 'react';
import { CanvasTexture, NearestFilter, SRGBColorSpace } from 'three';
import type { Project } from '@type';
import { ART_COLS, ART_ROWS, getArtSpec } from '@lib/projectArt';
import colors from 'styles/colors.json';

const FONT_FAMILY = '"Press Start 2P", monospace';
const ART_SCALE = 8;

function toTexture(canvas: HTMLCanvasElement): CanvasTexture {
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  // Keep pixel art crisp
  texture.magFilter = NearestFilter;
  texture.minFilter = NearestFilter;
  return texture;
}

// Shrinks the font until the text fits the width
function fitText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, size: number): void {
  let fontSize = size;
  do {
    ctx.font = `${fontSize}px ${FONT_FAMILY}`;
    fontSize -= 1;
  } while (ctx.measureText(text).width > maxWidth && fontSize > 6);
}

// Station billboard: the project's generated art with its title underneath
export function createBillboardTexture(project: Pick<Project, 'slug' | 'tags' | 'title'>): CanvasTexture {
  const art = getArtSpec(project);
  const width = ART_COLS * ART_SCALE;
  const artHeight = ART_ROWS * ART_SCALE;
  const titleHeight = 32;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = artHeight + titleHeight;
  const ctx = canvas.getContext('2d')!;

  const sky = ctx.createLinearGradient(0, 0, 0, artHeight);
  sky.addColorStop(0, art.skyTop);
  sky.addColorStop(1, art.skyBottom);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, width, artHeight);
  for (const rect of art.rects) {
    ctx.globalAlpha = rect.opacity ?? 1;
    ctx.fillStyle = rect.fill;
    ctx.fillRect(rect.x * ART_SCALE, rect.y * ART_SCALE, rect.w * ART_SCALE, rect.h * ART_SCALE);
  }
  ctx.globalAlpha = 1;

  ctx.fillStyle = colors.white;
  ctx.fillRect(0, artHeight, width, titleHeight);
  ctx.fillStyle = colors.blackCoffee;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  fitText(ctx, project.title, width - 16, 14);
  ctx.fillText(project.title, width / 2, artHeight + titleHeight / 2 + 1);

  return toTexture(canvas);
}

// Zone sign text on a dark panel
export function createSignTexture(text: string): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = colors.outerSpaceCrayola;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = colors.caribbeanGreen;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  fitText(ctx, text, canvas.width - 24, 24);
  ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 2);
  return toTexture(canvas);
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

// Creates a texture, recreated when key changes or the font loads, and disposes
// replaced ones
export function useCanvasTexture(create: () => CanvasTexture, key: string): CanvasTexture {
  const fontReady = useFontReady();
  const texture = React.useMemo(() => create(), [key, fontReady]);
  React.useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}
