import { useStore } from '../../store/useStore';

export function Toolbar() {
  const mode = useStore((s) => s.mode);
  const setMode = useStore((s) => s.setMode);

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <span className="toolbar-logo">WERKPLAN</span>
        <span className="toolbar-subtitle">3D Fabrik-Visualisierung</span>
      </div>
      <div className="toolbar-center">
        <button
          className={`toolbar-btn ${mode === 'edit' ? 'active' : ''}`}
          onClick={() => setMode('edit')}
        >
          Bearbeiten
        </button>
        <button
          className={`toolbar-btn ${mode === 'presentation' ? 'active' : ''}`}
          onClick={() => setMode('presentation')}
        >
          Präsentation
        </button>
      </div>
      <div className="toolbar-right">
        <span className="toolbar-status">Phase 0 – Ready</span>
      </div>
    </div>
  );
}
