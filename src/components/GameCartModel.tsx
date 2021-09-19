import * as React from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TextureLoader, MathUtils, RepeatWrapping, MirroredRepeatWrapping, Texture, Material, Mesh, BufferGeometry } from 'three';
import { useGLTF } from '@react-three/drei';

declare module 'three-stdlib' {
  export interface GLTF extends GLTFLoader {
    nodes: Record<string, Mesh>;
    materials: Record<string, Material>;
  }
}

const modelPath = './gltf/gamecart.gltf';
const texturePath = './gltf/LaikasJourneyLabel.png';
export default function GameCartModel(): React.ReactElement {
  const group: React.MutableRefObject<JSX.IntrinsicAttributes> = React.useRef(null);
  const { nodes, materials } = useGLTF(modelPath);
  const texture: Texture = useLoader(TextureLoader, texturePath);
  texture.rotation = MathUtils.degToRad(180);
  texture.wrapS = MirroredRepeatWrapping;
  texture.wrapT = RepeatWrapping;
  const plasticMaterial: Material = materials.Plastic;
  const outerMeshGeometry: BufferGeometry = nodes['Cartridge-Mesh'].geometry;
  const innerMeshGeometry: BufferGeometry = nodes['Cartridge-Mesh_1'].geometry;

  return (
    <group ref={group} dispose={null}>
      <mesh castShadow receiveShadow geometry={outerMeshGeometry} material={plasticMaterial} />
      <mesh castShadow receiveShadow geometry={innerMeshGeometry}>
        <meshStandardMaterial map={texture} />
      </mesh>
    </group>
  );
}

useGLTF.preload(modelPath);
