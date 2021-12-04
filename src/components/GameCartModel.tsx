import * as React from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader, MathUtils, RepeatWrapping, MirroredRepeatWrapping, Texture, Material, BufferGeometry } from 'three';
import { useGLTF } from '@react-three/drei';
import { Project } from '@type';

const modelPath = './gltf/gamecart.gltf';
const baseTexturePath = './gltf/snesCartLabel.png';
const laikaTexturePath = './gltf/LaikasJourneyLabel.png';

type GameCartModelProps = {
  selectedProject: Project;
};

export default function GameCartModel({ selectedProject }: GameCartModelProps): React.ReactElement {
  const [currentTexturePath, setCurrentTexturePath] = React.useState(baseTexturePath);
  React.useEffect(() => {
    if (selectedProject.title === `Laika's Journey`) {
      setCurrentTexturePath(laikaTexturePath);
    } else if (currentTexturePath !== baseTexturePath) {
      setCurrentTexturePath(baseTexturePath);
    }
  }, [selectedProject.title, currentTexturePath]);

  const group: React.MutableRefObject<JSX.IntrinsicAttributes> = React.useRef(null);
  const { nodes, materials } = useGLTF(modelPath);
  const texture: Texture = useLoader(TextureLoader, currentTexturePath);
  if (texture) {
    texture.rotation = MathUtils.degToRad(180);
    texture.wrapS = MirroredRepeatWrapping;
    texture.wrapT = RepeatWrapping;
  }
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
