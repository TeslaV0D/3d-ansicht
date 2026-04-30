import { SceneCanvas } from '../scene/SceneCanvas';

export function WorkspaceLayout() {
  return (
    <div className="workspace-layout">
      <aside className="panel-left">
        <div className="panel-header">Bibliothek</div>
        <div className="panel-content">
          <p className="panel-placeholder">Asset-Bibliothek (Phase 2)</p>
        </div>
      </aside>

      <main className="scene-container">
        <SceneCanvas />
      </main>

      <aside className="panel-right">
        <div className="panel-header">Inspector</div>
        <div className="panel-content">
          <p className="panel-placeholder">Properties (Phase 3)</p>
        </div>
      </aside>
    </div>
  );
}
