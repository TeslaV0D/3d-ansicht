import { Canvas } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import { Grid } from '@react-three/drei';
import { FactoryFloor } from './FactoryFloor';
import { FactoryWalls } from './FactoryWalls';
import { Lighting } from './Lighting';
import { CameraRig } from './CameraRig';
import { AssetRenderer } from './AssetRenderer';
import { GhostRenderer } from './GhostRenderer';
import { useStore } from '../../store/useStore';

interface SceneCanvasProps {
  onPresentationClick?: (assetId: string) => void;
}

export function SceneCanvas({ onPresentationClick }: SceneCanvasProps) {
  const gridSettings = useStore((s) => s.gridSettings);
  const assets = useStore((s) => s.assets);
  const selectedIds = useStore((s) => s.selectedIds);
  const setSelectedIds = useStore((s) => s.setSelectedIds);
  const tool = useStore((s) => s.tool);
  const mode = useStore((s) => s.mode);

  function handleAssetPointerDown(id: string, e: ThreeEvent<PointerEvent>) {
    if (mode === 'presentation') {
      e.stopPropagation();
      const asset = assets.find((a) => a.id === id);
      if (asset && !asset.locked) {
        onPresentationClick?.(id);
      }
      return;
    }

    if (tool === 'place') return;
    const ctrl = e.nativeEvent.ctrlKey || e.nativeEvent.metaKey;
    if (ctrl) {
      if (selectedIds.includes(id)) {
        setSelectedIds(selectedIds.filter((sid) => sid !== id));
      } else {
        setSelectedIds([...selectedIds, id]);
      }
    } else {
      setSelectedIds([id]);
    }
  }

  function handleCanvasPointerMissed() {
    if (mode === 'edit' && tool === 'select') {
      setSelectedIds([]);
    }
  }

  return (
    <Canvas
      shadows
      gl={{ preserveDrawingBuffer: true }}
      camera={{
        position: [30, 25, 30],
        fov: 50,
        near: 0.1,
        far: 500,
      }}
      style={{ background: '#1a1a2e' }}
      onPointerMissed={handleCanvasPointerMissed}
    >
      <Lighting />
      <FactoryFloor />
      <FactoryWalls />

      {assets.map((asset) => (
        <AssetRenderer
          key={asset.id}
          asset={asset}
          isSelected={mode === 'edit' && selectedIds.includes(asset.id)}
          onPointerDown={handleAssetPointerDown}
        />
      ))}

      {mode === 'edit' && <GhostRenderer />}

      {gridSettings.visible && mode === 'edit' && (
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

      <CameraRig />
    </Canvas>
  );
}
