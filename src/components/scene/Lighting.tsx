import { useStore } from '../../store/useStore';

export function Lighting() {
  const { ambientIntensity, directionalIntensity, shadowsEnabled } = useStore(
    (s) => s.lightingSettings,
  );

  return (
    <>
      <ambientLight intensity={ambientIntensity} />
      <directionalLight
        position={[20, 30, 20]}
        intensity={directionalIntensity}
        castShadow={shadowsEnabled}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={100}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      <hemisphereLight args={['#b1e1ff', '#b97a20', 0.2]} />
    </>
  );
}
