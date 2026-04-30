# WERKPLAN – 3D Fabrik-Visualisierungstool

## Projektplan | Version 1.0 | April 2026

---

## Inhaltsverzeichnis

1. [Projektvision & Ziel](#1-projektvision--ziel)
2. [Technologie-Stack](#2-technologie-stack)
3. [Systemarchitektur](#3-systemarchitektur)
4. [Datenmodell](#4-datenmodell)
5. [Feature-Übersicht](#5-feature-%C3%BCbersicht)
6. [Phasen & Roadmap](#6-phasen--roadmap)
    - [Phase 0 – Projektsetup](#phase-0--projektsetup)
    - [Phase 1 – 3D-Szene & Kamera](#phase-1--3d-szene--kamera)
    - [Phase 2 – Asset-System & Bibliothek](#phase-2--asset-system--bibliothek)
    - [Phase 3 – Editing & Inspector](#phase-3--editing--inspector)
    - [Phase 4 – Zonen, Labels & Decals](#phase-4--zonen-labels--decals)
    - [Phase 5 – Persistenz & Export](#phase-5--persistenz--export)
    - [Phase 6 – Präsentationsmodus](#phase-6--pr%C3%A4sentationsmodus)
    - [Phase 7 – Performance & UX-Feinschliff](#phase-7--performance--ux-feinschliff)
    - [Phase 8 – Cloud & Account (Zukunft)](#phase-8--cloud--account-zukunft)
7. [UI/UX-Konzept](#7-uiux-konzept)
8. [Asset-Katalog](#8-asset-katalog)
9. [Technische Constraints & Entscheidungen](#9-technische-constraints--entscheidungen)
10. [Definition of Done](#10-definition-of-done)
11. [Erfolgsmetriken](#11-erfolgsmetriken)

---

## 1. Projektvision & Ziel

### Was ist WERKPLAN?

WERKPLAN ist ein browserbasiertes, interaktives 3D-Visualisierungstool für industrielle Fabrik- und Hallenlayouts. Der Nutzer kann ein Werk wie auf dem folgenden Referenzbild vollständig selbst aufbauen, beschriften und präsentieren — ohne Installation, ohne Backend, direkt im Browser.

**Referenz-Look:** Isometrische Fabrikhalle mit farbigen Zonen (FA1-Montage, Logistik, Büro, etc.), Maschinen, Wegen, Schildern, Personal und Beschriftungen — wie das Bosch IPB1-Bild.

### Kernziele

- **Einfache Erstellung** — Drag & Drop-Feeling, keine 3D-Kenntnisse nötig
- **Modernes Aussehen** — Saubere UI, realistisches 3D-Rendering, isometrischer Look
- **Vollständig offline** — Keine Internetverbindung erforderlich (Phase 1–7)
- **Schnell** — 60fps mit bis zu 1000+ Assets im Browser
- **Erweiterbar** — Cloud und Account-Sync als spätere Erweiterung (Phase 8)

### Zielgruppe

- Fabrikplaner und Produktionsleiter
- Logistik- und Intralogistik-Designer
- Werkstudenten und Auszubildende in Produktionsbetrieben
- Präsentationserstellende (Management, HR, Kommunikation)

---

## 2. Technologie-Stack

### Frontend

|Technologie|Version|Zweck|
|---|---|---|
|**React**|19.x|UI-Framework, State-Management|
|**TypeScript**|5.x|Typensicherheit|
|**Vite**|6.x|Build-Tool, Dev-Server|
|**Three.js**|0.184+|3D-Rendering-Engine|
|**@react-three/fiber**|9.x|React-Wrapper für Three.js|
|**@react-three/drei**|10.x|Helper-Komponenten (OrbitControls, Text, etc.)|
|**Zustand**|5.x|Globales State-Management (leichter als Redux)|
|**lz-string**|1.x|URL-Kompression für Share-Links|

### Tooling

|Tool|Zweck|
|---|---|
|**ESLint + Prettier**|Code-Qualität und Formatierung|
|**Vitest**|Unit-Tests|
|**Playwright**|E2E-Tests (optional, Phase 7)|

### Keine Backend-Abhängigkeiten in Phase 1–7

Alles läuft im Browser:

- Persistenz via `localStorage` (Layouts, Einstellungen)
- Export als `.json`-Datei (Download)
- Share via URL-Parameter (LZ-komprimiertes JSON)

---

## 3. Systemarchitektur

```
┌────────────────────────────────────────────────────────────┐
│                        WERKPLAN APP                         │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────────┐  ┌─────────────┐  │
│  │  Bibliothek  │  │   3D-Szene       │  │  Inspector  │  │
│  │  (links)     │  │   (Mitte, R3F)   │  │  (rechts)   │  │
│  └──────────────┘  └──────────────────┘  └─────────────┘  │
│                                                             │
│  ┌────────────────────────────────────────────────────┐    │
│  │                    Toolbar (oben)                   │    │
│  └────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌────────────────────────────────────────────────────┐    │
│  │              Zustand Store (global)                  │    │
│  │  assets[] | selectedIds[] | mode | history | ui     │    │
│  └────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌───────────────┐  ┌──────────────┐  ┌───────────────┐   │
│  │ localStorage  │  │  JSON-Export │  │  URL-Share    │   │
│  │ (Auto-Save)   │  │  (Download)  │  │  (lz-string)  │   │
│  └───────────────┘  └──────────────┘  └───────────────┘   │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

### Komponenten-Hierarchie

```
App.tsx
├── Toolbar.tsx
│   ├── ModeToggle.tsx
│   ├── ToolButtons.tsx
│   ├── ViewMenu.tsx
│   ├── LightingMenu.tsx
│   └── SaveMenu.tsx
│
├── WorkspaceLayout.tsx
│   ├── LibraryPanel.tsx
│   │   ├── LibrarySearch.tsx
│   │   ├── LibrarySection.tsx (anklappbar)
│   │   └── LibraryItem.tsx
│   │
│   ├── SceneCanvas.tsx (R3F Canvas)
│   │   ├── CameraRig.tsx
│   │   ├── Lighting.tsx
│   │   ├── FactoryFloor.tsx
│   │   ├── FactoryWalls.tsx
│   │   ├── ZoneRenderer.tsx
│   │   ├── AssetRenderer.tsx (× N)
│   │   ├── GhostRenderer.tsx
│   │   └── TransformGizmo.tsx
│   │
│   └── InspectorPanel.tsx
│       ├── TransformSection.tsx
│       ├── ColorSection.tsx
│       ├── MaterialSection.tsx
│       ├── MetadataSection.tsx
│       └── DecalSection.tsx
│
└── Modals/
    ├── SaveLoadModal.tsx
    ├── ExportModal.tsx
    ├── ShortcutsModal.tsx
    └── PresentationModal.tsx
```

---

## 4. Datenmodell

### Asset (Platzierte Instanz)

```typescript
interface Asset {
  id: string;                          // UUID v4
  templateId: string;                  // Verweis auf Template
  type: AssetType;                     // 'primitive' | 'zone' | 'label' | 'model' | 'way'
  category: string;                    // Bibliotheks-Kategorie

  // Transform
  position: [number, number, number];  // [x, y, z] in Metern
  rotation: [number, number, number];  // [x, y, z] in Grad
  scale: [number, number, number];     // [x, y, z] Skalierungsfaktor

  // Geometry
  geometry: {
    kind: GeometryKind;                // 'box' | 'cylinder' | 'sphere' | 'plane' | 'text' | 'custom'
    params: Record<string, number>;    // { width, height, depth, ... }
  };

  // Visual
  color: string;                       // Hex '#RRGGBB'
  visual: {
    opacity: number;                   // 0–1
    roughness: number;                 // 0–1
    metalness: number;                 // 0–1
    emissive: string;                  // Hex, default '#000000'
    flatShading: boolean;
    wireframe: boolean;
    castShadow: boolean;
    receiveShadow: boolean;
    decals: AssetDecal[];
  };

  // Metadata
  metadata: {
    name: string;
    description: string;
    zoneType: string;                  // z.B. 'Produktion', 'Logistik', 'Büro'
    customRows: MetadataRow[];         // Benutzerdefinierte Felder
    presentationNotes: string;         // Nur im Präsentationsmodus sichtbar
    modelUrl?: string;                 // Für custom GLB/STL
    modelFormat?: 'glb' | 'gltf' | 'stl' | 'obj' | 'fbx';
  };

  // State
  locked: boolean;                     // Gesperrt gegen versehentliche Bearbeitung
  visible: boolean;                    // Ein-/ausgeblendet
  groupId?: string;                    // Optionale Gruppenzugehörigkeit
}
```

### AssetTemplate (Bibliothek-Vorlage)

```typescript
interface AssetTemplate {
  id: string;
  label: string;
  category: string;
  icon: string;                        // Emoji oder SVG-Icon-Key
  isUserAsset: boolean;
  createdAt?: string;
  geometry: Asset['geometry'];
  defaultColor: string;
  defaultScale: [number, number, number];
  defaultVisual: Partial<Asset['visual']>;
  defaultMetadata: Partial<Asset['metadata']>;
  tags: string[];
}
```

### StoredLayout (localStorage / JSON-Datei)

```typescript
interface StoredLayout {
  version: number;                     // Schema-Version für Migration
  semver: string;                      // '1.0.0'
  createdAt: string;
  updatedAt: string;
  name: string;
  assets: Asset[];
  customTemplates: AssetTemplate[];
  settings: {
    hall: HallSettings;
    lighting: LightingSettings;
    camera: CameraSettings;
    grid: GridSettings;
  };
}
```

### HallSettings

```typescript
interface HallSettings {
  width: number;       // Breite in Metern (default: 50)
  depth: number;       // Tiefe in Metern (default: 40)
  height: number;      // Wandhöhe in Metern (default: 8)
  showWalls: boolean;
  showRoof: boolean;
  floorMaterial: 'concrete' | 'wood' | 'tile' | 'custom';
  wallMaterial: 'concrete' | 'metal' | 'glass';
}
```

---

## 5. Feature-Übersicht

### Kern-Features (Offline, Phase 1–7)

|Feature|Kategorie|Priorität|
|---|---|---|
|Isometrische 3D-Szene mit OrbitControls|Szene|🔴 Kritisch|
|Konfigurierbare Fabrikhalle (Breite/Länge/Höhe)|Szene|🔴 Kritisch|
|Asset-Bibliothek mit 30+ Templates|Assets|🔴 Kritisch|
|Click-to-Place Platzierung mit Ghost-Vorschau|Editing|🔴 Kritisch|
|Transform-Gizmo (Move/Rotate/Scale)|Editing|🔴 Kritisch|
|Inspector Panel (Position, Rotation, Größe, Farbe)|Editing|🔴 Kritisch|
|Undo/Redo (80 Schritte)|Editing|🔴 Kritisch|
|Copy/Paste|Editing|🔴 Kritisch|
|Mehrfachauswahl|Editing|🔴 Kritisch|
|Zonen-System (farbige Hallenbereiche)|Zonen|🔴 Kritisch|
|Text-Labels & Billboard-System|Labels|🟡 Hoch|
|Decals (Bilder auf Oberflächen)|Visual|🟡 Hoch|
|Auto-Save (localStorage)|Persistenz|🔴 Kritisch|
|JSON-Export & Import|Persistenz|🟡 Hoch|
|Edit-Modus / Präsentations-Modus|Modi|🟡 Hoch|
|Klick-Info im Präsentationsmodus|Präsentation|🟡 Hoch|
|PNG-Screenshot-Export|Export|🟡 Hoch|
|Box-Selection|Editing|🟡 Hoch|
|Alignment-Tools|Editing|🟢 Mittel|
|Asset-Suche|UX|🟢 Mittel|
|Bibliotheks-Gruppen (anklappbar)|UX|🟢 Mittel|
|Performance-HUD (FPS, Draw Calls)|Performance|🟢 Mittel|
|GLB/STL-Import|Assets|🟢 Mittel|
|Keyboard-Shortcuts|UX|🟢 Mittel|
|URL-Share (LZ-komprimiert)|Sharing|🟢 Mittel|
|Beleuchtungs-Editor|Visual|🟢 Mittel|
|Fog / Atmosphäre|Visual|🟢 Niedrig|
|Boden-Markierungen (Wege, Sicherheitszonen)|Assets|🟡 Hoch|
|GIF-Decals (animierte Texturen)|Visual|🟢 Niedrig|

### Zukünftige Features (Phase 8, Cloud)

|Feature|Abhängigkeit|
|---|---|
|Benutzer-Account (Google/GitHub OAuth)|Supabase Auth|
|Cloud-Speicherung (mehrere Layouts)|Supabase DB|
|Public Share-Link (read-only)|Supabase Storage|
|Team-Workspaces|Supabase RLS|
|Real-Time Collaboration|Supabase Realtime / Yjs|
|Layout-Versionierung|Supabase DB|

---

## 6. Phasen & Roadmap

---

### Phase 0 – Projektsetup

**Dauer:** 1–2 Tage  
**Ziel:** Lauffähige Entwicklungsumgebung

#### Aufgaben

- [ ] Vite + React + TypeScript Projekt initialisieren (`npm create vite@latest werkplan -- --template react-ts`)
- [ ] Three.js, R3F, Drei installieren
- [ ] Zustand für State-Management installieren
- [ ] ESLint + Prettier konfigurieren
- [ ] Ordnerstruktur anlegen:

```
werkplan/
├── src/
│   ├── components/
│   │   ├── scene/          # 3D-Szenen-Komponenten
│   │   ├── ui/             # UI-Panels und Controls
│   │   └── modals/         # Modale Dialoge
│   ├── store/              # Zustand Store-Definitionen
│   ├── types/              # TypeScript-Interfaces
│   ├── templates/          # Asset-Template-Definitionen
│   ├── utils/              # Hilfsfunktionen
│   ├── hooks/              # Custom React Hooks
│   └── styles/             # CSS / CSS-Module
├── public/
│   └── textures/           # Statische Texturen (Beton, etc.)
└── tests/
```

- [ ] Basis-CSS-Variablen für das Design-System definieren (Farben, Abstände, Radius)
- [ ] `npm run dev` → leere React-App unter localhost:5173 läuft

**Akzeptanzkriterium:** `npm run dev` startet ohne Fehler, `npm run build` erzeugt einen Bundle.

---

### Phase 1 – 3D-Szene & Kamera

**Dauer:** 1 Woche  
**Ziel:** Saubere, leere 3D-Fabrikhalle im Browser, navigierbar per Maus

#### 1.1 – Basis-Canvas & Kamera

**Aufwand:** ~4h

R3F Canvas mit korrekter Kamera-Konfiguration. Kamera startet auf isometrischer Sicht (45° Rotation, 35° Elevation) wie im Bosch-Referenzbild.

```typescript
// Isometrische Startposition (Beispiel)
const ISO_CAMERA_POSITION = [30, 25, 30] as const;
const ISO_CAMERA_TARGET   = [0, 0, 0]   as const;
```

- OrbitControls mit Damping (`dampingFactor: 0.08`)
- Zoom to Cursor (`zoomToCursor: true`)
- Min/Max Distance konfigurierbar
- Kamera-Presets: Isometrisch (Standard), Top, Front, Seite
- Tastenkürzel 1–4 für Kamera-Presets

**Akzeptanzkriterium:** Kamera navigierbar, startet isometrisch, Presets wechseln korrekt.

#### 1.2 – Fabrikhalle (Boden + Wände)

**Aufwand:** ~8h

Konfigurierbare Fabrikhalle bestehend aus:

- **Boden:** Plane mit Beton-Material (roughness: 0.8, leichte NormalMap-Textur oder procedurales Canvas-Muster)
- **Rückwand** (optional ein-/ausblendbar)
- **Zwei Seitenwände** (optional ein-/ausblendbar)
- **Dachrahmen** (als Linien-Geometrie, keine solide Decke)
- **Dezentes Raster** auf dem Boden (GridHelper oder custom Shader)

HallSettings konfigurierbar im Inspector:

- Breite (default: 50m), Tiefe (default: 40m), Höhe (default: 8m)
- Wände zeigen / ausblenden
- Boden-Material wechseln

Shadows: directionalLight + castShadow auf Assets, receiveShadow auf Boden.

**Akzeptanzkriterium:** Halle sieht wie eine echte Fabrikhalle aus. Wände konfigurierbar. Schatten funktionieren.

#### 1.3 – Beleuchtung

**Aufwand:** ~4h

```
Beleuchtungs-Setup:
  ambientLight:      intensity 0.35
  directionalLight:  intensity 1.2, Schatten aktiviert
  HDRI Environment:  'warehouse' (aus @react-three/drei)
```

Schatten-Qualität: Medium (1024² shadowMap), konfigurierbar über Performance-Einstellungen.

**Akzeptanzkriterium:** Szene sieht realistisch beleuchtet aus, Schatten sichtbar, keine überbelichteten Flächen.

---

### Phase 2 – Asset-System & Bibliothek

**Dauer:** 1,5 Wochen  
**Ziel:** Vollständige Asset-Bibliothek mit 30+ Templates, platzierbar per Klick

#### 2.1 – Datenmodell & Template-System

**Aufwand:** ~6h

Implementierung der TypeScript-Interfaces aus Abschnitt 4. `AssetFactory` als zentraler Service für Template-Verwaltung:

```typescript
// AssetFactory.ts
class AssetFactory {
  static getTemplates(): AssetTemplate[]
  static createInstance(templateId: string, position: Vec3): Asset
  static getCategories(): string[]
  static getTemplatesByCategory(category: string): AssetTemplate[]
}
```

**Akzeptanzkriterium:** Templates laden, Instanz erstellen funktioniert typsicher.

#### 2.2 – Asset-Renderer-Komponente

**Aufwand:** ~8h

`AssetRenderer.tsx` — universeller 3D-Renderer für alle Asset-Typen:

```
GeometryKind → Rendering:
  'box'      → <boxGeometry>
  'cylinder' → <cylinderGeometry>
  'sphere'   → <sphereGeometry>
  'plane'    → <planeGeometry> (für Zonen, Boden-Markierungen)
  'cone'     → <coneGeometry>
  'torus'    → <torusGeometry>
  'text'     → <Text> (@react-three/drei, Billboard)
  'custom'   → <useGLTF> oder <STLLoader>
```

Hover-Feedback: `onPointerEnter/Leave` (kein Flattern zwischen Submeshes).  
Selection-Highlight: leichtes Emissive + Umriss-Effekt.  
Shadow: `castShadow` und `receiveShadow` aus Asset-Daten.

**Akzeptanzkriterium:** Alle Geometrie-Typen rendern korrekt, Hover stabil, Selection sichtbar.

#### 2.3 – Bibliotheks-Panel (Links)

**Aufwand:** ~6h

Linke Sidebar mit allen Templates kategorisiert:

```
Bibliothek
├── 🔍 Suche (Filterfeld)
├── ★ Favoriten (anklappbar)
├── 🏭 Produktion (anklappbar)
├── 📦 Logistik (anklappbar)
├── 🖥️ Büro & Verwaltung (anklappbar)
├── 🚶 Personal (anklappbar)
├── 🎨 Zonen (anklappbar)
├── 🛣️ Wege & Markierungen (anklappbar)
├── 🔷 Primitive (anklappbar)
└── 📂 Eigene Assets (anklappbar, + Import-Button)
```

Klick auf Template → aktiviert Platzier-Modus.  
Kontextmenü (⋮) pro Template: Favorit, Details, Duplizieren, Löschen (nur eigene).

**Akzeptanzkriterium:** Alle Kategorien anklappbar, Suche filtert live, Kontextmenü funktioniert.

#### 2.4 – Click-to-Place & Ghost-Vorschau

**Aufwand:** ~5h

Platzier-Workflow:

```
1. Nutzer klickt Template in Bibliothek
2. Tool wechselt zu 'place'
3. Ghost-Asset folgt Maus auf Boden (halbtransparent, leicht leuchtend)
4. Grid-Snap: Position auf 1m-Raster gerundet (STRG = frei)
5. Klick auf Boden → Asset wird platziert, Ghost bleibt aktiv
6. ESC → Platzier-Modus beenden
```

Ghost: gleiche Geometrie wie Original, opacity 0.5, emissive aus Template-Farbe, kein Shadow.

**Akzeptanzkriterium:** Ghost folgt der Maus flüssig, Snap funktioniert, Platzierung korrekt.

---

### Phase 3 – Editing & Inspector

**Dauer:** 1,5 Wochen  
**Ziel:** Vollständige Bearbeitungsfunktionalität

#### 3.1 – Auswahl & Transform-Gizmo

**Aufwand:** ~8h

Auswahl über `onPointerDown` (nicht onClick, wegen OrbitControls-Kompatibilität).

```
Auswahl-Logik:
  Klick auf Asset     → Einzelauswahl
  STRG + Klick        → Mehrfachauswahl (additiv)
  Klick auf Boden     → Deselektieren
  ESC                 → Deselektieren

Transform-Gizmo (@react-three/drei TransformControls):
  G = Bewegen (translate)
  R = Rotieren (rotate)
  S = Skalieren (scale)
  STRG halten = freie Bewegung (kein Snap)
```

Während Gizmo-Drag: OrbitControls deaktiviert (kein Kamera-Konflikt).  
Globales Gizmo-Tracking: Drag funktioniert auch wenn Maus den Canvas verlässt.  
Bei Mehrfachauswahl: gemeinsames Gizmo am Mittelpunkt.

**Akzeptanzkriterium:** Auswahl stabil (keine Deselektion beim Loslassen), Gizmo-Drag flüssig, Mehrfachauswahl funktioniert.

#### 3.2 – Inspector Panel (Rechts)

**Aufwand:** ~10h

Rechte Sidebar, nur sichtbar im Edit-Modus:

```
Inspector
├── Transform
│   ├── Position X / Y / Z (Eingabefelder, validiert)
│   ├── Rotation X / Y / Z (Grad)
│   └── Größe W / H / T (Breite/Höhe/Tiefe)
├── Material
│   ├── Farbe (Custom Color Picker: HSV-Fläche + Hex-Input + Favoriten)
│   ├── Deckkraft (Slider 0–100%)
│   ├── Roughness (Slider)
│   └── Metalness (Slider)
├── Metadaten
│   ├── Name (editierbar per ✎)
│   ├── Beschreibung (editierbar)
│   ├── Zonen-/Typ (mit Autocomplete aus vorhandenen Zonen)
│   └── Benutzerdefinierte Felder (+ Hinzufügen, × Löschen)
└── Aktionen
    ├── Sperren / Entsperren (Lock-Toggle)
    ├── Duplizieren
    └── Löschen
```

Draft-State für Eingabefelder: Kein Commit bei unvollständiger Eingabe.  
`Number.isFinite()` Validierung für alle numerischen Felder.  
Bei Mehrfachauswahl: gemeinsame Felder editierbar, unterschiedliche Werte als Platzhalter.

**Akzeptanzkriterium:** Alle Inspector-Felder funktionieren, keine NaN-Werte möglich, Draft-State verhindert ungültige Commits.

#### 3.3 – Undo/Redo

**Aufwand:** ~4h

```typescript
// Zustand Store
interface HistoryState {
  past: AssetSnapshot[];    // max. 80 Einträge
  present: AssetSnapshot;
  future: AssetSnapshot[];
}

// Tastenkürzel
Ctrl/Cmd + Z        → Undo
Ctrl/Cmd + Y        → Redo
Ctrl/Cmd + Shift+Z  → Redo (alternativ)
```

Snapshot enthält: `assets[]` + `selectedIds[]`.  
Keine Undo-Einträge für reine Kameraoperationen oder Inspector-Draft-Änderungen.

**Akzeptanzkriterium:** 80 Undo-Schritte möglich, Redo nach Undo korrekt.

#### 3.4 – Copy/Paste & Delete

**Aufwand:** ~2h

```
Ctrl/Cmd + C  → Kopieren (Clipboard im Store)
Ctrl/Cmd + V  → Einfügen (leicht versetzt um +1m/+1m)
Entf / Backspace → Löschen
```

Bei Mehrfachauswahl: alle selektierten Assets gleichzeitig.

**Akzeptanzkriterium:** Copy/Paste funktioniert inkl. aller Metadaten, Offset korrekt.

#### 3.5 – Box-Selection (Rechteck-Auswahl)

**Aufwand:** ~6h

Klicken und Ziehen auf leerem Boden öffnet Auswahl-Rechteck:

```
Implementierung:
  1. HTML-Overlay-Canvas für das Selektionsrechteck (kein 3D-Overhead)
  2. Beim Loslassen: Projektion aller Asset-Bounding-Boxes auf Screen-Space
  3. Assets innerhalb des Rechtecks → selektiert
  4. STRG halten = additiv zur bestehenden Auswahl
```

**Akzeptanzkriterium:** Box-Selection selektiert korrekte Assets, STRG-Addon funktioniert.

---

### Phase 4 – Zonen, Labels & Decals

**Dauer:** 1 Woche  
**Ziel:** Farbige Hallenbereiche, 3D-Beschriftungen und Bildtexturen

#### 4.1 – Zonen-System

**Aufwand:** ~6h

Zonen sind Plane-Assets auf dem Boden mit farbiger, halbtransparenter Füllung:

```
Zone-Asset:
  geometry.kind = 'plane'
  visual.opacity = 0.45  (konfigurierbar)
  color = '#E53935'       (rot für Produktion, etc.)
  metadata.zoneType = 'Produktion'
```

Zonennamen werden automatisch als Billboard-Label in der Mitte der Zone angezeigt.  
Voreingestellte Zonentypen mit Farbvorschlägen:

- Produktion → Rot
- Logistik → Grün
- Büro → Blau
- TPM / Wartung → Lila
- Eingang → Orange
- Sicherheitszone → Gelb

**Akzeptanzkriterium:** Zonen halbtransparent, Farbe konfigurierbar, Label automatisch zentriert.

#### 4.2 – Text-Labels & Billboard-System

**Aufwand:** ~5h

Billboard-Labels aus `@react-three/drei` `<Text>`:

```
Text-Asset:
  geometry.kind = 'text'
  metadata.name = 'FA1-Montage'  → angezeigter Text

Inspector-Optionen:
  Textinhalt (Live-Update)
  Schriftgröße (10–200)
  Textfarbe
  Hintergrundfarbe (optional)
  Hintergrundopazität
  Padding / Border-Radius
  Billboard-Rotation (immer zur Kamera)
```

**Akzeptanzkriterium:** Labels immer lesbar, Stil vollständig konfigurierbar, Live-Update.

#### 4.3 – Decals (Bilder auf Oberflächen)

**Aufwand:** ~6h

Bilder (PNG, JPEG, WebP) auf Asset-Oberflächen applizieren:

```
Decal-Daten (in visual.decals[]):
  textureUrl: string     (Data-URL nach Upload)
  face: 'top'|'front'|'left'|'right'|'back'|'bottom'
  size: number           (10–200%)
  opacity: number        (0–1)
  offsetX: number
  offsetY: number
  rotation: number
```

Implementierung als separate Plane-Geometrie mit `depthTest: true`, leicht vor der Oberfläche.

**Akzeptanzkriterium:** Bilder korrekt auf Oberflächen projiziert, Größe und Position konfigurierbar.

#### 4.4 – Boden-Markierungen & Wege

**Aufwand:** ~4h

Spezielle Plane-Assets für typische Fabrik-Bodenmarkierungen:

- **Fahrweg:** Breite Plane (3m), gelb, mit gestricheltem Mittelstreifen (Canvas-Textur)
- **Fußgängerweg:** Schmale Plane (1m), weiß, Streifen
- **Sicherheitszone:** Schraffiertes Muster (schwarz/gelb, Canvas procedural)
- **Einbahnpfeil:** Plane mit Pfeil-Textur
- **Stopp-Linie:** Schmale Plane, rot

**Akzeptanzkriterium:** Alle Markierungstypen platzierbar, sehen authentisch aus.

---

### Phase 5 – Persistenz & Export

**Dauer:** 0,5 Wochen  
**Ziel:** Layouts sicher speichern, laden und teilen

#### 5.1 – Auto-Save (localStorage)

**Aufwand:** ~3h

```typescript
// Debounced Auto-Save
useEffect(() => {
  const timer = setTimeout(() => {
    localStorage.setItem('werkplan-layout', serialize(state));
  }, 300);  // 300ms Debounce
  return () => clearTimeout(timer);
}, [state.assets, state.settings]);

// Zusätzlich: Intervall-Backup alle 30s
// Bei App-Start: Layout automatisch laden
```

Layout-Schema versioniert → Migration bei Schema-Änderungen.

**Akzeptanzkriterium:** F5 → Layout wiederhergestellt, keine Datenverlust bei Crash.

#### 5.2 – Benannte Slots (Mehrere Layouts)

**Aufwand:** ~4h

```
localStorage keys:
  werkplan-slots         → SlotIndex[] (id, name, updatedAt, assetCount)
  werkplan-slot-{id}     → StoredLayout

UI:
  Toolbar "Speichern" → Auto-Slot
  Toolbar "Als Slot"  → benannter Slot (Dialog)
  Toolbar "Laden"     → Modal mit Slot-Liste
```

Pro Slot: Laden, Umbenennen, Löschen.

**Akzeptanzkriterium:** Mehrere Layouts speicherbar, wiederherstellbar.

#### 5.3 – JSON-Export & Import

**Aufwand:** ~3h

```
Export-Optionen:
  "Nur Workspace"      → assets + settings (ohne Bibliotheks-Konfiguration)
  "Komplette Konfiguration" → alles inkl. eigene Vorlagen, Gruppen, Favoriten

Import:
  Datei auswählen → Validierung → Migration → Laden
  Bei Workspace-Import: Bibliothek bleibt erhalten
```

Dateiname-Schema: `werkplan_layout_2026-04-30_14-22.json`

**Akzeptanzkriterium:** Export-JSON valide, Import mit Backward-Kompatibilität.

#### 5.4 – URL-Share (LZ-Kompression)

**Aufwand:** ~3h

```
Workflow:
  1. Layout → JSON → LZ-String → Base64
  2. URL: https://werkplan.app/?layout=<base64>
  3. Beim Öffnen: Base64 → LZ-String → JSON → Layout laden
  4. Warnung bei > 2MB Layout (URL zu lang)
```

**Akzeptanzkriterium:** Link öffnet Layout korrekt, Kompression < 80% Originalgröße.

---

### Phase 6 – Präsentationsmodus

**Dauer:** 0,5 Wochen  
**Ziel:** Sauberer Read-only-Modus für Präsentationen und Stakeholder-Demos

#### 6.1 – Modus-Trennung (Edit vs. Präsentation)

**Aufwand:** ~4h

```
Edit-Modus:        Volle Bearbeitung, Bibliothek, Inspector, Toolbar
Präsentationsmodus: Read-only, minimale UI, Kamera-Navigation, Klick-Infos

Wechsel:
  Toolbar-Button "Präsentation"
  ESC → zurück zu Edit

Im Präsentationsmodus:
  Keine Bibliothek (links ausgeblendet)
  Kein Inspector (rechts ausgeblendet)
  Nur Kamera-Steuerung bleibt aktiv
  Gesperrte Objekte und Zonen → kein Hover, kein Klick
```

**Akzeptanzkriterium:** Modus-Wechsel flüssig, keine Edit-Elemente im Präsentationsmodus.

#### 6.2 – Klick-Info-Panel (Präsentationsmodus)

**Aufwand:** ~5h

Klick auf nicht-gesperrtes Asset → zentriertes Info-Modal:

```
Info-Modal zeigt:
  Name, Beschreibung, Zonen-Typ
  Benutzerdefinierte Metadaten-Felder
  Präsentationsnotizen (aus metadata.presentationNotes)
  Optional: Decal-Bild als Preview

NICHT angezeigt:
  Position, Rotation, Skalierung
  Geometrie-Parameter
  Material-Werte
```

Schließen: X, ESC, Klick außerhalb.

**Akzeptanzkriterium:** Info korrekt, keine technischen Daten, sauber styled.

#### 6.3 – Demo-Layout "Beispielwerk"

**Aufwand:** ~4h

Fertig aufgebautes Demo-Layout im Stil des Bosch-Referenzbildes:

- Drei Produktionszonen (FA1, FA2, HM-Montage)
- Logistikbereich mit Regalen und Hubwagen
- Bürobereich
- Eingang mit Wegmarkierungen
- Schilder und Labels
- Maschinen und Arbeitsplätze

Ladbar über "Demo laden" in der Toolbar. Zeigt das volle Potential sofort.

**Akzeptanzkriterium:** Demo-Layout sieht aus wie das Referenzbild, sofort eindrucksvoll.

---

### Phase 7 – Performance & UX-Feinschliff

**Dauer:** 1 Woche  
**Ziel:** 60fps mit 1000+ Assets, professionelle UX

#### 7.1 – Performance-Optimierungen

**Aufwand:** ~8h

```
Instancing:
  Automatisch aktiviert ab 50+ gleichen Assets
  InstancedMesh für identische Geometrie + Material
  Kein UI-Eingriff nötig

Distanz-Culling:
  Assets > 100m von Kamera → nicht gerendert
  Konfigurierbar in Performance-Einstellungen

Virtualisierung:
  Bibliotheksliste > 100 Einträge → react-window

Bundle-Optimierung:
  Tree-Shaking für Three.js (nur genutzte Module)
  Lazy Loading für Loaders (GLB, STL, OBJ, FBX)
  Ziel: < 400KB gzip
```

**Akzeptanzkriterium:** 60fps mit 500 Assets, < 30fps erst ab 2000+.

#### 7.2 – Performance-HUD

**Aufwand:** ~3h

Einblendbar via Tastenkürzel oder Performance-Einstellungen:

```
HUD zeigt:
  FPS (Echtzeit)
  Draw Calls
  Geometrien-Anzahl
  JS Heap (Chrome)
  Assets in Szene
```

**Akzeptanzkriterium:** HUD korrekt, kein Performance-Impact durch HUD selbst.

#### 7.3 – Keyboard-Shortcuts & Shortcuts-Modal

**Aufwand:** ~2h

Vollständige Shortcut-Referenz:

|Aktion|Shortcut|
|---|---|
|Undo|Ctrl/Cmd + Z|
|Redo|Ctrl/Cmd + Y|
|Kopieren|Ctrl/Cmd + C|
|Einfügen|Ctrl/Cmd + V|
|Löschen|Entf / Backspace|
|Mehrfachauswahl|Ctrl/Cmd + Klick|
|Alle auswählen|Ctrl/Cmd + A|
|Bewegen|G|
|Rotieren|R|
|Skalieren|S|
|Kamera Isometrisch|1|
|Kamera Top|2|
|Kamera Front|3|
|Kamera Seite|4|
|Performance HUD|H|
|Präsentation starten|P|
|ESC|Abbrechen / Deselektieren|
|Shortcuts anzeigen|?|

**Akzeptanzkriterium:** Alle Shortcuts funktionieren, Modal vollständig.

#### 7.4 – Alignment-Tools

**Aufwand:** ~4h

Sichtbar in der Toolbar wenn 2+ Assets selektiert:

```
Links ausrichten    (X-Min)
Mitte ausrichten    (X-Mitte)
Rechts ausrichten   (X-Max)
Oben ausrichten     (Z-Min)
Mitte ausrichten    (Z-Mitte)
Unten ausrichten    (Z-Max)
Gleiche Abstände horizontal
Gleiche Abstände vertikal
```

**Akzeptanzkriterium:** Alle Ausrichtungen korrekt für Single- und Multi-Select.

#### 7.5 – PNG-Screenshot-Export

**Aufwand:** ~4h

```
Export-Workflow:
  1. Klick auf Export-Button (Kamera-Icon)
  2. Dialog: Auflösung (1x / 2x / 4x), Hintergrund (transparent / weiß / schwarz)
  3. Canvas.toDataURL('image/png') → Download
  4. Dateiname: werkplan_screenshot_2026-04-30.png

Technisch:
  gl.preserveDrawingBuffer = true  (auf R3F Canvas)
  Rendering in höherer Auflösung via DPR-Anpassung
```

**Akzeptanzkriterium:** PNG sauber, Auflösung korrekt, keine UI-Elemente im Export.

#### 7.6 – Custom GLB/STL-Import

**Aufwand:** ~6h

```
Import über + Button in "Eigene Assets":
  Formate: .glb, .gltf, .stl, .obj, .fbx
  Max. Dateigröße: 20MB pro Datei
  Mehrfach-Import möglich

Post-Processing beim Import:
  computeBoundingBox() + center()  → Ursprung zentrieren
  Auto-Scaling auf 1m max-Dim     → konsistente Startgröße
  Y-Offset so, dass Modell auf Boden sitzt

Gespeichert als Data-URL in customTemplates:
  Persistent über localStorage
  Export: Data-URL im JSON enthalten
```

**Akzeptanzkriterium:** Alle Formate ladbar, Modell zentriert und skaliert, persistent.

---

### Phase 8 – Cloud & Account (Zukunft)

**Dauer:** 4–6 Wochen (Q4 2026+)  
**Abhängigkeit:** Supabase-Projekt, Domain

> Diese Phase ist vollständig optional. Die App funktioniert ohne sie vollständig.

#### 8.1 – Supabase-Setup

- Supabase-Projekt erstellen
- Auth: Google OAuth, GitHub OAuth
- Database Schema:

```sql
CREATE TABLE layouts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users NOT NULL,
  name        TEXT NOT NULL,
  data        JSONB NOT NULL,
  is_public   BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- RLS: Nutzer sieht nur eigene Layouts
ALTER TABLE layouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own_layouts" ON layouts
  USING (auth.uid() = user_id);
```

#### 8.2 – Auth-Integration

- Login-Button in der Toolbar (rechts)
- Google/GitHub Login-Modal
- Logout
- Offline-Fallback: localStorage bleibt immer aktiv

#### 8.3 – Cloud-Speicherung

```
API-Endpunkte (via Supabase Client):
  layouts.select()      → Layouts laden
  layouts.insert()      → Neues Layout speichern
  layouts.update()      → Layout aktualisieren
  layouts.delete()      → Layout löschen
```

Sync-Strategie: Cloud hat Priorität bei Konflikt (Last-Write-Wins).

#### 8.4 – Public Share-Links

```
Layout als "öffentlich" markieren → generates share token
URL: https://werkplan.app/share/{token}
  → Öffnet im Präsentationsmodus, read-only
  → Kein Login erforderlich für Betrachter
```

#### 8.5 – Real-Time Collaboration (Optional, Low-Priority)

- Yjs CRDT-Library für konfliktfreie Mehrnutzer-Bearbeitung
- WebSocket via Supabase Realtime
- User-Presence (Cursor-Anzeige)
- Schätzung: 30–40h Zusatzaufwand

---

## 7. UI/UX-Konzept

### Layout-Struktur

```
┌─────────────────────────────────────────────────────┐
│                    TOOLBAR (48px)                    │
│  [Logo] [Mode] [Tools] ─────────────── [Save][···]  │
├──────────────┬──────────────────┬───────────────────┤
│              │                  │                   │
│  BIBLIOTHEK  │    3D-SZENE      │    INSPECTOR      │
│  (280px)     │   (flex: 1)      │    (280px)        │
│              │                  │                   │
│  Suche       │  WebGL Canvas    │  Transform        │
│  ─────────   │                  │  Material         │
│  ★ Favoriten │                  │  Metadaten        │
│  > Produktion│                  │  Aktionen         │
│  > Logistik  │                  │                   │
│  > Büro      │                  │  (nur Edit-Modus) │
│  > Zonen     │                  │                   │
│  > Wege      │                  │                   │
│  > Primitive │                  │                   │
│  > Eigene    │                  │                   │
│              │                  │                   │
└──────────────┴──────────────────┴───────────────────┘
│                  TOAST-ZEILE (unten)                 │
└─────────────────────────────────────────────────────┘
```

### Design-System

```css
/* Farbpalette */
--color-bg-primary:     #0f0f11;    /* Dunkel (App-Hintergrund) */
--color-bg-secondary:   #1a1a1e;    /* Panels */
--color-bg-tertiary:    #242428;    /* Hover, Cards */
--color-border:         rgba(255,255,255,0.08);
--color-text-primary:   #f0f0f0;
--color-text-secondary: #9999a5;
--color-accent:         #4f8ef7;    /* Blau (Auswahl, Aktionen) */
--color-accent-hover:   #3a7ae0;
--color-success:        #4caf82;
--color-warning:        #f0a050;
--color-danger:         #e05555;

/* Schrift */
--font: 'Inter', system-ui, sans-serif;

/* Abstände */
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
```

### Zonen-Farb-Defaults

|Zonentyp|Farbe|
|---|---|
|Produktion|`#E53935` (Rot)|
|Logistik|`#43A047` (Grün)|
|Büro / Verwaltung|`#1E88E5` (Blau)|
|TPM / Wartung|`#8E24AA` (Lila)|
|Eingang / Ausgang|`#FB8C00` (Orange)|
|Sicherheitszone|`#F9A825` (Gelb)|
|Sozialer Bereich|`#00ACC1` (Türkis)|

---

## 8. Asset-Katalog

### Kategorie: Produktion

|Asset|Geometrie|Beschreibung|
|---|---|---|
|Montagearbeitsplatz|Box (2.0×0.9×0.7m)|Arbeitstisch mit Bildschirm-Andeutung|
|Produktionslinie|Box (6.0×1.2×0.8m)|Langes Fließband|
|CNC-Maschine|Box (1.5×1.8×1.5m)|Kompaktmaschine|
|Roboterarm|Cylinder + Box|Stilisierter Industrieroboter|
|Prüfstation|Box (1.0×1.5×0.8m)|Qualitätsprüfungs-Arbeitsplatz|
|Schweißanlage|Box (1.2×2.0×1.2m)|Mit Funken-Decal|
|Montagebock|Box (0.8×0.6×0.8m)|Kleines Tischelement|

### Kategorie: Logistik

|Asset|Geometrie|Beschreibung|
|---|---|---|
|Regalblock|Box (4.0×2.5×1.0m)|Hoches Lagerregal|
|Palette|Box (1.2×0.15×0.8m)|Europalette|
|Kiste (klein)|Box (0.4×0.3×0.4m)|Transportbox|
|Kiste (groß)|Box (1.0×0.8×0.8m)|Großer Behälter|
|Gabelstapler|L-Silhouette|Stilisiert aus Primitiven|
|Hubwagen|Box + Zylinder|Handgabelhubwagen|
|Rollcontainer|Box (0.6×1.0×0.4m)|Versorgungscontainer|
|Container (Stahl)|Box (6.0×2.6×2.4m)|ISO-Seecontainer|

### Kategorie: Büro & Verwaltung

|Asset|Geometrie|Beschreibung|
|---|---|---|
|Bürotisch|Box (1.6×0.75×0.8m)|Einzeltisch|
|Bürostuhl|Cylinder + Box|Stilisierter Stuhl|
|Schrank|Box (1.0×2.0×0.5m)|Aktenschrank|
|Besprechungstisch|Box (2.4×0.75×1.2m)|Konferenztisch|
|Whiteboard|Plane (1.8×1.2m)|Wandtafel|
|PC-Arbeitsplatz|Box-Gruppe|Tisch + Monitor|

### Kategorie: Personal

|Asset|Geometrie|Beschreibung|
|---|---|---|
|Mitarbeiter (stehend)|Cylinder + Sphere|Stilisierte Person|
|Mitarbeiter (sitzend)|Cylinder + Sphere|Sitzende Person|
|Personengruppe|3× Cylinder+Sphere|Gruppe von 3 Personen|

### Kategorie: Infrastruktur

|Asset|Geometrie|Beschreibung|
|---|---|---|
|Säule|Cylinder (0.3×6m)|Tragsäule|
|Wand-Segment|Box (3.0×3.5×0.2m)|Innen-Trennwand|
|Tür|Plane (1.0×2.2m)|Tür mit Rahmen|
|Fenster|Plane (1.5×1.5m)|Glasfenster|
|WC-Bereich|Box + Schilder|Sanitärbereich|
|Eingang-Schleuse|Box (2.0×2.5×1.0m)|Drehkreuz / Eingang|
|Feuerlöscher|Cylinder (0.15×0.6m)|Sicherheitsausrüstung|

### Kategorie: Zonen (Plane-Assets)

|Asset|Default-Farbe|Beschreibung|
|---|---|---|
|Zone: Produktion|Rot #E53935, 45%|Produktionsbereich|
|Zone: Logistik|Grün #43A047, 45%|Lager- und Transportbereich|
|Zone: Büro|Blau #1E88E5, 45%|Bürofläche|
|Zone: TPM|Lila #8E24AA, 45%|Wartungsbereich|
|Zone: Eingang|Orange #FB8C00, 45%|Eingangsbereich|
|Zone: Sicherheit|Gelb #F9A825, 45%|Sicherheitsabstand|

### Kategorie: Wege & Markierungen

|Asset|Beschreibung|
|---|---|
|Fahrweg (breit)|3m Plane, gelb, gestrichelt|
|Fußgängerweg|1m Plane, weiß|
|Sicherheitsmarkierung|Schraffiert schwarz/gelb|
|Pfeil (Einbahn)|Plane mit Pfeil-Overlay|
|Stopp-Linie|Schmale rote Plane|

### Kategorie: Schilder & Labels

|Asset|Beschreibung|
|---|---|
|Zonenbezeichnung|Billboard-Text mit farbigem Hintergrund-Box|
|Hinweisschild|Plane mit Text-Decal|
|Nummern-Label|Schwebendes Billboard-Label|
|Pfeilschild|Plane mit Richtungspfeil|

### Kategorie: Primitive

Box, Sphere, Cylinder, Cone, Torus, Plane, Circle — alle in neutralem Grau als Basismaterial. Für individuelle Formen ohne Semantik.

---

## 9. Technische Constraints & Entscheidungen

### Warum Zustand statt React Context?

React Context re-rendert den gesamten Baum bei jeder State-Änderung. Bei 1000+ Assets und 60fps-Rendering ist das inakzeptabel. Zustand verwendet selektive Subscriptions — jede Komponente abboniert nur die Felder, die sie benötigt.

### Warum `onPointerDown` statt `onClick`?

`onClick` löst erst beim Loslassen aus. Wenn das Mesh zwischen `pointerdown` und `pointerup` aus der Szene verschwindet (Wechsel Instancing → Einzelmesh durch Selektion), trifft der Mouse-Up-Raycast den Boden → ungewollte Deselektion. `onPointerDown` löst sofort beim Drücken aus und ist stabil.

### Warum kein `TransformControls` mit `onClick` für Orbit-Deaktivierung?

Drei.js `TransformControls` haben intern `dragging-changed` Events. `OrbitControls` werden über `dragging-changed` korrekt deaktiviert — kein manuelles Frame-Override nötig. Manuelles `orbitRef.enabled = false` in mousedown/mouseup führt zu Zuständen, die hängen bleiben.

### Warum localStorage statt IndexedDB (Phase 1–7)?

localStorage: synchron, einfach, 5MB Limit — ausreichend für ~500 Assets ohne Custom-Modelle.  
IndexedDB: asynchron, unbegrenzt — nötig wenn Custom-Modelle (Data-URLs) viele MB belegen.  
Migration zu IndexedDB geplant wenn durchschnittliche Layout-Größe > 3MB.

### Warum LZ-String für URL-Share statt Backend?

Keine Server-Infrastruktur nötig. LZ-Kompression erreicht ~70-80% Reduktion bei JSON. URL-Limit (32KB in modernen Browsern) entspricht ~300 Assets ohne Custom-Modelle. Ausreichend für die meisten Use Cases. Custom-Modelle werden beim URL-Share ausgeschlossen (zu groß).

### Instancing-Strategie

Instancing ist opt-in und wird automatisch aktiviert wenn > 50 Instanzen desselben Templates vorhanden sind. Instanzierte Assets werden aus dem normalen Selection-Ray ausgeschlossen — stattdessen `instanceId`-basierte Auflösung über `userData.instancedAssetIds`. Beim Selektieren wird das Asset aus dem Instancing herausgelöst und als Einzelmesh gerendert (mit Gizmo).

---

## 10. Definition of Done

### Per Feature

- [ ] Code geschrieben und TypeScript-Fehler = 0
- [ ] `npm run lint` → keine Errors
- [ ] `npm run build` → erfolgreicher Bundle
- [ ] Manuelle QA: Feature funktioniert wie beschrieben
- [ ] Edge-Cases dokumentiert (NaN, leere Arrays, ungültige Datei-Uploads, etc.)
- [ ] Undo/Redo für relevante Aktionen implementiert

### Pro Phase

- [ ] Alle Tasks der Phase abgeschlossen
- [ ] Demo funktioniert vollständig
- [ ] Performance gemessen (FPS mit typischer Asset-Anzahl)
- [ ] Keine kritischen Bugs im Backlog

### Release-Bereit

- [ ] Demo-Layout "Beispielwerk" vollständig und eindrucksvoll
- [ ] Auto-Save zuverlässig (F5-Test bestanden)
- [ ] JSON-Export und Import funktionieren vollständig
- [ ] 60fps mit Demo-Layout auf mittlerer Hardware
- [ ] Alle Keyboard-Shortcuts funktionieren
- [ ] Präsentationsmodus polished

---

## 11. Erfolgsmetriken

### Performance

|Metrik|Ziel|
|---|---|
|FPS mit 100 Assets|60fps|
|FPS mit 500 Assets|60fps|
|FPS mit 1000 Assets|≥ 45fps|
|Ladezeit (kalt)|< 2s|
|Bundle-Größe (gzip)|< 400KB|
|Auto-Save Latenz|< 300ms Debounce|

### UX

|Metrik|Ziel|
|---|---|
|Asset platzieren (erstmals)|< 30 Sekunden|
|Demo-Layout laden|< 1 Klick|
|F5 → Layout wiederhergestellt|100% zuverlässig|
|Undo/Redo|Alle Aktionen reversibel|

### Qualität

|Metrik|Ziel|
|---|---|
|Kritische Bugs (Phase 1–7)|0|
|TypeScript strict errors|0|
|NaN in Inspector|Unmöglich (Validierung)|
|Datenverlust bei Crash|Unmöglich (Auto-Save)|

---

## Appendix: Empfohlene Entwicklungsreihenfolge

```
Woche 1:   Phase 0 (Setup) + Phase 1 (Szene & Kamera)
Woche 2:   Phase 2.1–2.3 (Datenmodell, Renderer, Bibliothek)
Woche 3:   Phase 2.4 + Phase 3.1–3.2 (Platzierung, Inspector)
Woche 4:   Phase 3.3–3.5 (Undo/Redo, Copy/Paste, Box-Selection)
Woche 5:   Phase 4 (Zonen, Labels, Decals, Wege)
Woche 6:   Phase 5 (Persistenz & Export)
Woche 7:   Phase 6 (Präsentationsmodus + Demo-Layout)
Woche 8:   Phase 7 (Performance + UX-Feinschliff)
Q4 2026+:  Phase 8 (Cloud & Account, optional)
```

---

**Dokument:** WERKPLAN – Projektplan v1.0  
**Erstellt:** April 2026  
**Status:** Bereit für Umsetzung