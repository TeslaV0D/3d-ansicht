import { describe, it, expect } from 'vitest';
import { useStore } from '../src/store/useStore';

describe('useStore', () => {
  it('has correct default hall settings', () => {
    const state = useStore.getState();
    expect(state.hallSettings.width).toBe(50);
    expect(state.hallSettings.depth).toBe(40);
    expect(state.hallSettings.height).toBe(8);
  });

  it('can add and remove assets', () => {
    const { addAsset, removeAssets } = useStore.getState();

    const testAsset = {
      id: 'test-1',
      templateId: 'box',
      type: 'primitive' as const,
      category: 'Primitive',
      position: [0, 0, 0] as [number, number, number],
      rotation: [0, 0, 0] as [number, number, number],
      scale: [1, 1, 1] as [number, number, number],
      geometry: { kind: 'box' as const, params: { width: 1, height: 1, depth: 1 } },
      color: '#ff0000',
      visual: {
        opacity: 1,
        roughness: 0.5,
        metalness: 0,
        emissive: '#000000',
        flatShading: false,
        wireframe: false,
        castShadow: true,
        receiveShadow: true,
        decals: [],
      },
      metadata: {
        name: 'Test Box',
        description: '',
        zoneType: '',
        customRows: [],
        presentationNotes: '',
      },
      locked: false,
      visible: true,
    };

    addAsset(testAsset);
    expect(useStore.getState().assets).toHaveLength(1);
    expect(useStore.getState().assets[0].id).toBe('test-1');

    removeAssets(['test-1']);
    expect(useStore.getState().assets).toHaveLength(0);
  });

  it('can switch modes', () => {
    const { setMode } = useStore.getState();
    setMode('presentation');
    expect(useStore.getState().mode).toBe('presentation');
    setMode('edit');
    expect(useStore.getState().mode).toBe('edit');
  });
});
