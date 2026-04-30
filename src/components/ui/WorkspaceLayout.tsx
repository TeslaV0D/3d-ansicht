import { SceneCanvas } from '../scene/SceneCanvas';
import { LibraryPanel } from './LibraryPanel';
import { InspectorPanel } from './InspectorPanel';
import { useStore } from '../../store/useStore';

export function WorkspaceLayout() {
  const mode = useStore((s) => s.mode);

  return (
    <div className="workspace-layout">
      {mode === 'edit' && <LibraryPanel />}

      <main className="scene-container">
        <SceneCanvas />
      </main>

      {mode === 'edit' && <InspectorPanel />}
    </div>
  );
}
