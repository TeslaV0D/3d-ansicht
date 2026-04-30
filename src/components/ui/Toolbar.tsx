import { useRef } from 'react';
import { useStore } from '../../store/useStore';
import { exportLayout, importLayout } from '../../hooks/useAutoSave';

export function Toolbar() {
  const mode = useStore((s) => s.mode);
  const setMode = useStore((s) => s.setMode);
  const assets = useStore((s) => s.assets);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleExport() {
    const json = exportLayout();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const date = new Date().toISOString().slice(0, 16).replace('T', '_').replace(':', '-');
    a.href = url;
    a.download = `werkplan_layout_${date}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result;
      if (typeof text === 'string') {
        importLayout(text);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

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
        <span className="toolbar-divider" />
        <button className="toolbar-btn" onClick={handleExport} title="Layout als JSON exportieren">
          💾 Export
        </button>
        <button className="toolbar-btn" onClick={handleImport} title="Layout aus JSON importieren">
          📂 Import
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>
      <div className="toolbar-right">
        <span className="toolbar-status">{assets.length} Assets</span>
      </div>
    </div>
  );
}
