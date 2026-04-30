import { useState } from 'react';
import { SceneCanvas } from '../scene/SceneCanvas';
import { LibraryPanel } from './LibraryPanel';
import { InspectorPanel } from './InspectorPanel';
import { PresentationInfoPanel } from './PresentationInfoPanel';
import { useStore } from '../../store/useStore';

export function WorkspaceLayout() {
  const mode = useStore((s) => s.mode);
  const [presentationAssetId, setPresentationAssetId] = useState<string | null>(null);

  return (
    <div className="workspace-layout">
      {mode === 'edit' && <LibraryPanel />}

      <main className="scene-container">
        <SceneCanvas onPresentationClick={setPresentationAssetId} />
      </main>

      {mode === 'edit' && <InspectorPanel />}

      {mode === 'presentation' && presentationAssetId && (
        <PresentationInfoPanel
          assetId={presentationAssetId}
          onClose={() => setPresentationAssetId(null)}
        />
      )}
    </div>
  );
}
