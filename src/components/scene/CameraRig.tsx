import { useRef, useEffect, useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';

export type CameraPreset = 'isometric' | 'top' | 'front' | 'side';

interface CameraPresetConfig {
  position: [number, number, number];
  target: [number, number, number];
}

const CAMERA_PRESETS: Record<CameraPreset, CameraPresetConfig> = {
  isometric: { position: [30, 25, 30], target: [0, 0, 0] },
  top: { position: [0, 60, 0.01], target: [0, 0, 0] },
  front: { position: [0, 10, 50], target: [0, 5, 0] },
  side: { position: [50, 10, 0], target: [0, 5, 0] },
};

const PRESET_KEYS: Record<string, CameraPreset> = {
  '1': 'isometric',
  '2': 'top',
  '3': 'front',
  '4': 'side',
};

export function CameraRig() {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();

  const animateToPreset = useCallback(
    (preset: CameraPreset) => {
      const config = CAMERA_PRESETS[preset];
      const controls = controlsRef.current;
      if (!controls) return;

      const startPos = camera.position.clone();
      const endPos = new THREE.Vector3(...config.position);
      const startTarget = controls.target.clone();
      const endTarget = new THREE.Vector3(...config.target);

      const duration = 600;
      const startTime = performance.now();

      function animate() {
        const elapsed = performance.now() - startTime;
        const t = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);

        camera.position.lerpVectors(startPos, endPos, eased);
        controls!.target.lerpVectors(startTarget, endTarget, eased);
        controls!.update();

        if (t < 1) {
          requestAnimationFrame(animate);
        }
      }

      animate();
    },
    [camera],
  );

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const preset = PRESET_KEYS[e.key];
      if (preset) {
        e.preventDefault();
        animateToPreset(preset);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [animateToPreset]);

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      dampingFactor={0.08}
      enableDamping
      target={[0, 0, 0]}
      minDistance={5}
      maxDistance={150}
      maxPolarAngle={Math.PI / 2 - 0.05}
    />
  );
}
