export type GeometryKind =
  | 'box'
  | 'cylinder'
  | 'sphere'
  | 'plane'
  | 'cone'
  | 'torus'
  | 'text'
  | 'custom';

export type AssetType = 'primitive' | 'zone' | 'label' | 'model' | 'way';

export interface AssetDecal {
  textureUrl: string;
  face: 'top' | 'front' | 'left' | 'right' | 'back' | 'bottom';
  size: number;
  opacity: number;
  offsetX: number;
  offsetY: number;
  rotation: number;
}

export interface MetadataRow {
  key: string;
  value: string;
}

export interface Asset {
  id: string;
  templateId: string;
  type: AssetType;
  category: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  geometry: {
    kind: GeometryKind;
    params: Record<string, number>;
  };
  color: string;
  visual: {
    opacity: number;
    roughness: number;
    metalness: number;
    emissive: string;
    flatShading: boolean;
    wireframe: boolean;
    castShadow: boolean;
    receiveShadow: boolean;
    decals: AssetDecal[];
  };
  metadata: {
    name: string;
    description: string;
    zoneType: string;
    customRows: MetadataRow[];
    presentationNotes: string;
    modelUrl?: string;
    modelFormat?: 'glb' | 'gltf' | 'stl' | 'obj' | 'fbx';
  };
  locked: boolean;
  visible: boolean;
  groupId?: string;
}

export interface AssetTemplate {
  id: string;
  label: string;
  category: string;
  icon: string;
  isUserAsset: boolean;
  createdAt?: string;
  geometry: Asset['geometry'];
  defaultColor: string;
  defaultScale: [number, number, number];
  defaultVisual: Partial<Asset['visual']>;
  defaultMetadata: Partial<Asset['metadata']>;
  tags: string[];
}

export interface HallSettings {
  width: number;
  depth: number;
  height: number;
  showWalls: boolean;
  showRoof: boolean;
  floorMaterial: 'concrete' | 'wood' | 'tile' | 'custom';
  wallMaterial: 'concrete' | 'metal' | 'glass';
}

export interface LightingSettings {
  ambientIntensity: number;
  directionalIntensity: number;
  shadowsEnabled: boolean;
}

export interface CameraSettings {
  position: [number, number, number];
  target: [number, number, number];
}

export interface GridSettings {
  visible: boolean;
  size: number;
  snap: boolean;
  snapSize: number;
}

export interface StoredLayout {
  version: number;
  semver: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  assets: Asset[];
  customTemplates: AssetTemplate[];
  settings: {
    hall: HallSettings;
    lighting: LightingSettings;
    camera: CameraSettings;
    grid: GridSettings;
  };
}
