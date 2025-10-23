/* eslint-disable no-param-reassign */
import * as React from 'react';
import { useGLTF, useTexture, Stage } from '@react-three/drei';
import { MathUtils, RepeatWrapping, MirroredRepeatWrapping, Texture, Material, BufferGeometry, Group } from 'three';
import { Project } from '@type';
import { extend, Vector3 } from '@react-three/fiber';
import '../../public/gltf/gamecart/gamecart.gltf';

extend({ Texture, Material, BufferGeometry, Group });

const modelPath = './gltf/gamecart/gamecart.gltf';
const baseTexturePath = './webp/cartLabelBlank.webp';
const laikaTexturePath = './gltf/LaikasJourneyLabel.png';

useTexture.preload(laikaTexturePath);
useTexture.preload(baseTexturePath);
useGLTF.preload(modelPath);

type GameCartModelProps = {
  selectedProject: Project;
  position: Vector3;
};

export function GameCartModelInner({ selectedProject, position }: GameCartModelProps): React.ReactElement {
  const [laikaTextureRaw, baseTextureRaw] = useTexture([laikaTexturePath, baseTexturePath]) as Texture[];
  const laikaTexture = React.useMemo(() => {
    const laikaTexture = laikaTextureRaw.clone();
    laikaTexture.rotation = MathUtils.degToRad(180);
    laikaTexture.wrapS = MirroredRepeatWrapping;
    laikaTexture.wrapT = RepeatWrapping;
    laikaTexture.needsUpdate = true;
    return laikaTexture;
  }, [laikaTextureRaw]);
  const baseTexture = React.useMemo(() => {
    const baseTexture = baseTextureRaw.clone();
    baseTexture.rotation = MathUtils.degToRad(180);
    baseTexture.wrapS = MirroredRepeatWrapping;
    baseTexture.wrapT = RepeatWrapping;
    baseTexture.needsUpdate = true;
    return baseTexture;
  }, [baseTextureRaw]);

  const currentTexture = React.useMemo(() => {
    return selectedProject.title === `Laika's Journey` ? laikaTexture : baseTexture;
  }, [selectedProject.title, laikaTexture, baseTexture]);

  const group = React.useRef<Group>(null);
  const { nodes, materials } = useGLTF(modelPath);
  const plasticMaterial: Material = materials.Plastic;
  const cartMesh: any = nodes['Cartridge-Mesh'];
  const cartMesh1: any = nodes['Cartridge-Mesh_1'];
  const outerMeshGeometry: BufferGeometry = cartMesh.geometry;
  const innerMeshGeometry: BufferGeometry = cartMesh1.geometry;

  return (
    <Stage intensity={1}>
      <group ref={group} dispose={null} position={position}>
        <mesh castShadow receiveShadow geometry={outerMeshGeometry} material={plasticMaterial} />
        <mesh castShadow receiveShadow geometry={innerMeshGeometry}>
          <meshStandardMaterial map={currentTexture} />
        </mesh>
      </group>
    </Stage>
  );
}

function LoadingModel(): React.ReactElement {
  return (
    <mesh>
      <boxGeometry />
      <meshBasicMaterial wireframe />
    </mesh>
  );
}

export default function GameCartModel(props: GameCartModelProps): React.ReactElement {
  return (
    <React.Suspense fallback={LoadingModel()}>
      <GameCartModelInner {...props} />
    </React.Suspense>
  );
}
