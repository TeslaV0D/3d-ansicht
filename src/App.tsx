import { useState, useCallback } from 'react';
import { Toolbar } from './components/ui/Toolbar';
import { WorkspaceLayout } from './components/ui/WorkspaceLayout';
import { PerformanceHUD } from './components/ui/PerformanceHUD';
import { ShortcutsModal } from './components/ui/ShortcutsModal';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useAutoSave } from './hooks/useAutoSave';
import { useStore } from './store/useStore';
import './styles/app.css';

function App() {
  const [showHUD, setShowHUD] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const assets = useStore((s) => s.assets);

  const handleToggleHUD = useCallback(() => setShowHUD((v) => !v), []);
  const handleShowShortcuts = useCallback(() => setShowShortcuts(true), []);
  const handleCloseShortcuts = useCallback(() => setShowShortcuts(false), []);

  const handleScreenshot = useCallback(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    const link = document.createElement('a');
    const date = new Date().toISOString().slice(0, 10);
    link.download = `werkplan_screenshot_${date}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, []);

  useKeyboardShortcuts({ onToggleHUD: handleToggleHUD, onShowShortcuts: handleShowShortcuts });
  useAutoSave();

  return (
    <div className="app">
      <Toolbar
        showHUD={showHUD}
        onToggleHUD={handleToggleHUD}
        onShowShortcuts={handleShowShortcuts}
        onScreenshot={handleScreenshot}
      />
      <WorkspaceLayout />
      {showHUD && <PerformanceHUD assetCount={assets.length} />}
      {showShortcuts && <ShortcutsModal onClose={handleCloseShortcuts} />}
    </div>
  );
}

export default App;
