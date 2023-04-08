import * as React from 'react';
import { useGLTF, useTexture, Stage } from '@react-three/drei';
import { MathUtils, RepeatWrapping, MirroredRepeatWrapping, Texture, Material, BufferGeometry, Group, Object3D } from 'three';
import { BufferGeometryNode, extend, ThreeElements } from '@react-three/fiber';

extend({ MathUtils, RepeatWrapping, MirroredRepeatWrapping, Texture, Material, BufferGeometry, Group, Object3D });

const modelPath = './gltf/lowpoly_cd/lowpolycd.gltf';
const texturePath = './gltf/lowpoly_cd/textures/lambert2SG_baseColor.png';
export default function CDRomModel(props: ThreeElements['group']): React.ReactElement {
  const { position } = props;
  const group = React.useRef<Group>(null);
  const { nodes, materials } = useGLTF(modelPath);
  const texture: Texture = useTexture(texturePath);
  texture.rotation = MathUtils.degToRad(180);
  texture.wrapS = MirroredRepeatWrapping;
  texture.wrapT = RepeatWrapping;
  const meshMaterial: Material = materials.lambert2SG;
  // TODO: Wtf is this type?!
  const objectNode: any = nodes.Object_2;
  const outerMeshGeometry: BufferGeometryNode<BufferGeometry, typeof BufferGeometry> = objectNode.geometry;

  return (
    <Stage intensity={1}>
      <group ref={group} position={position}>
        <mesh name="Object_2" rotation={[Math.PI / 2, 0, 0]}>
          <bufferGeometry {...outerMeshGeometry} />
          <meshStandardMaterial {...meshMaterial} />
        </mesh>
      </group>
    </Stage>
  );
}
