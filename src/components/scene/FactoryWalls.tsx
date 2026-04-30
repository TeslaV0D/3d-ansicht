import { useStore } from '../../store/useStore';

export function FactoryWalls() {
  const { width, depth, height, showWalls } = useStore((s) => s.hallSettings);

  if (!showWalls) return null;

  const wallColor = '#b0b0b0';
  const wallOpacity = 0.6;

  return (
    <group>
      {/* Back wall */}
      <mesh position={[0, height / 2, -depth / 2]} receiveShadow>
        <boxGeometry args={[width, height, 0.2]} />
        <meshStandardMaterial color={wallColor} roughness={0.7} transparent opacity={wallOpacity} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-width / 2, height / 2, 0]} receiveShadow>
        <boxGeometry args={[0.2, height, depth]} />
        <meshStandardMaterial color={wallColor} roughness={0.7} transparent opacity={wallOpacity} />
      </mesh>

      {/* Right wall */}
      <mesh position={[width / 2, height / 2, 0]} receiveShadow>
        <boxGeometry args={[0.2, height, depth]} />
        <meshStandardMaterial color={wallColor} roughness={0.7} transparent opacity={wallOpacity} />
      </mesh>
    </group>
  );
}
