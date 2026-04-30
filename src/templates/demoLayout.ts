import type { Asset } from '../types';
import { AssetFactory } from './AssetFactory';

function createDemoAsset(
  templateId: string,
  position: [number, number, number],
  overrides?: Partial<Asset>,
): Asset | null {
  const asset = AssetFactory.createInstance(templateId, position);
  if (!asset) return null;
  if (overrides) {
    Object.assign(asset, {
      ...overrides,
      metadata: { ...asset.metadata, ...(overrides.metadata ?? {}) },
      visual: { ...asset.visual, ...(overrides.visual ?? {}) },
    });
  }
  return asset;
}

export function generateDemoLayout(): Asset[] {
  const assets: Asset[] = [];

  function add(
    templateId: string,
    position: [number, number, number],
    overrides?: Partial<Asset>,
  ) {
    const a = createDemoAsset(templateId, position, overrides);
    if (a) assets.push(a);
  }

  // === Zonen ===
  add('zone-produktion', [-10, 0, -5], {
    metadata: { name: 'FA1-Montage', description: 'Endmontage Baureihe A', zoneType: 'Produktion', customRows: [{ key: 'Schicht', value: '3-Schicht' }, { key: 'Kapazität', value: '120 Einheiten/Tag' }], presentationNotes: 'Hauptproduktionsbereich mit 12 Montagearbeitsplätzen' },
    scale: [1.2, 1, 1.0],
  });
  add('zone-produktion', [10, 0, -5], {
    metadata: { name: 'FA2-Fertigung', description: 'CNC-Bearbeitung und Schweißen', zoneType: 'Produktion', customRows: [{ key: 'Schicht', value: '2-Schicht' }, { key: 'Maschinen', value: '6 CNC + 2 Schweißroboter' }], presentationNotes: 'Erweiterung geplant für Q3 2026' },
    scale: [1.0, 1, 1.0],
  });
  add('zone-logistik', [0, 0, 12], {
    metadata: { name: 'Logistik', description: 'Wareneingang und Versand', zoneType: 'Logistik', customRows: [{ key: 'Fläche', value: '400 m²' }, { key: 'Stellplätze', value: '24 Palettenplätze' }], presentationNotes: 'Neues WMS-System ab Juni 2026' },
    scale: [2.0, 1, 0.8],
  });
  add('zone-buero', [20, 0, 10], {
    metadata: { name: 'Büro', description: 'Verwaltung und Planung', zoneType: 'Büro', customRows: [{ key: 'Arbeitsplätze', value: '8' }], presentationNotes: '' },
    scale: [0.8, 1, 0.8],
  });
  add('zone-eingang', [-20, 0, 12], {
    metadata: { name: 'Eingang', description: 'Haupteingang Personal', zoneType: 'Eingang', customRows: [], presentationNotes: 'Zutrittskontrolle mit RFID' },
    scale: [0.6, 1, 0.6],
  });

  // === FA1 Montage - Arbeitsplätze ===
  for (let i = 0; i < 4; i++) {
    add('montagearbeitsplatz', [-14 + i * 3, 0, -7], {
      metadata: { name: `Montage AP${i + 1}`, description: 'Montagearbeitsplatz', zoneType: '', customRows: [], presentationNotes: '' },
    });
    add('montagearbeitsplatz', [-14 + i * 3, 0, -3], {
      metadata: { name: `Montage AP${i + 5}`, description: 'Montagearbeitsplatz', zoneType: '', customRows: [], presentationNotes: '' },
    });
  }

  // === FA1 Produktionslinie ===
  add('produktionslinie', [-10, 0, -5], {
    metadata: { name: 'Linie 1', description: 'Hauptfließband FA1', zoneType: '', customRows: [{ key: 'Takt', value: '45s' }], presentationNotes: '' },
  });

  // === FA2 Fertigung - Maschinen ===
  add('cnc-maschine', [7, 0, -7], {
    metadata: { name: 'CNC-1', description: 'Fräse Haas VF-2', zoneType: '', customRows: [{ key: 'Baujahr', value: '2024' }], presentationNotes: '' },
  });
  add('cnc-maschine', [10, 0, -7], {
    metadata: { name: 'CNC-2', description: 'Fräse DMG Mori', zoneType: '', customRows: [{ key: 'Baujahr', value: '2023' }], presentationNotes: '' },
  });
  add('cnc-maschine', [13, 0, -7], {
    metadata: { name: 'CNC-3', description: 'Drehbank Mazak', zoneType: '', customRows: [], presentationNotes: '' },
  });
  add('schweissanlage', [8, 0, -3], {
    metadata: { name: 'Schweißroboter 1', description: 'Automatisierte Schweißzelle', zoneType: '', customRows: [], presentationNotes: '' },
  });
  add('schweissanlage', [12, 0, -3], {
    metadata: { name: 'Schweißroboter 2', description: 'Automatisierte Schweißzelle', zoneType: '', customRows: [], presentationNotes: '' },
  });
  add('roboterarm', [10, 0, -1], {
    metadata: { name: 'Handling-Roboter', description: 'Materialhandling zwischen Stationen', zoneType: '', customRows: [], presentationNotes: '' },
  });
  add('pruefstation', [14, 0, -3], {
    metadata: { name: 'QS-Station', description: 'Endkontrolle FA2', zoneType: '', customRows: [{ key: 'Prüfrate', value: '100%' }], presentationNotes: '' },
  });

  // === Logistik - Regale und Fahrzeuge ===
  add('regalblock', [-5, 0, 10], {
    metadata: { name: 'Regal A1', description: 'Eingangsware', zoneType: '', customRows: [], presentationNotes: '' },
  });
  add('regalblock', [-5, 0, 14], {
    metadata: { name: 'Regal A2', description: 'Fertigware', zoneType: '', customRows: [], presentationNotes: '' },
  });
  add('regalblock', [2, 0, 10], {
    metadata: { name: 'Regal B1', description: 'Halbfertigprodukte', zoneType: '', customRows: [], presentationNotes: '' },
  });
  add('regalblock', [2, 0, 14], {
    metadata: { name: 'Regal B2', description: 'Verpackungsmaterial', zoneType: '', customRows: [], presentationNotes: '' },
  });
  add('gabelstapler', [-2, 0, 12], {
    metadata: { name: 'Stapler 1', description: 'Elektro-Gabelstapler', zoneType: '', customRows: [], presentationNotes: '' },
  });
  add('hubwagen', [5, 0, 12], {
    metadata: { name: 'Hubwagen', description: 'Handgabelhubwagen', zoneType: '', customRows: [], presentationNotes: '' },
  });
  add('palette', [-3, 0, 16], {
    metadata: { name: 'Palette', description: 'Bereitstellfläche', zoneType: '', customRows: [], presentationNotes: '' },
  });
  add('palette', [-1, 0, 16], {
    metadata: { name: 'Palette', description: 'Bereitstellfläche', zoneType: '', customRows: [], presentationNotes: '' },
  });
  add('container-stahl', [8, 0, 16], {
    metadata: { name: 'Versandcontainer', description: 'Ausgehende Lieferung', zoneType: '', customRows: [{ key: 'Ziel', value: 'Werk Sindelfingen' }], presentationNotes: '' },
  });

  // === Büro ===
  add('buerotisch', [18, 0, 8], {
    metadata: { name: 'Arbeitsplatz Planung', description: '', zoneType: '', customRows: [], presentationNotes: '' },
  });
  add('buerotisch', [21, 0, 8], {
    metadata: { name: 'Arbeitsplatz Logistik', description: '', zoneType: '', customRows: [], presentationNotes: '' },
  });
  add('buerostuhl', [18, 0, 9], {
    metadata: { name: 'Stuhl', description: '', zoneType: '', customRows: [], presentationNotes: '' },
  });
  add('buerostuhl', [21, 0, 9], {
    metadata: { name: 'Stuhl', description: '', zoneType: '', customRows: [], presentationNotes: '' },
  });
  add('besprechungstisch', [20, 0, 12], {
    metadata: { name: 'Besprechungstisch', description: 'Team-Meetings', zoneType: '', customRows: [], presentationNotes: '' },
  });
  add('whiteboard', [22, 0, 12], {
    rotation: [0, -90, 0],
    metadata: { name: 'Whiteboard', description: 'Kanban-Board', zoneType: '', customRows: [], presentationNotes: '' },
  });

  // === Personal ===
  add('mitarbeiter-stehend', [-12, 0, -5], {
    metadata: { name: 'Werker', description: '', zoneType: '', customRows: [], presentationNotes: '' },
  });
  add('mitarbeiter-stehend', [9, 0, -5], {
    metadata: { name: 'Werker', description: '', zoneType: '', customRows: [], presentationNotes: '' },
  });
  add('mitarbeiter-sitzend', [19, 0, 9], {
    metadata: { name: 'Planer', description: '', zoneType: '', customRows: [], presentationNotes: '' },
  });

  // === Infrastruktur ===
  add('saeule', [-5, 0, 0], {
    metadata: { name: 'Säule', description: '', zoneType: '', customRows: [], presentationNotes: '' },
  });
  add('saeule', [5, 0, 0], {
    metadata: { name: 'Säule', description: '', zoneType: '', customRows: [], presentationNotes: '' },
  });
  add('saeule', [15, 0, 0], {
    metadata: { name: 'Säule', description: '', zoneType: '', customRows: [], presentationNotes: '' },
  });
  add('feuerloescher', [-20, 0, -8], {
    metadata: { name: 'Feuerlöscher', description: 'Nächste Prüfung: 12/2026', zoneType: '', customRows: [], presentationNotes: '' },
  });

  // === Wege ===
  add('fahrweg', [0, 0, 3], {
    rotation: [0, 90, 0],
    scale: [1, 1, 3],
    metadata: { name: 'Hauptfahrweg', description: 'Zentraler Transportweg', zoneType: '', customRows: [], presentationNotes: '' },
  });
  add('fussgaengerweg', [-20, 0, 5], {
    scale: [1, 1, 1.5],
    metadata: { name: 'Fußweg', description: 'Personalweg zum Eingang', zoneType: '', customRows: [], presentationNotes: '' },
  });
  add('stopp-linie', [-20, 0, 8], {
    metadata: { name: 'Stopp', description: 'Sicherheitslinie', zoneType: '', customRows: [], presentationNotes: '' },
  });

  // === Labels ===
  add('text-label', [-10, 0, -10], {
    metadata: { name: 'FA1-Montage', description: '', zoneType: '', customRows: [], presentationNotes: '' },
    color: '#E53935',
  });
  add('text-label', [10, 0, -10], {
    metadata: { name: 'FA2-Fertigung', description: '', zoneType: '', customRows: [], presentationNotes: '' },
    color: '#E53935',
  });
  add('text-label', [0, 0, 18], {
    metadata: { name: 'Logistik & Versand', description: '', zoneType: '', customRows: [], presentationNotes: '' },
    color: '#43A047',
  });
  add('text-label', [20, 0, 14], {
    metadata: { name: 'Büro', description: '', zoneType: '', customRows: [], presentationNotes: '' },
    color: '#1E88E5',
  });
  add('nummern-label', [-20, 0, 14], {
    metadata: { name: 'E1', description: '', zoneType: '', customRows: [], presentationNotes: '' },
    color: '#FB8C00',
  });

  return assets;
}
