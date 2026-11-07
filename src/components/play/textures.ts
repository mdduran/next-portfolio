import { CanvasTexture } from 'three';
import type { Project } from '@type';
import { toTexture } from '@components/three/canvasTexture';
import { drawBillboard, drawSign } from './panels';

export function createBillboardTexture(project: Pick<Project, 'slug' | 'tags' | 'title'>): CanvasTexture {
  return toTexture(drawBillboard(project));
}

export function createSignTexture(text: string): CanvasTexture {
  return toTexture(drawSign(text));
}
