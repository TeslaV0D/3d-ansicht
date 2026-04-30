import { create } from 'zustand';
import type { Asset, HallSettings, LightingSettings, GridSettings } from '../types';

export type AppMode = 'edit' | 'presentation';
export type Tool = 'select' | 'place' | 'move' | 'rotate' | 'scale';

interface AssetSnapshot {
  assets: Asset[];
  selectedIds: string[];
}

const MAX_HISTORY = 80;

interface AppState {
  assets: Asset[];
  selectedIds: string[];
  mode: AppMode;
  tool: Tool;
  placingTemplateId: string | null;
  clipboard: Asset[];
  hallSettings: HallSettings;
  lightingSettings: LightingSettings;
  gridSettings: GridSettings;

  // History
  past: AssetSnapshot[];
  future: AssetSnapshot[];

  setAssets: (assets: Asset[]) => void;
  addAsset: (asset: Asset) => void;
  removeAssets: (ids: string[]) => void;
  updateAsset: (id: string, updates: Partial<Asset>) => void;
  setSelectedIds: (ids: string[]) => void;
  setMode: (mode: AppMode) => void;
  setTool: (tool: Tool) => void;
  setPlacingTemplateId: (id: string | null) => void;
  setHallSettings: (settings: Partial<HallSettings>) => void;
  setLightingSettings: (settings: Partial<LightingSettings>) => void;
  setGridSettings: (settings: Partial<GridSettings>) => void;

  // History actions
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;

  // Clipboard actions
  copySelected: () => void;
  paste: () => void;
  deleteSelected: () => void;
  duplicateSelected: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  assets: [],
  selectedIds: [],
  mode: 'edit',
  tool: 'select',
  placingTemplateId: null,
  clipboard: [],
  past: [],
  future: [],

  hallSettings: {
    width: 50,
    depth: 40,
    height: 8,
    showWalls: true,
    showRoof: true,
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

  addAsset: (asset) => {
    const state = get();
    const snapshot: AssetSnapshot = { assets: [...state.assets], selectedIds: [...state.selectedIds] };
    set({
      assets: [...state.assets, asset],
      past: [...state.past.slice(-MAX_HISTORY + 1), snapshot],
      future: [],
    });
  },

  removeAssets: (ids) => set((state) => ({ assets: state.assets.filter((a) => !ids.includes(a.id)) })),

  updateAsset: (id, updates) =>
    set((state) => ({
      assets: state.assets.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    })),

  setSelectedIds: (ids) => set({ selectedIds: ids }),
  setMode: (mode) => set({ mode }),
  setTool: (tool) => set({ tool }),
  setPlacingTemplateId: (id) => set({ placingTemplateId: id }),
  setHallSettings: (settings) =>
    set((state) => ({ hallSettings: { ...state.hallSettings, ...settings } })),
  setLightingSettings: (settings) =>
    set((state) => ({ lightingSettings: { ...state.lightingSettings, ...settings } })),
  setGridSettings: (settings) =>
    set((state) => ({ gridSettings: { ...state.gridSettings, ...settings } })),

  pushHistory: () => {
    const state = get();
    const snapshot: AssetSnapshot = { assets: [...state.assets], selectedIds: [...state.selectedIds] };
    set({ past: [...state.past.slice(-MAX_HISTORY + 1), snapshot], future: [] });
  },

  undo: () => {
    const state = get();
    if (state.past.length === 0) return;
    const previous = state.past[state.past.length - 1];
    const currentSnapshot: AssetSnapshot = { assets: [...state.assets], selectedIds: [...state.selectedIds] };
    set({
      assets: previous.assets,
      selectedIds: previous.selectedIds,
      past: state.past.slice(0, -1),
      future: [currentSnapshot, ...state.future],
    });
  },

  redo: () => {
    const state = get();
    if (state.future.length === 0) return;
    const next = state.future[0];
    const currentSnapshot: AssetSnapshot = { assets: [...state.assets], selectedIds: [...state.selectedIds] };
    set({
      assets: next.assets,
      selectedIds: next.selectedIds,
      past: [...state.past, currentSnapshot],
      future: state.future.slice(1),
    });
  },

  copySelected: () => {
    const state = get();
    const selected = state.assets.filter((a) => state.selectedIds.includes(a.id));
    set({ clipboard: selected });
  },

  paste: () => {
    const state = get();
    if (state.clipboard.length === 0) return;

    const snapshot: AssetSnapshot = { assets: [...state.assets], selectedIds: [...state.selectedIds] };
    const newAssets: Asset[] = state.clipboard.map((a) => ({
      ...a,
      id: `asset-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      position: [a.position[0] + 1, a.position[1], a.position[2] + 1] as [number, number, number],
    }));

    set({
      assets: [...state.assets, ...newAssets],
      selectedIds: newAssets.map((a) => a.id),
      past: [...state.past.slice(-MAX_HISTORY + 1), snapshot],
      future: [],
    });
  },

  deleteSelected: () => {
    const state = get();
    if (state.selectedIds.length === 0) return;

    const snapshot: AssetSnapshot = { assets: [...state.assets], selectedIds: [...state.selectedIds] };
    set({
      assets: state.assets.filter((a) => !state.selectedIds.includes(a.id)),
      selectedIds: [],
      past: [...state.past.slice(-MAX_HISTORY + 1), snapshot],
      future: [],
    });
  },

  duplicateSelected: () => {
    const state = get();
    if (state.selectedIds.length === 0) return;

    const snapshot: AssetSnapshot = { assets: [...state.assets], selectedIds: [...state.selectedIds] };
    const selected = state.assets.filter((a) => state.selectedIds.includes(a.id));
    const newAssets: Asset[] = selected.map((a) => ({
      ...a,
      id: `asset-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      position: [a.position[0] + 1, a.position[1], a.position[2] + 1] as [number, number, number],
    }));

    set({
      assets: [...state.assets, ...newAssets],
      selectedIds: newAssets.map((a) => a.id),
      past: [...state.past.slice(-MAX_HISTORY + 1), snapshot],
      future: [],
    });
  },
}));
