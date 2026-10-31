import * as React from 'react';
import { useGLTF, useTexture } from '@react-three/drei';
import { Box3, Group, Mesh, MeshStandardMaterial, Object3D, SRGBColorSpace, Texture, Vector3 } from 'three';
import type { Project } from '@type';
import { useCanvasTexture } from './three/canvasTexture';
import { createCartLabelTexture, createDiscLabelTexture, type LabelProject } from './three/labels';

const CART_PATH = '/gltf/gamecart/gamecart.gltf';
const DISC_PATH = '/gltf/lowpoly_cd/lowpolycd.gltf';
useGLTF.preload(CART_PATH);
useGLTF.preload(DISC_PATH);

// Material names in the glTF files whose texture gets replaced per project
const CART_LABEL_MATERIAL = 'Label';
const DISC_MATERIAL = 'lambert2SG';

export type ArtifactProject = LabelProject & Pick<Project, 'label'>;

type ArtifactProps = {
  project: ArtifactProject;
  // Length of the model's longest side in world units
  size?: number;
};

// Clones the model with a material swapped in, centered on the origin and scaled
// to size. turn rotates it about the vertical axis to choose which side faces front.
function useArtifactModel(scene: Object3D, materialName: string, material: MeshStandardMaterial, size: number, turn = 0): Group {
  React.useEffect(() => () => material.dispose(), [material]);
  return React.useMemo(() => {
    const model = scene.clone(true);
    model.traverse((child) => {
      if (child instanceof Mesh && child.material?.name === materialName) child.material = material;
    });
    const box = new Box3().setFromObject(model);
    const dimensions = box.getSize(new Vector3());
    model.position.sub(box.getCenter(new Vector3()));
    const wrapper = new Group();
    wrapper.add(model);
    wrapper.scale.setScalar(size / Math.max(dimensions.x, dimensions.y, dimensions.z));
    wrapper.rotation.y = turn;
    return wrapper;
  }, [scene, materialName, material, size, turn]);
}

function Cartridge({ labelMap, size }: { labelMap: Texture; size: number }): React.ReactElement {
  const { scene } = useGLTF(CART_PATH);
  const material = React.useMemo(() => new MeshStandardMaterial({ name: CART_LABEL_MATERIAL, map: labelMap, roughness: 0.7 }), [labelMap]);
  return <primitive object={useArtifactModel(scene, CART_LABEL_MATERIAL, material, size)} />;
}

function GeneratedLabelCartridge({ project, size }: Required<ArtifactProps>): React.ReactElement {
  const labelMap = useCanvasTexture(() => createCartLabelTexture(project), project.slug);
  return <Cartridge labelMap={labelMap} size={size} />;
}

// A hand-made label image laid out like public/webp/cartLabelBlank.webp
function CustomLabelCartridge({ label, size }: { label: string; size: number }): React.ReactElement {
  const loaded = useTexture(label);
  const labelMap = React.useMemo(() => {
    const texture = loaded.clone();
    texture.flipY = false;
    texture.colorSpace = SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }, [loaded]);
  return <Cartridge labelMap={labelMap} size={size} />;
}

function Disc({ project, size }: Required<ArtifactProps>): React.ReactElement {
  const { scene, materials } = useGLTF(DISC_PATH);
  const base = materials[DISC_MATERIAL] as MeshStandardMaterial;
  const map = useCanvasTexture(() => createDiscLabelTexture(project, base.map!.image), project.slug);
  const material = React.useMemo(() => {
    const disc = base.clone();
    disc.map = map;
    return disc;
  }, [base, map]);
  // The label side faces -z in the model; turn it toward the viewer
  return <primitive object={useArtifactModel(scene, DISC_MATERIAL, material, size, Math.PI)} />;
}

// The project as a physical object: a game cartridge or a software CD, labeled
// with its art. Suspends while models load.
const ProjectArtifact = ({ project, size = 1 }: ArtifactProps): React.ReactElement => {
  if (project.type === 'software') return <Disc project={project} size={size} />;
  if (project.label) return <CustomLabelCartridge label={project.label} size={size} />;
  return <GeneratedLabelCartridge project={project} size={size} />;
};

export default ProjectArtifact;
