import * as React from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader, MathUtils, RepeatWrapping, MirroredRepeatWrapping, Texture, Material, BufferGeometry } from 'three';
import { useGLTF } from '@react-three/drei';

const modelPath = './gltf/lowpoly_cd/scene.gltf';
const texturePath = './gltf/lowpoly_cd/textures/lambert2SG_baseColor.png';
export default function CDRomModel(): React.ReactElement {
  const group: React.MutableRefObject<JSX.IntrinsicAttributes> = React.useRef(null);
  const { nodes, materials } = useGLTF(modelPath);
  const texture: Texture = useLoader(TextureLoader, texturePath);
  texture.rotation = MathUtils.degToRad(180);
  texture.wrapS = MirroredRepeatWrapping;
  texture.wrapT = RepeatWrapping;
  const meshMaterial: Material = materials.lambert2SG;
  const outerMeshGeometry: BufferGeometry = nodes.Object_2.geometry;

  return (
    <group ref={group} dispose={null}>
      <mesh castShadow receiveShadow geometry={outerMeshGeometry} material={meshMaterial} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial map={texture} />
      </mesh>
    </group>
  );
}

useGLTF.preload(modelPath);
