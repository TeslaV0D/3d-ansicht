import { useRef, useEffect, useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import { TransformControls } from '@react-three/drei';
import type { TransformControls as TransformControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';
import { toolToGizmoMode, clampPosition, clampScale, radToDeg } from '../../lib/gizmo';
import type { Asset } from '../../types';

function getAssetWorldPosition(asset: Asset): [number, number, number] {
  const isZoneOrWay = asset.type === 'zone' || asset.type === 'way';
  const yOffset = isZoneOrWay ? 0.02 : (asset.geometry.params.height ?? 1) / 2;
  return [asset.position[0], asset.position[1] + yOffset, asset.position[2]];
}

function GizmoControls({ asset, gizmoMode }: { asset: Asset; gizmoMode: 'translate' | 'rotate' | 'scale' }) {
  const transformRef = useRef<TransformControlsImpl>(null);
  const groupRef = useRef<THREE.Group>(null);
  const isDragging = useRef(false);
  const { invalidate } = useThree();

  const updateAsset = useStore((s) => s.updateAsset);
  const pushHistory = useStore((s) => s.pushHistory);

  const syncGroupToAsset = useCallback(() => {
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
  }, [asset, updateAsset]);

  useEffect(() => {
    const controls = transformRef.current;
    if (!controls) return;

    function handleDraggingChanged(event: { value: boolean }) {
      isDragging.current = event.value;
      if (event.value) {
        pushHistory();
      }
      if (!event.value) {
        commitTransform();
      }
    }

    function handleObjectChange() {
      if (isDragging.current) {
        commitTransform();
        invalidate();
      }
    }

    const ctrl = controls as unknown as {
      addEventListener: (type: string, listener: (...args: never[]) => void) => void;
      removeEventListener: (type: string, listener: (...args: never[]) => void) => void;
    };
    ctrl.addEventListener('dragging-changed', handleDraggingChanged as never);
    ctrl.addEventListener('objectChange', handleObjectChange as never);

    return () => {
      ctrl.removeEventListener('dragging-changed', handleDraggingChanged as never);
      ctrl.removeEventListener('objectChange', handleObjectChange as never);
    };
  }, [pushHistory, commitTransform, invalidate]);

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

  const gizmoMode = toolToGizmoMode(tool);
  const selectedAsset = selectedIds.length === 1
    ? assets.find((a) => a.id === selectedIds[0])
    : null;

  if (!gizmoMode || !selectedAsset || selectedAsset.locked) return null;

  return <GizmoControls key={selectedAsset.id + gizmoMode} asset={selectedAsset} gizmoMode={gizmoMode} />;
}
