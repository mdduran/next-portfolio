import * as React from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader, MathUtils, RepeatWrapping, MirroredRepeatWrapping } from 'three';
import { useGLTF } from '@react-three/drei';

const modelPath = './gltf/gamecart.gltf';
const texturePath = './gltf/LaikasJourneyLabel.png';
export default function GameCartModel() {
  const group = React.useRef();
  const { nodes, materials } = useGLTF(modelPath);
  const texture = useLoader(TextureLoader, texturePath);
  texture.rotation = MathUtils.degToRad(180);
  texture.wrapS = MirroredRepeatWrapping;
  texture.wrapT = RepeatWrapping;

  return (
    <group ref={group} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes['Cartridge-Mesh'].geometry} material={materials.Plastic} />
      <mesh castShadow receiveShadow geometry={nodes['Cartridge-Mesh_1'].geometry}>
        <meshStandardMaterial map={texture} />
      </mesh>
    </group>
  );
}

useGLTF.preload(modelPath);
