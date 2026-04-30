import { useRef } from 'react';
import { useStore } from '../../store/useStore';
import { exportLayout, importLayout } from '../../hooks/useAutoSave';
import { generateDemoLayout } from '../../templates/demoLayout';

interface ToolbarProps {
  showHUD: boolean;
  onToggleHUD: () => void;
  onShowShortcuts: () => void;
  onScreenshot: () => void;
}

export function Toolbar({ showHUD, onToggleHUD, onShowShortcuts, onScreenshot }: ToolbarProps) {
  const mode = useStore((s) => s.mode);
  const setMode = useStore((s) => s.setMode);
  const tool = useStore((s) => s.tool);
  const setTool = useStore((s) => s.setTool);
  const assets = useStore((s) => s.assets);
  const setAssets = useStore((s) => s.setAssets);
  const pushHistory = useStore((s) => s.pushHistory);
  const selectedIds = useStore((s) => s.selectedIds);
  const alignSelected = useStore((s) => s.alignSelected);
  const distributeSelected = useStore((s) => s.distributeSelected);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const multiSelected = selectedIds.length >= 2;
  const hasSelection = selectedIds.length > 0;

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

  function handleLoadDemo() {
    pushHistory();
    const demoAssets = generateDemoLayout();
    setAssets(demoAssets);
  }

  function handlePresentationToggle() {
    if (mode === 'edit') {
      setMode('presentation');
    } else {
      setMode('edit');
    }
  }

  return (
    <div className={`toolbar ${mode === 'presentation' ? 'toolbar-presentation' : ''}`}>
      <div className="toolbar-left">
        <span className="toolbar-logo">WERKPLAN</span>
        {mode === 'edit' && (
          <span className="toolbar-subtitle">3D Fabrik-Visualisierung</span>
        )}
        {mode === 'presentation' && (
          <span className="toolbar-subtitle presentation-hint">
            Präsentationsmodus — Klicke auf Assets für Details • ESC = Bearbeiten
          </span>
        )}
      </div>
      <div className="toolbar-center">
        {mode === 'edit' && (
          <>
            <button className="toolbar-btn" onClick={handleExport} title="Layout als JSON exportieren">
              💾 Export
            </button>
            <button className="toolbar-btn" onClick={handleImport} title="Layout aus JSON importieren">
              📂 Import
            </button>
            <button className="toolbar-btn" onClick={handleLoadDemo} title="Demo-Layout laden">
              🏭 Demo
            </button>
            <button className="toolbar-btn" onClick={onScreenshot} title="Screenshot als PNG exportieren">
              📷 Screenshot
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <span className="toolbar-divider" />
            {hasSelection && (
              <>
                <button
                  className={`toolbar-btn toolbar-btn-sm ${tool === 'move' ? 'active' : ''}`}
                  onClick={() => setTool('move')}
                  title="Bewegen (G)"
                >
                  ✥
                </button>
                <button
                  className={`toolbar-btn toolbar-btn-sm ${tool === 'rotate' ? 'active' : ''}`}
                  onClick={() => setTool('rotate')}
                  title="Rotieren (R)"
                >
                  ↻
                </button>
                <button
                  className={`toolbar-btn toolbar-btn-sm ${tool === 'scale' ? 'active' : ''}`}
                  onClick={() => setTool('scale')}
                  title="Skalieren (S)"
                >
                  ⇲
                </button>
                <span className="toolbar-divider" />
              </>
            )}
            {multiSelected && (
              <>
                <button className="toolbar-btn toolbar-btn-sm" onClick={() => alignSelected('x', 'min')} title="Links ausrichten">
                  ⫷
                </button>
                <button className="toolbar-btn toolbar-btn-sm" onClick={() => alignSelected('x', 'center')} title="Mitte X">
                  ⫿
                </button>
                <button className="toolbar-btn toolbar-btn-sm" onClick={() => alignSelected('x', 'max')} title="Rechts ausrichten">
                  ⫸
                </button>
                <button className="toolbar-btn toolbar-btn-sm" onClick={() => alignSelected('z', 'min')} title="Oben ausrichten">
                  ⊤
                </button>
                <button className="toolbar-btn toolbar-btn-sm" onClick={() => alignSelected('z', 'center')} title="Mitte Z">
                  ⊡
                </button>
                <button className="toolbar-btn toolbar-btn-sm" onClick={() => alignSelected('z', 'max')} title="Unten ausrichten">
                  ⊥
                </button>
                {selectedIds.length >= 3 && (
                  <>
                    <button className="toolbar-btn toolbar-btn-sm" onClick={() => distributeSelected('x')} title="Horizontal verteilen">
                      ⋯
                    </button>
                    <button className="toolbar-btn toolbar-btn-sm" onClick={() => distributeSelected('z')} title="Vertikal verteilen">
                      ⋮
                    </button>
                  </>
                )}
                <span className="toolbar-divider" />
              </>
            )}
          </>
        )}
        <button
          className={`toolbar-btn ${mode === 'presentation' ? 'active' : ''}`}
          onClick={handlePresentationToggle}
          title={mode === 'edit' ? 'Präsentationsmodus starten (P)' : 'Zurück zum Bearbeiten (ESC)'}
        >
          {mode === 'edit' ? '▶ Präsentation' : '✎ Bearbeiten'}
        </button>
      </div>
      <div className="toolbar-right">
        {mode === 'edit' && (
          <>
            <button
              className={`toolbar-btn toolbar-btn-sm ${showHUD ? 'active' : ''}`}
              onClick={onToggleHUD}
              title="Performance-HUD (H)"
            >
              📊
            </button>
            <button
              className="toolbar-btn toolbar-btn-sm"
              onClick={onShowShortcuts}
              title="Shortcuts anzeigen (?)"
            >
              ⌨
            </button>
          </>
        )}
        <span className="toolbar-status">{assets.length} Assets</span>
      </div>
    </div>
  );
}
