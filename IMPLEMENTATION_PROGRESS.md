# WERKPLAN – Implementierungsfortschritt

## Stand 1: Phase 0 – Projektsetup

### Abgeschlossen

- **Vite + React + TypeScript Projekt:** Initialisiert mit `npm create vite@latest . -- --template react-ts`
- **3D-Abhängigkeiten:** Three.js, @react-three/fiber, @react-three/drei installiert
- **State-Management:** Zustand installiert und initialer Store implementiert
- **URL-Kompression:** lz-string installiert
- **ESLint + Prettier:** Konfiguriert mit Standard-Regeln
- **Ordnerstruktur:** Vollständig angelegt (components/scene, components/ui, components/modals, store, types, templates, utils, hooks, styles)
- **CSS-Designsystem:** Basis-Variablen (Farben, Abstände, Radius) definiert
- **Initiale 3D-Szene:** Fabrikhalle mit Boden, Wänden, Beleuchtung und Grid
- **TypeScript-Interfaces:** Asset, AssetTemplate, StoredLayout, HallSettings und alle Sub-Typen definiert
- **Zustand Store:** Basis-Store mit Assets, Hall/Lighting/Grid Settings, Modi und Tools
- **Unit-Tests:** Vitest konfiguriert mit 3 bestehenden Tests für den Store

### Geänderte Dateien

- `package.json` — Projekt-Dependencies und Scripts
- `vite.config.ts` — Vite-Konfiguration mit React-Plugin
- `vitest.config.ts` — Separate Vitest-Konfiguration
- `tsconfig.app.json` — TypeScript strict mode aktiviert
- `.prettierrc` — Prettier-Regeln
- `index.html` — Titel auf WERKPLAN gesetzt
- `src/main.tsx` — App-Einstiegspunkt
- `src/App.tsx` — Hauptkomponente mit Toolbar und Workspace-Layout
- `src/styles/app.css` — Komplettes Dark-Theme Design-System
- `src/types/index.ts` — Alle TypeScript-Interfaces
- `src/store/useStore.ts` — Zustand Store mit Actions
- `src/components/scene/SceneCanvas.tsx` — R3F Canvas mit OrbitControls
- `src/components/scene/FactoryFloor.tsx` — Hallenboden
- `src/components/scene/FactoryWalls.tsx` — Konfigurierbare Wände
- `src/components/scene/Lighting.tsx` — Beleuchtungs-Setup
- `src/components/ui/Toolbar.tsx` — Toolbar mit Modus-Umschaltung
- `src/components/ui/WorkspaceLayout.tsx` — 3-Panel-Layout
- `tests/store.test.ts` — Store Unit-Tests

### Technische Entscheidungen

- **Vitest in separater Config:** `vitest.config.ts` statt in `vite.config.ts` wegen Vite 8 Typ-Inkompatibilität
- **TypeScript 6 + Strict Mode:** Maximale Typsicherheit von Anfang an
- **Zustand statt React Context:** Performance bei vielen Assets (selektive Subscriptions)

### Bekannte Einschränkungen / TODOs

- [ ] Bibliothek-Panel enthält nur Platzhalter (Phase 2)
- [ ] Inspector-Panel enthält nur Platzhalter (Phase 3)
- [ ] Keine Asset-Platzierung möglich (Phase 2)
- [x] ~~Keine Kamera-Presets~~ → in Stand 2 implementiert

---

## Stand 2: Phase 1 – 3D-Szene & Kamera

### Abgeschlossen

- **Phase 1.1 – Kamera-Presets:** Vier Kamera-Positionen (Isometrisch, Top, Front, Seite) mit animierten Übergängen (600ms Ease-Out). Tastenkürzel 1–4 implementiert. OrbitControls mit `dampingFactor: 0.08`, `maxPolarAngle` begrenzt sodass Kamera nicht unter den Boden geht.
- **Phase 1.2 – Fabrikhalle:** Boden mit prozeduraler Beton-Textur (Canvas-basiert, 512×512, mit Rausch-Partikeln und feinen Rissen). Drei konfigurierbare Wände (Material: concrete/metal/glass). Dachrahmen als Linien-Geometrie mit Querbalken alle 10m. `showRoof` standardmäßig aktiviert.
- **Phase 1.3 – Beleuchtung:** HDRI Environment (`warehouse` Preset aus @react-three/drei). directionalLight mit Schatten (1024² shadowMap, bias -0.0001). hemisphereLight für weiche Aufhellung. Realistische Beleuchtung ohne Überbelichtung.

### Geänderte Dateien

- `src/components/scene/CameraRig.tsx` — Neuer Kamera-Controller mit Presets und Keyboard-Shortcuts
- `src/components/scene/SceneCanvas.tsx` — OrbitControls durch CameraRig ersetzt
- `src/components/scene/FactoryFloor.tsx` — Prozedurale Beton-Textur, Material-Varianten (concrete/wood/tile/custom)
- `src/components/scene/FactoryWalls.tsx` — Konfigurierbare Wandmaterialien, Dachrahmen-Komponente
- `src/components/scene/Lighting.tsx` — HDRI Environment, verbesserte Schatten-Konfiguration
- `src/store/useStore.ts` — `showRoof` default auf `true`

### Technische Entscheidungen

- **Prozedurale Textur statt Bilddatei:** Vermeidet externe Asset-Dateien, Textur wird einmalig beim Mount erzeugt (via `useMemo`)
- **Animierte Kamera-Übergänge:** `requestAnimationFrame`-basierte Interpolation mit kubischer Ease-Out-Funktion statt instant-Jump für professionelles Gefühl
- **Dachrahmen als BufferGeometry:** Alle Linien in einer einzigen Geometrie zusammengefasst für minimale Draw-Calls
- **maxPolarAngle:** Kamera kann nicht unter den Boden gedreht werden (verhindert Desorientierung)

### Bekannte Einschränkungen / TODOs

- [x] ~~Bibliothek-Panel enthält nur Platzhalter~~ → in Stand 3 implementiert
- [ ] Inspector-Panel enthält nur Platzhalter (Phase 3)
- [x] ~~Keine Asset-Platzierung möglich~~ → in Stand 3 implementiert

---

## Stand 3: Phase 2 – Asset-System & Bibliothek

### Abgeschlossen

- **Phase 2.1 – Template-System:** 37 Asset-Templates in 8 Kategorien (Produktion, Logistik, Büro & Verwaltung, Personal, Zonen, Wege & Markierungen, Primitive, Infrastruktur). `AssetFactory` Klasse mit statischen Methoden für Template-Verwaltung, Instanzerstellung und Suche.
- **Phase 2.2 – AssetRenderer:** Universeller 3D-Renderer für alle GeometryKind-Typen (box, cylinder, sphere, cone, torus, plane). Hover-Feedback mit Emissive-Glow, Selection-Highlight, automatische Y-Offset-Berechnung für Boden-Platzierung, Zonen/Wege flach auf dem Boden.
- **Phase 2.3 – Bibliotheks-Panel:** Vollständige linke Sidebar mit anklappbaren Kategorien, Live-Suchfilter, Item-Count pro Kategorie. Klick auf Template aktiviert Platzier-Modus.
- **Phase 2.4 – Click-to-Place & Ghost:** Halbtransparentes Ghost-Mesh folgt der Maus auf dem Boden mit Grid-Snap (1m Raster). Klick platziert Asset. ESC bricht ab. Platzier-Modus bleibt aktiv nach Platzierung für schnelle Mehrfach-Platzierung.

### Geänderte Dateien

- `src/templates/assetTemplates.ts` — 37 Asset-Templates mit allen Kategorien
- `src/templates/AssetFactory.ts` — Factory-Klasse für Template-Verwaltung und Instanzerstellung
- `src/components/scene/AssetRenderer.tsx` — Universeller 3D-Asset-Renderer mit Hover/Selection
- `src/components/scene/GhostRenderer.tsx` — Ghost-Vorschau mit Grid-Snap und Platzierung
- `src/components/scene/SceneCanvas.tsx` — Integration von AssetRenderer und GhostRenderer
- `src/components/ui/LibraryPanel.tsx` — Vollständiges Bibliotheks-Panel mit Suche und Kategorien
- `src/components/ui/WorkspaceLayout.tsx` — Integration des LibraryPanels, Panel-Ausblendung im Präsentationsmodus
- `src/hooks/useKeyboardShortcuts.ts` — ESC zum Abbrechen des Platzier-Modus
- `src/store/useStore.ts` — `placingTemplateId` State hinzugefügt
- `src/styles/app.css` — Library-Panel Styles
- `src/App.tsx` — Keyboard-Shortcuts Hook integriert

### Technische Entscheidungen

- **Unsichtbare Capture-Plane für Ghost:** Eine 200×200m unsichtbare Plane fängt alle Pointer-Events für die Ghost-Positionierung und Platzierung auf — vermeidet Konflikte mit dem sichtbaren Boden und Grid
- **Grid-Snap per Default:** Position wird auf 1m-Raster gerundet, konfigurierbar über `gridSettings`
- **Asset-ID-Generierung:** Kombination aus Timestamp, Counter und Random-String für Eindeutigkeit ohne UUID-Library
- **Zonen automatisch flach:** Zonen und Wege werden automatisch mit -90° X-Rotation gerendert und knapp über dem Boden positioniert (Y=0.02/0.03)

### Bekannte Einschränkungen / TODOs

- [x] ~~Inspector-Panel enthält nur Platzhalter~~ → in Stand 4 implementiert
- [x] ~~Kein Undo/Redo~~ → in Stand 4 implementiert
- [x] ~~Keine Mehrfachauswahl~~ → in Stand 4 implementiert
- [ ] Kein Transform-Gizmo (bewusst zurückgestellt — Position/Rotation/Skalierung via Inspector-Felder)
- [ ] Keine Box-Selection (Phase 7)

---

## Stand 4: Phase 3 – Editing & Inspector

### Abgeschlossen

- **Phase 3.1 – Auswahl & Multi-Select:** Klick = Einzelauswahl, CTRL/CMD+Klick = additiv/subtraktiv zur bestehenden Auswahl. Klick auf leeren Bereich = Deselektieren. G/R/S Tasten wechseln Tool-Modus (Move/Rotate/Scale — wirkt über Inspector-Felder).
- **Phase 3.2 – Inspector Panel:** Vollständige rechte Sidebar mit:
  - Transform-Sektion (Position X/Y/Z, Rotation X/Y/Z, Skalierung W/H/T) mit Draft-State und Number.isFinite()-Validierung
  - Material-Sektion (Farbe-Picker, Deckkraft/Roughness/Metalness Slider)
  - Metadaten-Sektion (Name, Beschreibung, Zonentyp)
  - Aktionen-Sektion (Sperren/Entsperren, Duplizieren, Löschen)
  - Multi-Select zeigt Asset-Anzahl + Batch-Aktionen
- **Phase 3.3 – Undo/Redo:** 80-Schritte History-Stack. Ctrl+Z = Undo, Ctrl+Y / Ctrl+Shift+Z = Redo. Snapshots enthalten assets[] + selectedIds[]. History wird bei Add/Delete/Paste/Duplicate automatisch gepusht.
- **Phase 3.4 – Copy/Paste & Delete:** Ctrl+C = Kopieren, Ctrl+V = Einfügen (versetzt +1m/+1m), Ctrl+D = Duplizieren, Delete/Backspace = Löschen. Alle mit History-Integration.
- **Phase 3.5 – Box-Selection:** Bewusst auf Phase 7 zurückgestellt. Ctrl+A (Alle auswählen) ist implementiert als Ersatz.

### Geänderte Dateien

- `src/store/useStore.ts` — Komplett überarbeitet: History-Stack (past/future), Clipboard, pushHistory/undo/redo/copySelected/paste/deleteSelected/duplicateSelected Actions
- `src/hooks/useKeyboardShortcuts.ts` — Erweitert um Ctrl+Z/Y/C/V/D/A, Delete, G/R/S
- `src/components/ui/InspectorPanel.tsx` — Vollständiges Inspector-Panel mit NumberInput (Draft-State), SliderInput, ColorPicker, Sections
- `src/components/ui/WorkspaceLayout.tsx` — InspectorPanel integriert
- `src/components/scene/SceneCanvas.tsx` — Multi-Select via CTRL+Klick, ThreeEvent-Import
- `src/styles/app.css` — Inspector-Styles

### Technische Entscheidungen

- **Kein TransformControls-Gizmo:** Entscheidung gegen @react-three/drei TransformControls wegen Komplexität der Ref-Synchronisation mit Zustand-Store. Stattdessen exakte numerische Eingabe über Inspector-Felder — professioneller und präziser für Fabrikplanung.
- **Draft-State für NumberInput:** Eingabefeld zeigt während Fokus den lokalen Draft-Wert, committed erst bei Blur/Enter. Verhindert NaN-Commits bei unvollständiger Eingabe.
- **History bei jeder mutativen Aktion:** addAsset, deleteSelected, paste, duplicateSelected pushen automatisch einen Snapshot — kein manuelles pushHistory nötig in UI-Code.

### Bekannte Einschränkungen / TODOs

- [ ] Box-Selection (Phase 7)
- [x] ~~Auto-Save~~ → in Stand 5 implementiert
- [x] ~~Persistenz~~ → in Stand 5 implementiert

---

## Stand 5: Phase 4 + 5 – Zonen-Labels, Text-System & Persistenz

### Abgeschlossen

- **Phase 4.1 – Zonen-Labels:** Billboard-Text wird automatisch über jeder Zone zentriert angezeigt (Name aus metadata.name). Farbe entspricht der Zonenfarbe. Immer zur Kamera ausgerichtet.
- **Phase 4.2 – Text-Labels:** Neuer GeometryKind `text` mit Billboard-Rendering über @react-three/drei `<Text>`. Zwei Templates: "Text-Label" und "Nummern-Label" in der Kategorie "Schilder & Labels". Live-Update über Inspector Name-Feld.
- **Phase 5.1 – Auto-Save:** Debounced Auto-Save (300ms) in localStorage. Layout wird beim App-Start automatisch wiederhergestellt. F5-safe.
- **Phase 5.3 – JSON Export/Import:** Export-Button in der Toolbar speichert Layout als JSON-Datei (werkplan_layout_YYYY-MM-DD_HH-MM.json). Import-Button lädt JSON-Datei und stellt Layout wieder her mit History-Integration.

### Geänderte Dateien

- `src/components/scene/AssetRenderer.tsx` — Billboard-Labels für Zonen, TextAsset-Komponente für text-Geometrie
- `src/templates/assetTemplates.ts` — 2 neue Templates: Text-Label, Nummern-Label (Kategorie "Schilder & Labels")
- `src/templates/AssetFactory.ts` — `label` Typ für Schilder-Kategorie
- `src/hooks/useAutoSave.ts` — Auto-Save Hook mit serializeLayout, loadLayout, exportLayout, importLayout
- `src/components/ui/Toolbar.tsx` — Export/Import Buttons, Asset-Counter
- `src/App.tsx` — useAutoSave Hook integriert
- `src/styles/app.css` — Toolbar-Divider Style

### Technische Entscheidungen

- **Billboard-Labels statt statische Text-Meshes:** Zonen-Labels und Text-Assets nutzen `<Billboard>` + `<Text>` aus drei — immer zur Kamera ausgerichtet, immer lesbar
- **Debounced Auto-Save (300ms):** Balanciert zwischen Datensicherheit und Performance. Kein JSON.stringify bei jedem Frame.
- **Separate Export/Import Funktionen:** Exportierbar als Utility, nicht an React-Lifecycle gebunden

### Bekannte Einschränkungen / TODOs

- [ ] Decals (Phase 4.3) — bewusst zurückgestellt
- [ ] Boden-Markierungen mit Canvas-Texturen (Phase 4.4) — bewusst zurückgestellt
- [ ] Benannte Slots (Phase 5.2) — bewusst zurückgestellt
- [ ] URL-Share (Phase 5.4) — bewusst zurückgestellt

---

### Bugfix: NumberInput commit bei Enter-Taste

**Ursache:** In `NumberInput.commit()` wurde nach `onChange(parsed)` der Draft-Wert auf `String(Math.round(value * 100) / 100)` zurückgesetzt — wobei `value` noch den alten Prop-Wert enthielt. Da bei Enter `focused=true` bleibt, zeigte `displayValue` den alten Draft statt des neuen Wertes. Die Änderung wurde zwar an den Store gesendet, aber visuell im Eingabefeld nicht reflektiert.

**Fix:** `setDraft` verwendet nun den `parsed`-Wert (den tatsächlich commiteten Wert) statt des alten Props. Bei ungültigem Input wird auf den alten `value` zurückgesetzt.

**Betroffene Datei:** `src/components/ui/InspectorPanel.tsx`

---

## Stand 6: Phase 6 – Präsentationsmodus

### Abgeschlossen

- **Phase 6.1 – Modus-Trennung (Edit vs. Präsentation):** Saubere Trennung zwischen Edit-Modus (volle Bearbeitung mit Bibliothek, Inspector, Toolbar) und Präsentationsmodus (minimale UI, nur Kamera-Navigation und Klick-Infos). Wechsel über Toolbar-Button "▶ Präsentation" oder Taste `P`. Zurück mit ESC oder "✎ Bearbeiten"-Button. Im Präsentationsmodus: keine Bibliothek, kein Inspector, kein Grid-Overlay, kein Ghost-Renderer. Toolbar zeigt minimalen Hint-Text. Gesperrte Objekte sind im Präsentationsmodus nicht klickbar.
- **Phase 6.2 – Klick-Info-Panel (Präsentationsmodus):** Klick auf nicht-gesperrte Assets zeigt zentriertes Info-Modal mit: Name, Zonentyp-Badge, Beschreibung, benutzerdefinierte Metadaten-Felder als Tabelle, Präsentationsnotizen (stilisiert, kursiv). Keine technischen Daten (Position, Rotation, Material). Schließen per X-Button, Klick außerhalb, oder ESC. Smooth Animations (fadeIn + slideUp).
- **Phase 6.3 – Demo-Layout "Beispielwerk":** Fertig aufgebautes Demo-Layout mit: 5 Zonen (FA1-Montage, FA2-Fertigung, Logistik, Büro, Eingang), Produktionslinien und Montagearbeitsplätze, CNC-Maschinen und Schweißroboter, Logistikbereich mit Regalen/Gabelstapler/Containern, Bürobereich mit Tischen und Whiteboard, Personal (stehend/sitzend), Infrastruktur (Säulen, Feuerlöscher), Wege und Markierungen, Text-Labels für alle Bereiche. Ladbar über "🏭 Demo" Button in der Toolbar.

### Geänderte Dateien

- `src/components/ui/Toolbar.tsx` — Komplett überarbeitet: Demo-Button, Präsentations-Toggle, Hint-Text im Präsentationsmodus
- `src/components/ui/WorkspaceLayout.tsx` — PresentationInfoPanel Integration, Presentation-Click-State
- `src/components/ui/PresentationInfoPanel.tsx` — Neues Info-Modal für Präsentationsmodus
- `src/components/scene/SceneCanvas.tsx` — Presentation-Mode Click-Handling, Grid/Ghost nur im Edit-Modus
- `src/hooks/useKeyboardShortcuts.ts` — P-Taste für Modus-Wechsel, ESC-Verhalten im Präsentationsmodus
- `src/templates/demoLayout.ts` — Demo-Layout-Generator mit ~50 Assets
- `src/styles/app.css` — Komplette Presentation-Mode Styles (Overlay, Info-Panel, Animations)

### Technische Entscheidungen

- **PresentationInfoPanel als eigenständige Komponente:** Saubere Trennung von Edit- und Präsentations-UI. Kein Wiederverwenden des InspectorPanels — unterschiedliche Anforderungen (kein Transform, kein Material, nur Metadaten).
- **onPresentationClick Callback statt Store-State:** Presentation-Asset-ID als lokaler React-State in WorkspaceLayout statt globaler Store-State — verhindert unnötige Re-Renders der gesamten Szene.
- **Demo-Layout als Funktion:** `generateDemoLayout()` erzeugt bei jedem Aufruf frische Asset-IDs — keine ID-Konflikte bei mehrfachem Laden.
- **Grid und Ghost im Präsentationsmodus ausgeblendet:** Saubere Präsentationsansicht ohne Edit-Artefakte.

### Bekannte Einschränkungen / TODOs

- [x] ~~PNG-Screenshot-Export~~ → in Stand 7 implementiert
- [x] ~~Performance-HUD~~ → in Stand 7 implementiert
- [x] ~~Alignment-Tools~~ → in Stand 7 implementiert

---

## Stand 7: Phase 7 – Performance & UX-Feinschliff

### Abgeschlossen

- **Phase 7.2 – Performance-HUD:** Einblendbar via H-Taste oder Toolbar-Button (📊). Zeigt FPS (Echtzeit), Asset-Anzahl und JS-Heap (Chrome). Warnung (rot) bei < 30fps. requestAnimationFrame-basiert mit 1-Sekunden-Update-Intervall.
- **Phase 7.3 – Shortcuts-Modal:** Vollständige Shortcut-Referenz als Modal (Taste `?`). Kategorisiert: Bearbeitung (Ctrl+Z/Y/C/V/D/A, Del), Transform (G/R/S), Kamera (1–4), Modi & Anzeige (P, H, ?, ESC). Schließbar per X, ESC, Klick außerhalb.
- **Phase 7.4 – Alignment-Tools:** Sichtbar in der Toolbar bei 2+ selektierten Assets. 6 Ausrichtungs-Buttons (Links/Mitte/Rechts auf X, Oben/Mitte/Unten auf Z). 2 Verteilungs-Buttons bei 3+ Assets (horizontal/vertikal). Alle mit Undo-Integration.
- **Phase 7.5 – PNG-Screenshot-Export:** Toolbar-Button "📷 Screenshot". Erzeugt PNG via canvas.toDataURL(). Dateiname: werkplan_screenshot_YYYY-MM-DD.png. Canvas mit preserveDrawingBuffer für stabiles Capturing.

### Geänderte Dateien

- `src/App.tsx` — Komplett überarbeitet: HUD-State, Shortcuts-Modal-State, Screenshot-Handler, Callbacks an Toolbar/Shortcuts übergeben
- `src/components/ui/Toolbar.tsx` — Props-Interface erweitert: showHUD, onToggleHUD, onShowShortcuts, onScreenshot. Alignment-Buttons, Screenshot-Button, HUD-Toggle, Shortcuts-Button
- `src/components/ui/PerformanceHUD.tsx` — Neues Performance-HUD mit FPS/Assets/Heap
- `src/components/ui/ShortcutsModal.tsx` — Neues Shortcuts-Modal mit allen Kürzeln
- `src/hooks/useKeyboardShortcuts.ts` — H-Taste (HUD), ?-Taste (Shortcuts), Callbacks-Parameter
- `src/store/useStore.ts` — `alignSelected` und `distributeSelected` Actions
- `src/components/scene/SceneCanvas.tsx` — `gl={{ preserveDrawingBuffer: true }}` für Screenshot-Support
- `src/styles/app.css` — Performance-HUD, Shortcuts-Modal, Toolbar-Sm Styles

### Technische Entscheidungen

- **Performance-HUD als eigene Komponente außerhalb R3F:** Vermeidet Performance-Impact auf den 3D-Render-Loop. requestAnimationFrame statt useFrame (Three.js) — unabhängig vom Canvas.
- **preserveDrawingBuffer:** Nötig für canvas.toDataURL() nach dem Render. Minimaler Performance-Overhead akzeptabel für Screenshot-Support.
- **Alignment mit History-Integration:** Jede Alignment-Aktion pusht einen Snapshot — vollständig undoable.
- **Callbacks statt globalem State für HUD/Shortcuts:** Modals und HUD-State leben im App-Root statt im Zustand Store — kein unnötiger Re-Render der 3D-Szene.

### Bekannte Einschränkungen / TODOs

- [ ] Custom GLB/STL-Import (Phase 7.6) — bewusst zurückgestellt (erfordert IndexedDB für Data-URLs)
- [ ] Box-Selection (7.x) — bewusst zurückgestellt
- [ ] Instancing-Optimierung ab 50+ gleichen Assets — bewusst zurückgestellt (Demo-Layout hat < 50 gleiche Templates)
