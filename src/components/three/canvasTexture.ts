import * as React from 'react';
import { CanvasTexture, NearestFilter, SRGBColorSpace } from 'three';
import { useFontReady } from './canvas2d';

// Helpers for textures drawn on a 2D canvas: billboards, signs and model labels.

export { FONT_FAMILY, createCanvas, drawArt, fitText, useFontReady } from './canvas2d';

// flipY: false for textures on glTF models. pixelated: crisp nearest-neighbor
// sampling for large flat panels; leave it off for model labels, which are often
// smaller on screen than the texture and would shimmer.
export function toTexture(canvas: HTMLCanvasElement, { flipY = true, pixelated = true } = {}): CanvasTexture {
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.flipY = flipY;
  if (pixelated) {
    texture.magFilter = NearestFilter;
    texture.minFilter = NearestFilter;
  }
  return texture;
}

// Creates a texture, recreated when key changes or the font loads, and disposes
// replaced ones
export function useCanvasTexture(create: () => CanvasTexture, key: string): CanvasTexture {
  const fontReady = useFontReady();
  const texture = React.useMemo(() => create(), [key, fontReady]);
  React.useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}
