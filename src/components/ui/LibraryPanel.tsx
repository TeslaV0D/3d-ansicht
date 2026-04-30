import { useState, useMemo } from 'react';
import { AssetFactory } from '../../templates/AssetFactory';
import { useStore } from '../../store/useStore';
import type { AssetTemplate } from '../../types';

const CATEGORY_ICONS: Record<string, string> = {
  Produktion: '🏭',
  Logistik: '📦',
  'Büro & Verwaltung': '🖥️',
  Personal: '🚶',
  Zonen: '🎨',
  'Wege & Markierungen': '🛣️',
  Primitive: '🔷',
  Infrastruktur: '🏗️',
};

function LibraryItem({ template, onSelect }: { template: AssetTemplate; onSelect: () => void }) {
  return (
    <button className="library-item" onClick={onSelect} title={template.label}>
      <span className="library-item-icon">{template.icon}</span>
      <span className="library-item-label">{template.label}</span>
    </button>
  );
}

function LibrarySection({
  category,
  templates,
  onSelectTemplate,
}: {
  category: string;
  templates: AssetTemplate[];
  onSelectTemplate: (templateId: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const icon = CATEGORY_ICONS[category] ?? '📂';

  return (
    <div className="library-section">
      <button className="library-section-header" onClick={() => setExpanded(!expanded)}>
        <span className="library-section-arrow">{expanded ? '▾' : '▸'}</span>
        <span className="library-section-icon">{icon}</span>
        <span className="library-section-title">{category}</span>
        <span className="library-section-count">{templates.length}</span>
      </button>
      {expanded && (
        <div className="library-section-items">
          {templates.map((t) => (
            <LibraryItem
              key={t.id}
              template={t}
              onSelect={() => onSelectTemplate(t.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function LibraryPanel() {
  const [searchQuery, setSearchQuery] = useState('');
  const setTool = useStore((s) => s.setTool);
  const setPlacingTemplateId = useStore((s) => s.setPlacingTemplateId);

  const categories = useMemo(() => AssetFactory.getCategories(), []);

  const filteredByCategory = useMemo(() => {
    if (!searchQuery.trim()) {
      return categories.map((cat) => ({
        category: cat,
        templates: AssetFactory.getTemplatesByCategory(cat),
      }));
    }

    const results = AssetFactory.searchTemplates(searchQuery);
    const grouped = new Map<string, AssetTemplate[]>();
    for (const t of results) {
      const existing = grouped.get(t.category) ?? [];
      existing.push(t);
      grouped.set(t.category, existing);
    }
    return Array.from(grouped.entries()).map(([category, templates]) => ({
      category,
      templates,
    }));
  }, [searchQuery, categories]);

  function handleSelectTemplate(templateId: string) {
    setPlacingTemplateId(templateId);
    setTool('place');
  }

  return (
    <aside className="panel-left">
      <div className="panel-header">Bibliothek</div>
      <div className="library-search">
        <input
          type="text"
          placeholder="🔍 Suche..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="library-search-input"
        />
      </div>
      <div className="panel-content library-content">
        {filteredByCategory.map(({ category, templates }) => (
          <LibrarySection
            key={category}
            category={category}
            templates={templates}
            onSelectTemplate={handleSelectTemplate}
          />
        ))}
        {filteredByCategory.length === 0 && (
          <p className="panel-placeholder">Keine Ergebnisse für &quot;{searchQuery}&quot;</p>
        )}
      </div>
    </aside>
  );
}
