import { useEffect } from 'react';
import { useStore } from '../store/useStore';

export function useKeyboardShortcuts() {
  const setTool = useStore((s) => s.setTool);
  const setPlacingTemplateId = useStore((s) => s.setPlacingTemplateId);
  const setSelectedIds = useStore((s) => s.setSelectedIds);
  const setMode = useStore((s) => s.setMode);
  const undo = useStore((s) => s.undo);
  const redo = useStore((s) => s.redo);
  const copySelected = useStore((s) => s.copySelected);
  const paste = useStore((s) => s.paste);
  const deleteSelected = useStore((s) => s.deleteSelected);
  const duplicateSelected = useStore((s) => s.duplicateSelected);
  const assets = useStore((s) => s.assets);
  const mode = useStore((s) => s.mode);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const ctrl = e.ctrlKey || e.metaKey;

      // ESC in presentation mode: return to edit
      if (e.key === 'Escape' && mode === 'presentation') {
        setMode('edit');
        return;
      }

      // ESC in edit mode: cancel placement/selection
      if (e.key === 'Escape') {
        setTool('select');
        setPlacingTemplateId(null);
        setSelectedIds([]);
        return;
      }

      // P: toggle presentation mode
      if (e.key === 'p' || e.key === 'P') {
        if (!ctrl) {
          setMode(mode === 'edit' ? 'presentation' : 'edit');
          return;
        }
      }

      // All shortcuts below are edit-mode only
      if (mode === 'presentation') return;

      // Undo: Ctrl+Z
      if (ctrl && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }

      // Redo: Ctrl+Y or Ctrl+Shift+Z
      if ((ctrl && e.key === 'y') || (ctrl && e.key === 'z' && e.shiftKey)) {
        e.preventDefault();
        redo();
        return;
      }

      // Copy: Ctrl+C
      if (ctrl && e.key === 'c') {
        e.preventDefault();
        copySelected();
        return;
      }

      // Paste: Ctrl+V
      if (ctrl && e.key === 'v') {
        e.preventDefault();
        paste();
        return;
      }

      // Duplicate: Ctrl+D
      if (ctrl && e.key === 'd') {
        e.preventDefault();
        duplicateSelected();
        return;
      }

      // Select All: Ctrl+A
      if (ctrl && e.key === 'a') {
        e.preventDefault();
        setSelectedIds(assets.map((a) => a.id));
        return;
      }

      // Delete: Delete or Backspace
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        deleteSelected();
        return;
      }

      // Transform mode keys
      if (e.key === 'g' || e.key === 'G') {
        setTool('move');
        return;
      }
      if (e.key === 'r' || e.key === 'R') {
        setTool('rotate');
        return;
      }
      if (e.key === 's' || e.key === 'S') {
        setTool('scale');
        return;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setTool, setPlacingTemplateId, setSelectedIds, setMode, undo, redo, copySelected, paste, deleteSelected, duplicateSelected, assets, mode]);
}
