import { useState, useRef } from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import { Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import type { Asset } from '../../types';

interface AssetRendererProps {
  asset: Asset;
  isSelected: boolean;
  onPointerDown: (id: string, e: ThreeEvent<PointerEvent>) => void;
}

function AssetGeometry({ asset }: { asset: Asset }) {
  const { kind, params } = asset.geometry;

  switch (kind) {
    case 'box':
      return (
        <boxGeometry args={[params.width ?? 1, params.height ?? 1, params.depth ?? 1]} />
      );
    case 'cylinder':
      return (
        <cylinderGeometry
          args={[
            params.radiusTop ?? 0.5,
            params.radiusBottom ?? 0.5,
            params.height ?? 1,
            32,
          ]}
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

function ZoneLabel({ asset }: { asset: Asset }) {
  if (asset.type !== 'zone' || !asset.metadata.name) return null;

  return (
    <Billboard position={[asset.position[0], 1.5, asset.position[2]]} follow lockX={false} lockY={false} lockZ={false}>
      <Text
        fontSize={1.2}
        color={asset.color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#000000"
      >
        {asset.metadata.name}
      </Text>
    </Billboard>
  );
}

function TextAsset({ asset, isSelected, onPointerDown }: AssetRendererProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <Billboard
      position={[asset.position[0], asset.position[1] + 1.5, asset.position[2]]}
      follow
      lockX={false}
      lockY={false}
      lockZ={false}
    >
      <Text
        fontSize={asset.geometry.params.fontSize ?? 1}
        color={isSelected ? '#4f8ef7' : hovered ? '#6fa8ff' : asset.color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="#000000"
        onPointerDown={(e) => {
          if (asset.locked) return;
          e.stopPropagation();
          onPointerDown(asset.id, e as unknown as ThreeEvent<PointerEvent>);
        }}
        onPointerEnter={(e) => {
          if (asset.locked) return;
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerLeave={() => {
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
      >
        {asset.metadata.name || 'Label'}
      </Text>
    </Billboard>
  );
}

export function AssetRenderer({ asset, isSelected, onPointerDown }: AssetRendererProps) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  if (!asset.visible) return null;

  if (asset.geometry.kind === 'text') {
    return <TextAsset asset={asset} isSelected={isSelected} onPointerDown={onPointerDown} />;
  }

  const isZoneOrWay = asset.type === 'zone' || asset.type === 'way';
  const rotation: [number, number, number] = isZoneOrWay
    ? [
        -Math.PI / 2 + (asset.rotation[0] * Math.PI) / 180,
        (asset.rotation[1] * Math.PI) / 180,
        (asset.rotation[2] * Math.PI) / 180,
      ]
    : [
        (asset.rotation[0] * Math.PI) / 180,
        (asset.rotation[1] * Math.PI) / 180,
        (asset.rotation[2] * Math.PI) / 180,
      ];

  const yOffset = isZoneOrWay ? 0.02 : (asset.geometry.params.height ?? 1) / 2;
  const position: [number, number, number] = [
    asset.position[0],
    asset.position[1] + yOffset,
    asset.position[2],
  ];

  const emissiveColor = isSelected ? '#4f8ef7' : hovered ? '#2a5ab0' : asset.visual.emissive;
  const emissiveIntensity = isSelected ? 0.4 : hovered ? 0.2 : 0;

  return (
    <group>
      <mesh
        ref={meshRef}
        position={position}
        rotation={rotation}
        scale={asset.scale}
        castShadow={asset.visual.castShadow}
        receiveShadow={asset.visual.receiveShadow}
        onPointerDown={(e) => {
          if (asset.locked) return;
          e.stopPropagation();
          onPointerDown(asset.id, e);
        }}
        onPointerEnter={(e) => {
          if (asset.locked) return;
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerLeave={() => {
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
      >
        <AssetGeometry asset={asset} />
        <meshStandardMaterial
          color={asset.color}
          roughness={asset.visual.roughness}
          metalness={asset.visual.metalness}
          transparent={asset.visual.opacity < 1}
          opacity={asset.visual.opacity}
          emissive={emissiveColor}
          emissiveIntensity={emissiveIntensity}
          flatShading={asset.visual.flatShading}
          wireframe={asset.visual.wireframe}
          side={isZoneOrWay ? THREE.DoubleSide : THREE.FrontSide}
        />
      </mesh>
      <ZoneLabel asset={asset} />
    </group>
  );
}
