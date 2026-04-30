import { useMemo } from 'react';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';

function createConcreteTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#7a7a7a';
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 8000; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const gray = 100 + Math.random() * 60;
    ctx.fillStyle = `rgb(${gray},${gray},${gray})`;
    ctx.fillRect(x, y, Math.random() * 2 + 0.5, Math.random() * 2 + 0.5);
  }

  for (let i = 0; i < 20; i++) {
    ctx.strokeStyle = `rgba(60,60,60,${Math.random() * 0.15})`;
    ctx.lineWidth = Math.random() * 0.5;
    ctx.beginPath();
    ctx.moveTo(Math.random() * size, Math.random() * size);
    ctx.lineTo(Math.random() * size, Math.random() * size);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 8);
  return texture;
}

const FLOOR_COLORS: Record<string, string> = {
  concrete: '#7a7a7a',
  wood: '#a0784c',
  tile: '#c0c0c0',
  custom: '#909090',
};

export function FactoryFloor() {
  const { width, depth, floorMaterial } = useStore((s) => s.hallSettings);

  const concreteMap = useMemo(() => {
    if (floorMaterial === 'concrete') return createConcreteTexture();
    return null;
  }, [floorMaterial]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[width, depth]} />
      <meshStandardMaterial
        color={FLOOR_COLORS[floorMaterial] ?? '#7a7a7a'}
        roughness={0.85}
        metalness={0.05}
        map={concreteMap}
      />
    </mesh>
  );
}
