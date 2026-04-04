import * as React from 'react';
import { useGLTF, useTexture, Stage } from '@react-three/drei';
import { Texture, Material, BufferGeometry, Group, Object3D } from 'three';
import { extend, ThreeElements } from '@react-three/fiber';

extend({ Texture, Material, BufferGeometry, Group, Object3D });

const modelPath = '/gltf/lowpoly_cd/lowpolycd.gltf';
const texturePath = '/gltf/lowpoly_cd/textures/lambert2SG_baseColor.png';

useGLTF.preload(modelPath);
useTexture.preload(texturePath);

export default function CDRomModel(props: ThreeElements['group']): React.ReactElement {
  const { position } = props;
  const group = React.useRef<Group>(null);
  const { nodes, materials } = useGLTF(modelPath);
  const textureRaw = useTexture(texturePath);
  const texture = React.useMemo(() => {
    const texture = textureRaw.clone();
    texture.flipY = false;
    texture.needsUpdate = true;
    return texture;
  }, [textureRaw]);
  const meshMaterial: any = materials.lambert2SG;
  const objectNode: any = nodes.Object_2;
  const outerMeshGeometry: BufferGeometry = objectNode.geometry;

  return (
    <Stage intensity={1}>
      <group ref={group} position={position}>
        <mesh name="Object_2" rotation={[Math.PI / 2, 0, 0]} geometry={outerMeshGeometry}>
          <meshStandardMaterial {...meshMaterial} map={texture} />
        </mesh>
      </group>
    </Stage>
  );
}
