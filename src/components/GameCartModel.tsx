/* eslint-disable no-param-reassign */
import * as React from 'react';
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Stage } from '@react-three/drei';
import { MathUtils, TextureLoader, RepeatWrapping, MirroredRepeatWrapping, Texture, Material, BufferGeometry } from 'three';
import { Project } from '@type';
import '../../public/gltf/gamecart/gamecart.gltf';

const modelPath = './gltf/gamecart/gamecart.gltf';
const baseTexturePath = './gltf/snesCartLabel.png';
const laikaTexturePath = './gltf/LaikasJourneyLabel.png';

type GameCartModelProps = {
  selectedProject: Project;
};

export default function GameCartModel({ selectedProject }: GameCartModelProps): React.ReactElement {
  const laikaTexture: Texture = useLoader(TextureLoader, laikaTexturePath);
  laikaTexture.rotation = MathUtils.degToRad(180);
  laikaTexture.wrapS = MirroredRepeatWrapping;
  laikaTexture.wrapT = RepeatWrapping;
  const baseTexture: Texture = useLoader(TextureLoader, baseTexturePath);
  baseTexture.rotation = MathUtils.degToRad(180);
  baseTexture.wrapS = MirroredRepeatWrapping;
  baseTexture.wrapT = RepeatWrapping;
  const [currentTexture, setCurrentTexture] = React.useState<Texture | null>(baseTexture);
  // Load the texture
  React.useEffect(() => {
    if (selectedProject.title === `Laika's Journey`) {
      setCurrentTexture(laikaTexture);
    } else {
      setCurrentTexture(baseTexture);
    }
  }, [selectedProject.title, baseTexture, laikaTexture]);

  const group: React.MutableRefObject<JSX.IntrinsicAttributes> = React.useRef(null);
  const { nodes, materials } = useLoader(GLTFLoader, modelPath);
  const plasticMaterial: Material = materials.Plastic;
  const outerMeshGeometry: BufferGeometry = nodes['Cartridge-Mesh'].geometry;
  const innerMeshGeometry: BufferGeometry = nodes['Cartridge-Mesh_1'].geometry;

  return (
    <Stage makeDefault intensity={1}>
      <group ref={group} dispose={null}>
        <mesh castShadow receiveShadow position={[0, 40, 0]} geometry={outerMeshGeometry} material={plasticMaterial} />
        <mesh castShadow receiveShadow position={[0, 40, 0]} geometry={innerMeshGeometry}>
          <meshStandardMaterial map={currentTexture} />
        </mesh>
      </group>
    </Stage>
  );
}
