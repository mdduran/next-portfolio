/* eslint-disable no-param-reassign */
import * as React from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { MathUtils, RepeatWrapping, MirroredRepeatWrapping, Texture, Material, BufferGeometry } from 'three';
import { useGLTF, useTexture } from '@react-three/drei';
import { Project } from '@type';
import '../../public/gltf/gamecart/gamecart.gltf';

const modelPath = './gltf/gamecart/gamecart.gltf';
const baseTexturePath = './gltf/snesCartLabel.png';
const laikaTexturePath = './gltf/LaikasJourneyLabel.png';

type GameCartModelProps = {
  selectedProject: Project;
};

export default function GameCartModel({ selectedProject }: GameCartModelProps): React.ReactElement {
  const laikaTexture: Texture = useTexture(laikaTexturePath);
  const baseTexture: Texture = useTexture(baseTexturePath);
  const [currentTexture, setCurrentTexture] = React.useState<Texture | null>(baseTexture);
  // Load the texture
  React.useEffect(() => {
    if (selectedProject.title === `Laika's Journey`) {
      setCurrentTexture(laikaTexture);
    } else {
      setCurrentTexture(baseTexture);
    }
  }, [selectedProject.title, baseTexture, laikaTexture]);

  React.useEffect(() => {
    if (currentTexture) {
      currentTexture.rotation = MathUtils.degToRad(180);
      currentTexture.wrapS = MirroredRepeatWrapping;
      currentTexture.wrapT = RepeatWrapping;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const group: React.MutableRefObject<JSX.IntrinsicAttributes> = React.useRef(null);
  const { nodes, materials } = useLoader(GLTFLoader, modelPath);
  const plasticMaterial: Material = materials.Plastic;
  const outerMeshGeometry: BufferGeometry = nodes['Cartridge-Mesh'].geometry;
  const innerMeshGeometry: BufferGeometry = nodes['Cartridge-Mesh_1'].geometry;

  return (
    <group ref={group} dispose={null}>
      <mesh castShadow receiveShadow geometry={outerMeshGeometry} material={plasticMaterial} />
      <mesh castShadow receiveShadow geometry={innerMeshGeometry}>
        <meshStandardMaterial map={currentTexture} />
      </mesh>
    </group>
  );
}

useGLTF.preload(modelPath);
