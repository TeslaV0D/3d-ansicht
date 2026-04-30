import { useRef, useEffect, useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import { TransformControls } from '@react-three/drei';
import type { TransformControls as TransformControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';
import { toolToGizmoMode, clampPosition, clampScale, radToDeg } from '../../lib/gizmo';
import type { Asset } from '../../types';
import type { GizmoMode } from '../../lib/gizmo';

function getAssetWorldPosition(asset: Asset): [number, number, number] {
  const isZoneOrWay = asset.type === 'zone' || asset.type === 'way';
  const yOffset = isZoneOrWay ? 0.02 : (asset.geometry.params.height ?? 1) / 2;
  return [asset.position[0], asset.position[1] + yOffset, asset.position[2]];
}

function GizmoControls({ asset, gizmoMode }: { asset: Asset; gizmoMode: GizmoMode }) {
  const transformRef = useRef<TransformControlsImpl>(null);
  const groupRef = useRef<THREE.Group>(null);
  const isDragging = useRef(false);
  const hasHistory = useRef(false);
  const { gl } = useThree();

  const updateAsset = useStore((s) => s.updateAsset);
  const pushHistory = useStore((s) => s.pushHistory);

  const syncGroupToAsset = useCallback(() => {
    if (isDragging.current) return;
    const group = groupRef.current;
    if (!group) return;
    const pos = getAssetWorldPosition(asset);
    group.position.set(pos[0], pos[1], pos[2]);
    group.rotation.set(
      (asset.rotation[0] * Math.PI) / 180,
      (asset.rotation[1] * Math.PI) / 180,
      (asset.rotation[2] * Math.PI) / 180,
    );
    group.scale.set(...asset.scale);
  }, [asset]);

  useEffect(() => {
    syncGroupToAsset();
  }, [syncGroupToAsset]);

  const commitTransform = useCallback(() => {
    const group = groupRef.current;
    if (!group) return;
    const isZoneOrWay = asset.type === 'zone' || asset.type === 'way';
    const yOffset = isZoneOrWay ? 0.02 : (asset.geometry.params.height ?? 1) / 2;

    const newPosition: [number, number, number] = [
      clampPosition(group.position.x),
      clampPosition(group.position.y - yOffset),
      clampPosition(group.position.z),
    ];

    const newRotation: [number, number, number] = [
      radToDeg(group.rotation.x),
      radToDeg(group.rotation.y),
      radToDeg(group.rotation.z),
    ];

    const newScale: [number, number, number] = [
      clampScale(group.scale.x),
      clampScale(group.scale.y),
      clampScale(group.scale.z),
    ];

    updateAsset(asset.id, {
      position: newPosition,
      rotation: newRotation,
      scale: newScale,
    });
  }, [asset.id, asset.type, asset.geometry.params.height, updateAsset]);

  useEffect(() => {
    const controls = transformRef.current;
    if (!controls) return;

    function handleDraggingChanged(event: { value: boolean }) {
      isDragging.current = event.value;

      if (event.value) {
        hasHistory.current = false;
        pushHistory();
        hasHistory.current = true;
        gl.domElement.style.cursor = 'grabbing';
      } else {
        commitTransform();
        gl.domElement.style.cursor = '';
      }
    }

    const ctrl = controls as unknown as {
      addEventListener: (type: string, listener: (...args: never[]) => void) => void;
      removeEventListener: (type: string, listener: (...args: never[]) => void) => void;
    };
    ctrl.addEventListener('dragging-changed', handleDraggingChanged as never);

    return () => {
      ctrl.removeEventListener('dragging-changed', handleDraggingChanged as never);
    };
  }, [pushHistory, commitTransform, gl.domElement]);

  return (
    <TransformControls
      ref={transformRef}
      mode={gizmoMode}
      size={0.8}
    >
      <group ref={groupRef} />
    </TransformControls>
  );
}

export function TransformGizmo() {
  const tool = useStore((s) => s.tool);
  const assets = useStore((s) => s.assets);
  const selectedIds = useStore((s) => s.selectedIds);

  const selectedAsset = selectedIds.length === 1
    ? assets.find((a) => a.id === selectedIds[0])
    : null;

  if (!selectedAsset || selectedAsset.locked) return null;

  const gizmoMode = toolToGizmoMode(tool) ?? 'translate';

  return <GizmoControls key={selectedAsset.id} asset={selectedAsset} gizmoMode={gizmoMode} />;
}
