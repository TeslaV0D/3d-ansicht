import { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import type { StoredLayout } from '../types';

const STORAGE_KEY = 'werkplan-layout';
const SAVE_DEBOUNCE_MS = 300;

function serializeLayout(): StoredLayout {
  const state = useStore.getState();
  return {
    version: 1,
    semver: '1.0.0',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    name: 'Hauptlayout',
    assets: state.assets,
    customTemplates: [],
    settings: {
      hall: state.hallSettings,
      lighting: state.lightingSettings,
      camera: { position: [30, 25, 30], target: [0, 0, 0] },
      grid: state.gridSettings,
    },
  };
}

function loadLayout(): StoredLayout | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as StoredLayout;
    if (!data.assets || !Array.isArray(data.assets)) return null;
    return data;
  } catch {
    return null;
  }
}

export function useAutoSave() {
  const assets = useStore((s) => s.assets);
  const hallSettings = useStore((s) => s.hallSettings);
  const gridSettings = useStore((s) => s.gridSettings);
  const setAssets = useStore((s) => s.setAssets);
  const setHallSettings = useStore((s) => s.setHallSettings);
  const setGridSettings = useStore((s) => s.setGridSettings);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadedRef = useRef(false);

  // Load on mount
  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    const layout = loadLayout();
    if (layout) {
      setAssets(layout.assets);
      if (layout.settings?.hall) setHallSettings(layout.settings.hall);
      if (layout.settings?.grid) setGridSettings(layout.settings.grid);
    }
  }, [setAssets, setHallSettings, setGridSettings]);

  // Auto-save on change
  useEffect(() => {
    if (!loadedRef.current) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      try {
        const layout = serializeLayout();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
      } catch {
        // localStorage quota exceeded — silently fail
      }
    }, SAVE_DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [assets, hallSettings, gridSettings]);
}

export function exportLayout(): string {
  const layout = serializeLayout();
  return JSON.stringify(layout, null, 2);
}

export function importLayout(json: string): boolean {
  try {
    const data = JSON.parse(json) as StoredLayout;
    if (!data.assets || !Array.isArray(data.assets)) return false;

    const state = useStore.getState();
    state.pushHistory();
    state.setAssets(data.assets);
    if (data.settings?.hall) state.setHallSettings(data.settings.hall);
    if (data.settings?.grid) state.setGridSettings(data.settings.grid);
    return true;
  } catch {
    return false;
  }
}
