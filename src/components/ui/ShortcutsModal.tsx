interface ShortcutsModalProps {
  onClose: () => void;
}

const SHORTCUTS = [
  { category: 'Bearbeitung', items: [
    { key: 'Ctrl/Cmd + Z', action: 'Rückgängig (Undo)' },
    { key: 'Ctrl/Cmd + Y', action: 'Wiederherstellen (Redo)' },
    { key: 'Ctrl/Cmd + C', action: 'Kopieren' },
    { key: 'Ctrl/Cmd + V', action: 'Einfügen' },
    { key: 'Ctrl/Cmd + D', action: 'Duplizieren' },
    { key: 'Ctrl/Cmd + A', action: 'Alle auswählen' },
    { key: 'Entf / Backspace', action: 'Löschen' },
  ]},
  { category: 'Transform', items: [
    { key: 'G', action: 'Bewegen-Modus' },
    { key: 'R', action: 'Rotieren-Modus' },
    { key: 'S', action: 'Skalieren-Modus' },
  ]},
  { category: 'Kamera', items: [
    { key: '1', action: 'Isometrische Ansicht' },
    { key: '2', action: 'Top-Down Ansicht' },
    { key: '3', action: 'Front-Ansicht' },
    { key: '4', action: 'Seiten-Ansicht' },
  ]},
  { category: 'Modi & Anzeige', items: [
    { key: 'P', action: 'Präsentationsmodus ein/aus' },
    { key: 'H', action: 'Performance-HUD ein/aus' },
    { key: '?', action: 'Shortcuts anzeigen' },
    { key: 'ESC', action: 'Abbrechen / Deselektieren / Bearbeiten' },
  ]},
];

export function ShortcutsModal({ onClose }: ShortcutsModalProps) {
  return (
    <div className="presentation-overlay" onClick={onClose}>
      <div className="shortcuts-modal" onClick={(e) => e.stopPropagation()}>
        <button className="presentation-info-close" onClick={onClose} title="Schließen (ESC)">
          ✕
        </button>
        <h2 className="shortcuts-modal-title">Tastenkürzel</h2>

        {SHORTCUTS.map((section) => (
          <div key={section.category} className="shortcuts-section">
            <h3 className="shortcuts-section-title">{section.category}</h3>
            <div className="shortcuts-list">
              {section.items.map((item) => (
                <div key={item.key} className="shortcuts-row">
                  <kbd className="shortcuts-key">{item.key}</kbd>
                  <span className="shortcuts-action">{item.action}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
