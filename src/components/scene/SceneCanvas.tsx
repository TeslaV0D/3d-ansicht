import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { FactoryFloor } from './FactoryFloor';
import { FactoryWalls } from './FactoryWalls';
import { Lighting } from './Lighting';
import { useStore } from '../../store/useStore';

export function SceneCanvas() {
  const gridSettings = useStore((s) => s.gridSettings);

  return (
    <Canvas
      shadows
      camera={{
        position: [30, 25, 30],
        fov: 50,
        near: 0.1,
        far: 500,
      }}
      style={{ background: '#1a1a2e' }}
    >
      <Lighting />
      <FactoryFloor />
      <FactoryWalls />

      {gridSettings.visible && (
        <Grid
          args={[100, 100]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#4a4a6a"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#6a6a8a"
          fadeDistance={80}
          position={[0, 0.01, 0]}
        />
      )}

      <OrbitControls
        makeDefault
        dampingFactor={0.08}
        enableDamping
        target={[0, 0, 0]}
        minDistance={5}
        maxDistance={150}
      />
    </Canvas>
  );
}
