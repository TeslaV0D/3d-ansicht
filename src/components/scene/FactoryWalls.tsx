import { useMemo } from 'react';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';

const WALL_MATERIALS: Record<string, { color: string; roughness: number; metalness: number }> = {
  concrete: { color: '#b8b8b8', roughness: 0.8, metalness: 0.0 },
  metal: { color: '#a0a8b0', roughness: 0.4, metalness: 0.6 },
  glass: { color: '#d0e8f0', roughness: 0.1, metalness: 0.1 },
};

function RoofFrame({
  width,
  depth,
  height,
}: {
  width: number;
  depth: number;
  height: number;
}) {
  const geometry = useMemo(() => {
    const hw = width / 2;
    const hd = depth / 2;
    const points: number[] = [];

    const addEdge = (x1: number, y1: number, z1: number, x2: number, y2: number, z2: number) => {
      points.push(x1, y1, z1, x2, y2, z2);
    };

    addEdge(-hw, height, -hd, hw, height, -hd);
    addEdge(hw, height, -hd, hw, height, hd);
    addEdge(hw, height, hd, -hw, height, hd);
    addEdge(-hw, height, hd, -hw, height, -hd);

    const crossBeamCount = Math.max(1, Math.floor(width / 10));
    for (let i = 0; i <= crossBeamCount; i++) {
      const x = -hw + (i / crossBeamCount) * width;
      addEdge(x, height, -hd, x, height, hd);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    return geo;
  }, [width, depth, height]);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#606060" />
    </lineSegments>
  );
}

export function FactoryWalls() {
  const { width, depth, height, showWalls, showRoof, wallMaterial } = useStore(
    (s) => s.hallSettings,
  );

  const matProps = WALL_MATERIALS[wallMaterial] ?? WALL_MATERIALS.concrete;

  return (
    <group>
      {showWalls && (
        <>
          {/* Back wall */}
          <mesh position={[0, height / 2, -depth / 2]} receiveShadow>
            <boxGeometry args={[width, height, 0.15]} />
            <meshStandardMaterial
              color={matProps.color}
              roughness={matProps.roughness}
              metalness={matProps.metalness}
              transparent
              opacity={0.7}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Left wall */}
          <mesh position={[-width / 2, height / 2, 0]} receiveShadow>
            <boxGeometry args={[0.15, height, depth]} />
            <meshStandardMaterial
              color={matProps.color}
              roughness={matProps.roughness}
              metalness={matProps.metalness}
              transparent
              opacity={0.7}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Right wall */}
          <mesh position={[width / 2, height / 2, 0]} receiveShadow>
            <boxGeometry args={[0.15, height, depth]} />
            <meshStandardMaterial
              color={matProps.color}
              roughness={matProps.roughness}
              metalness={matProps.metalness}
              transparent
              opacity={0.7}
              side={THREE.DoubleSide}
            />
          </mesh>
        </>
      )}

      {showRoof && <RoofFrame width={width} depth={depth} height={height} />}
    </group>
  );
}
