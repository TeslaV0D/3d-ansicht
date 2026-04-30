import { SceneCanvas } from '../scene/SceneCanvas';
import { LibraryPanel } from './LibraryPanel';
import { useStore } from '../../store/useStore';

export function WorkspaceLayout() {
  const mode = useStore((s) => s.mode);

  return (
    <div className="workspace-layout">
      {mode === 'edit' && <LibraryPanel />}

      <main className="scene-container">
        <SceneCanvas />
      </main>

      {mode === 'edit' && (
        <aside className="panel-right">
          <div className="panel-header">Inspector</div>
          <div className="panel-content">
            <p className="panel-placeholder">Properties (Phase 3)</p>
          </div>
        </aside>
      )}
    </div>
  );
}
