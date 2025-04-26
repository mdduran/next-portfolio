/* eslint-disable no-param-reassign */
import * as React from 'react';
import { useGLTF, useTexture, Stage } from '@react-three/drei';
import { MathUtils, RepeatWrapping, MirroredRepeatWrapping, Texture, Material, BufferGeometry, Group } from 'three';
import { Project } from '@type';
import { extend, Vector3 } from '@react-three/fiber';
import '../../public/gltf/gamecart/gamecart.gltf';

extend({ Texture, Material, BufferGeometry, Group });

const modelPath = './gltf/gamecart/gamecart.gltf';
const baseTexturePath = './gltf/snesCartLabel.png';
const laikaTexturePath = './gltf/LaikasJourneyLabel.png';

type GameCartModelProps = {
  selectedProject: Project;
  position: Vector3;
};

export default function GameCartModel({ selectedProject, position }: GameCartModelProps): React.ReactElement {
  const laikaTexture: Texture = useTexture(laikaTexturePath);
  laikaTexture.rotation = MathUtils.degToRad(180);
  laikaTexture.wrapS = MirroredRepeatWrapping;
  laikaTexture.wrapT = RepeatWrapping;
  const baseTexture: Texture = useTexture(baseTexturePath);
  baseTexture.rotation = MathUtils.degToRad(180);
  baseTexture.wrapS = MirroredRepeatWrapping;
  baseTexture.wrapT = RepeatWrapping;
  const [currentTexture, setCurrentTexture] = React.useState<Texture>(baseTexture);
  // Load the texture
  React.useEffect(() => {
    if (selectedProject.title === `Laika's Journey`) {
      setCurrentTexture(laikaTexture);
    } else {
      setCurrentTexture(baseTexture);
    }
  }, [selectedProject.title, baseTexture, laikaTexture]);

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
