import { useStore } from '../../store/useStore';

export function FactoryFloor() {
  const { width, depth } = useStore((s) => s.hallSettings);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[width, depth]} />
      <meshStandardMaterial color="#8a8a8a" roughness={0.8} metalness={0.1} />
    </mesh>
  );
}
