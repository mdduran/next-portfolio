import { Mesh, Material } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

declare module 'three-stdlib' {
  export interface GLTF extends GLTFLoader {
    nodes: Record<string, Mesh>;
    materials: Record<string, Material>;
  }
}
