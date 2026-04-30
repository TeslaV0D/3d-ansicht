import { useEffect } from 'react';
import { useStore } from '../store/useStore';

export function useKeyboardShortcuts() {
  const setTool = useStore((s) => s.setTool);
  const setPlacingTemplateId = useStore((s) => s.setPlacingTemplateId);
  const setSelectedIds = useStore((s) => s.setSelectedIds);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'Escape') {
        setTool('select');
        setPlacingTemplateId(null);
        setSelectedIds([]);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setTool, setPlacingTemplateId, setSelectedIds]);
}
