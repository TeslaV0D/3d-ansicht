import { create } from 'zustand';
import type { Asset, HallSettings, LightingSettings, GridSettings } from '../types';

export type AppMode = 'edit' | 'presentation';
export type Tool = 'select' | 'place' | 'move' | 'rotate' | 'scale';

interface AppState {
  assets: Asset[];
  selectedIds: string[];
  mode: AppMode;
  tool: Tool;
  hallSettings: HallSettings;
  lightingSettings: LightingSettings;
  gridSettings: GridSettings;

  setAssets: (assets: Asset[]) => void;
  addAsset: (asset: Asset) => void;
  removeAssets: (ids: string[]) => void;
  updateAsset: (id: string, updates: Partial<Asset>) => void;
  setSelectedIds: (ids: string[]) => void;
  setMode: (mode: AppMode) => void;
  setTool: (tool: Tool) => void;
  setHallSettings: (settings: Partial<HallSettings>) => void;
  setLightingSettings: (settings: Partial<LightingSettings>) => void;
  setGridSettings: (settings: Partial<GridSettings>) => void;
}

export const useStore = create<AppState>((set) => ({
  assets: [],
  selectedIds: [],
  mode: 'edit',
  tool: 'select',

  hallSettings: {
    width: 50,
    depth: 40,
    height: 8,
    showWalls: true,
    showRoof: false,
    floorMaterial: 'concrete',
    wallMaterial: 'concrete',
  },

  lightingSettings: {
    ambientIntensity: 0.35,
    directionalIntensity: 1.2,
    shadowsEnabled: true,
  },

  gridSettings: {
    visible: true,
    size: 1,
    snap: true,
    snapSize: 1,
  },

  setAssets: (assets) => set({ assets }),
  addAsset: (asset) => set((state) => ({ assets: [...state.assets, asset] })),
  removeAssets: (ids) =>
    set((state) => ({ assets: state.assets.filter((a) => !ids.includes(a.id)) })),
  updateAsset: (id, updates) =>
    set((state) => ({
      assets: state.assets.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    })),
  setSelectedIds: (ids) => set({ selectedIds: ids }),
  setMode: (mode) => set({ mode }),
  setTool: (tool) => set({ tool }),
  setHallSettings: (settings) =>
    set((state) => ({ hallSettings: { ...state.hallSettings, ...settings } })),
  setLightingSettings: (settings) =>
    set((state) => ({ lightingSettings: { ...state.lightingSettings, ...settings } })),
  setGridSettings: (settings) =>
    set((state) => ({ gridSettings: { ...state.gridSettings, ...settings } })),
}));
