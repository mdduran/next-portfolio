import * as React from 'react';
import { useGLTF, useTexture, Stage } from '@react-three/drei';
import { MathUtils, RepeatWrapping, MirroredRepeatWrapping, Texture, Material, BufferGeometry } from 'three';

const modelPath = './gltf/lowpoly_cd/lowpolycd.gltf';
const texturePath = './gltf/lowpoly_cd/textures/lambert2SG_baseColor.png';
export default function CDRomModel(props: JSX.IntrinsicElements['group']): React.ReactElement {
  const { position } = props;
  const group: React.MutableRefObject<JSX.IntrinsicAttributes> = React.useRef(null);
  const { nodes, materials } = useGLTF(modelPath);
  const texture: Texture = useTexture(texturePath);
  texture.rotation = MathUtils.degToRad(180);
  texture.wrapS = MirroredRepeatWrapping;
  texture.wrapT = RepeatWrapping;
  const meshMaterial: Material = materials.lambert2SG;
  const outerMeshGeometry: BufferGeometry = nodes.Object_2.geometry;

  return (
    <Stage makeDefault intensity={1}>
      <group ref={group} dispose={null} position={position}>
        <mesh
          name="Object_2"
          morphTargetDictionary={nodes.Object_2.morphTargetDictionary}
          morphTargetInfluences={nodes.Object_2.morphTargetInfluences}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <bufferGeometry attach="geometry" {...outerMeshGeometry} />
          <meshStandardMaterial attach="material" {...meshMaterial} />
        </mesh>
      </group>
    </Stage>
  );
}
