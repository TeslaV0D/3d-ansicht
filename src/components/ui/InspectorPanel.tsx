import { useState, useCallback } from 'react';
import { useStore } from '../../store/useStore';
import type { Asset } from '../../types';

function parseNum(val: string): number | null {
  const n = parseFloat(val);
  return Number.isFinite(n) ? n : null;
}

function NumberInput({
  label,
  value,
  onChange,
  step = 0.1,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
}) {
  const [draft, setDraft] = useState(String(Math.round(value * 100) / 100));
  const [focused, setFocused] = useState(false);

  const displayValue = focused ? draft : String(Math.round(value * 100) / 100);

  function commit() {
    const parsed = parseNum(draft);
    if (parsed !== null) {
      onChange(parsed);
      setDraft(String(Math.round(parsed * 100) / 100));
    } else {
      setDraft(String(Math.round(value * 100) / 100));
    }
  }

  return (
    <div className="inspector-field">
      <label className="inspector-label">{label}</label>
      <input
        className="inspector-input"
        type="text"
        value={displayValue}
        step={step}
        onChange={(e) => setDraft(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          commit();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit();
        }}
      />
    </div>
  );
}

function SliderInput({
  label,
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.01,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <div className="inspector-field">
      <label className="inspector-label">
        {label} <span className="inspector-value">{Math.round(value * 100)}%</span>
      </label>
      <input
        className="inspector-slider"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </div>
  );
}

function InspectorSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="inspector-section">
      <button className="inspector-section-header" onClick={() => setOpen(!open)}>
        <span>{open ? '▾' : '▸'}</span>
        <span>{title}</span>
      </button>
      {open && <div className="inspector-section-content">{children}</div>}
    </div>
  );
}

export function InspectorPanel() {
  const selectedIds = useStore((s) => s.selectedIds);
  const assets = useStore((s) => s.assets);
  const updateAsset = useStore((s) => s.updateAsset);
  const pushHistory = useStore((s) => s.pushHistory);
  const deleteSelected = useStore((s) => s.deleteSelected);
  const duplicateSelected = useStore((s) => s.duplicateSelected);

  const selectedAsset: Asset | null =
    selectedIds.length === 1 ? (assets.find((a) => a.id === selectedIds[0]) ?? null) : null;

  const updateWithHistory = useCallback(
    (id: string, updates: Partial<Asset>) => {
      pushHistory();
      updateAsset(id, updates);
    },
    [pushHistory, updateAsset],
  );

  if (selectedIds.length === 0) {
    return (
      <aside className="panel-right">
        <div className="panel-header">Inspector</div>
        <div className="panel-content">
          <p className="panel-placeholder">Wähle ein Asset aus, um es zu bearbeiten.</p>
        </div>
      </aside>
    );
  }

  if (selectedIds.length > 1) {
    return (
      <aside className="panel-right">
        <div className="panel-header">Inspector</div>
        <div className="panel-content">
          <p className="inspector-multi-info">{selectedIds.length} Assets ausgewählt</p>
          <div className="inspector-actions">
            <button className="inspector-action-btn danger" onClick={deleteSelected}>
              Löschen
            </button>
            <button className="inspector-action-btn" onClick={duplicateSelected}>
              Duplizieren
            </button>
          </div>
        </div>
      </aside>
    );
  }

  if (!selectedAsset) return null;

  return (
    <aside className="panel-right">
      <div className="panel-header">Inspector</div>
      <div className="panel-content inspector-content">
        {/* Name */}
        <div className="inspector-name">
          <input
            className="inspector-name-input"
            value={selectedAsset.metadata.name}
            onChange={(e) =>
              updateAsset(selectedAsset.id, {
                metadata: { ...selectedAsset.metadata, name: e.target.value },
              })
            }
          />
        </div>

        {/* Transform */}
        <InspectorSection title="Transform">
          <div className="inspector-row-3">
            <NumberInput
              label="X"
              value={selectedAsset.position[0]}
              onChange={(v) =>
                updateWithHistory(selectedAsset.id, {
                  position: [v, selectedAsset.position[1], selectedAsset.position[2]],
                })
              }
            />
            <NumberInput
              label="Y"
              value={selectedAsset.position[1]}
              onChange={(v) =>
                updateWithHistory(selectedAsset.id, {
                  position: [selectedAsset.position[0], v, selectedAsset.position[2]],
                })
              }
            />
            <NumberInput
              label="Z"
              value={selectedAsset.position[2]}
              onChange={(v) =>
                updateWithHistory(selectedAsset.id, {
                  position: [selectedAsset.position[0], selectedAsset.position[1], v],
                })
              }
            />
          </div>
          <div className="inspector-row-3">
            <NumberInput
              label="Rot X"
              value={selectedAsset.rotation[0]}
              step={5}
              onChange={(v) =>
                updateWithHistory(selectedAsset.id, {
                  rotation: [v, selectedAsset.rotation[1], selectedAsset.rotation[2]],
                })
              }
            />
            <NumberInput
              label="Rot Y"
              value={selectedAsset.rotation[1]}
              step={5}
              onChange={(v) =>
                updateWithHistory(selectedAsset.id, {
                  rotation: [selectedAsset.rotation[0], v, selectedAsset.rotation[2]],
                })
              }
            />
            <NumberInput
              label="Rot Z"
              value={selectedAsset.rotation[2]}
              step={5}
              onChange={(v) =>
                updateWithHistory(selectedAsset.id, {
                  rotation: [selectedAsset.rotation[0], selectedAsset.rotation[1], v],
                })
              }
            />
          </div>
          <div className="inspector-row-3">
            <NumberInput
              label="W"
              value={selectedAsset.scale[0]}
              onChange={(v) =>
                updateWithHistory(selectedAsset.id, {
                  scale: [v, selectedAsset.scale[1], selectedAsset.scale[2]],
                })
              }
            />
            <NumberInput
              label="H"
              value={selectedAsset.scale[1]}
              onChange={(v) =>
                updateWithHistory(selectedAsset.id, {
                  scale: [selectedAsset.scale[0], v, selectedAsset.scale[2]],
                })
              }
            />
            <NumberInput
              label="T"
              value={selectedAsset.scale[2]}
              onChange={(v) =>
                updateWithHistory(selectedAsset.id, {
                  scale: [selectedAsset.scale[0], selectedAsset.scale[1], v],
                })
              }
            />
          </div>
        </InspectorSection>

        {/* Material */}
        <InspectorSection title="Material">
          <div className="inspector-field">
            <label className="inspector-label">Farbe</label>
            <input
              className="inspector-color"
              type="color"
              value={selectedAsset.color}
              onChange={(e) => updateWithHistory(selectedAsset.id, { color: e.target.value })}
            />
          </div>
          <SliderInput
            label="Deckkraft"
            value={selectedAsset.visual.opacity}
            onChange={(v) =>
              updateWithHistory(selectedAsset.id, {
                visual: { ...selectedAsset.visual, opacity: v },
              })
            }
          />
          <SliderInput
            label="Roughness"
            value={selectedAsset.visual.roughness}
            onChange={(v) =>
              updateWithHistory(selectedAsset.id, {
                visual: { ...selectedAsset.visual, roughness: v },
              })
            }
          />
          <SliderInput
            label="Metalness"
            value={selectedAsset.visual.metalness}
            onChange={(v) =>
              updateWithHistory(selectedAsset.id, {
                visual: { ...selectedAsset.visual, metalness: v },
              })
            }
          />
        </InspectorSection>

        {/* Metadata */}
        <InspectorSection title="Metadaten">
          <div className="inspector-field">
            <label className="inspector-label">Beschreibung</label>
            <textarea
              className="inspector-textarea"
              value={selectedAsset.metadata.description}
              onChange={(e) =>
                updateAsset(selectedAsset.id, {
                  metadata: { ...selectedAsset.metadata, description: e.target.value },
                })
              }
              rows={2}
            />
          </div>
          {selectedAsset.metadata.zoneType && (
            <div className="inspector-field">
              <label className="inspector-label">Zonentyp</label>
              <input
                className="inspector-input"
                value={selectedAsset.metadata.zoneType}
                onChange={(e) =>
                  updateAsset(selectedAsset.id, {
                    metadata: { ...selectedAsset.metadata, zoneType: e.target.value },
                  })
                }
              />
            </div>
          )}
        </InspectorSection>

        {/* Actions */}
        <InspectorSection title="Aktionen">
          <div className="inspector-actions">
            <button
              className="inspector-action-btn"
              onClick={() =>
                updateAsset(selectedAsset.id, { locked: !selectedAsset.locked })
              }
            >
              {selectedAsset.locked ? '🔓 Entsperren' : '🔒 Sperren'}
            </button>
            <button className="inspector-action-btn" onClick={duplicateSelected}>
              📋 Duplizieren
            </button>
            <button className="inspector-action-btn danger" onClick={deleteSelected}>
              🗑️ Löschen
            </button>
          </div>
        </InspectorSection>
      </div>
    </aside>
  );
}
