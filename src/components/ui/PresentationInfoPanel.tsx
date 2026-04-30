import { useStore } from '../../store/useStore';

interface PresentationInfoPanelProps {
  assetId: string;
  onClose: () => void;
}

export function PresentationInfoPanel({ assetId, onClose }: PresentationInfoPanelProps) {
  const asset = useStore((s) => s.assets.find((a) => a.id === assetId));

  if (!asset) return null;

  const hasCustomRows = asset.metadata.customRows.length > 0;
  const hasNotes = asset.metadata.presentationNotes.trim().length > 0;
  const hasDescription = asset.metadata.description.trim().length > 0;

  return (
    <div className="presentation-overlay" onClick={onClose}>
      <div className="presentation-info-panel" onClick={(e) => e.stopPropagation()}>
        <button className="presentation-info-close" onClick={onClose} title="Schließen (ESC)">
          ✕
        </button>

        <div className="presentation-info-header">
          <div
            className="presentation-info-color"
            style={{ backgroundColor: asset.color }}
          />
          <div>
            <h2 className="presentation-info-title">{asset.metadata.name || 'Unbenannt'}</h2>
            {asset.metadata.zoneType && (
              <span className="presentation-info-zone">{asset.metadata.zoneType}</span>
            )}
          </div>
        </div>

        {hasDescription && (
          <div className="presentation-info-section">
            <p className="presentation-info-description">{asset.metadata.description}</p>
          </div>
        )}

        {hasCustomRows && (
          <div className="presentation-info-section">
            <h3 className="presentation-info-section-title">Details</h3>
            <table className="presentation-info-table">
              <tbody>
                {asset.metadata.customRows.map((row, i) => (
                  <tr key={i}>
                    <td className="presentation-info-table-key">{row.key}</td>
                    <td className="presentation-info-table-value">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {hasNotes && (
          <div className="presentation-info-section presentation-info-notes">
            <h3 className="presentation-info-section-title">Notizen</h3>
            <p className="presentation-info-notes-text">{asset.metadata.presentationNotes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
