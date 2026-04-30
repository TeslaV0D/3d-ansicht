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

- [ ] Bibliothek-Panel enthält nur Platzhalter (Phase 2)
- [ ] Inspector-Panel enthält nur Platzhalter (Phase 3)
- [ ] Keine Asset-Platzierung möglich (Phase 2)
