import { useRef, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';
import { AssetFactory } from '../../templates/AssetFactory';

function GhostGeometry({ templateId }: { templateId: string }) {
  const template = AssetFactory.getTemplate(templateId);
  if (!template) return null;

  const { kind, params } = template.geometry;

  switch (kind) {
    case 'box':
      return <boxGeometry args={[params.width ?? 1, params.height ?? 1, params.depth ?? 1]} />;
    case 'cylinder':
      return (
        <cylinderGeometry
          args={[params.radiusTop ?? 0.5, params.radiusBottom ?? 0.5, params.height ?? 1, 32]}
        />
      );
    case 'sphere':
      return <sphereGeometry args={[params.radius ?? 0.5, 32, 16]} />;
    case 'cone':
      return <coneGeometry args={[params.radius ?? 0.5, params.height ?? 1, 32]} />;
    case 'torus':
      return <torusGeometry args={[params.radius ?? 0.5, params.tube ?? 0.15, 16, 48]} />;
    case 'plane':
      return <planeGeometry args={[params.width ?? 2, params.height ?? 2]} />;
    default:
      return <boxGeometry args={[1, 1, 1]} />;
  }
}

export function GhostRenderer() {
  const placingTemplateId = useStore((s) => s.placingTemplateId);
  const tool = useStore((s) => s.tool);
  const gridSettings = useStore((s) => s.gridSettings);
  const addAsset = useStore((s) => s.addAsset);

  const ghostRef = useRef<THREE.Mesh>(null);
  const [ghostPosition, setGhostPosition] = useState<[number, number, number]>([0, 0, 0]);
  const [isVisible, setIsVisible] = useState(false);

  const template = placingTemplateId ? AssetFactory.getTemplate(placingTemplateId) : null;

  const snapToGrid = useCallback(
    (pos: THREE.Vector3): [number, number, number] => {
      if (gridSettings.snap) {
        const s = gridSettings.snapSize;
        return [Math.round(pos.x / s) * s, 0, Math.round(pos.z / s) * s];
      }
      return [pos.x, 0, pos.z];
    },
    [gridSettings.snap, gridSettings.snapSize],
  );

  useFrame(() => {
    if (ghostRef.current) {
      ghostRef.current.position.set(...ghostPosition);
    }
  });

  if (tool !== 'place' || !placingTemplateId || !template) return null;

  const isZoneOrWay =
    template.category === 'Zonen' || template.category === 'Wege & Markierungen';
  const yOffset = isZoneOrWay ? 0.03 : (template.geometry.params.height ?? 1) / 2;

  return (
    <>
      {/* Invisible floor plane to capture pointer events */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        visible={false}
        onPointerMove={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          const snapped = snapToGrid(e.point);
          setGhostPosition([snapped[0], yOffset, snapped[2]]);
          setIsVisible(true);
        }}
        onPointerLeave={() => setIsVisible(false)}
        onPointerDown={(e: ThreeEvent<PointerEvent>) => {
          if (e.button !== 0) return;
          e.stopPropagation();
          const snapped = snapToGrid(e.point);
          const newAsset = AssetFactory.createInstance(placingTemplateId, [
            snapped[0],
            0,
            snapped[2],
          ]);
          if (newAsset) {
            addAsset(newAsset);
          }
        }}
      >
        <planeGeometry args={[200, 200]} />
        <meshBasicMaterial />
      </mesh>

      {/* Ghost mesh */}
      {isVisible && (
        <mesh
          ref={ghostRef}
          position={ghostPosition}
          rotation={isZoneOrWay ? [-Math.PI / 2, 0, 0] : [0, 0, 0]}
          scale={template.defaultScale}
        >
          <GhostGeometry templateId={placingTemplateId} />
          <meshStandardMaterial
            color={template.defaultColor}
            transparent
            opacity={0.5}
            emissive={template.defaultColor}
            emissiveIntensity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </>
  );
}
