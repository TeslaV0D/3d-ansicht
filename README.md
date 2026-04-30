# WERKPLAN – 3D Fabrik-Visualisierungstool

Browserbasiertes, interaktives 3D-Visualisierungstool für industrielle Fabrik- und Hallenlayouts.

## Projekt starten

```bash
npm install
npm run dev
```

Öffne http://localhost:5173 im Browser.

## Features

- 3D-Fabrikhalle mit konfigurierbaren Wänden (Beton/Metall/Glas) und Beton-Boden
- Dachrahmen als Linien-Geometrie mit Querbalken
- Isometrische Kamera mit OrbitControls (Drehen, Zoomen, Schwenken)
- 4 Kamera-Presets mit animierten Übergängen
- HDRI-Beleuchtung (Warehouse) mit Schatten
- **Asset-Bibliothek** mit 37 Templates in 8 Kategorien
- **Click-to-Place** mit Ghost-Vorschau und Grid-Snap
- Live-Suchfilter in der Bibliothek
- Hover-Feedback und Selection-Highlight auf platzierten Assets
- **Inspector Panel** mit Transform, Material, Metadaten und Aktionen
- **Undo/Redo** (80 Schritte) mit Ctrl+Z / Ctrl+Y
- **Copy/Paste/Delete** mit Ctrl+C/V/D und Delete-Taste
- **Multi-Select** mit Ctrl+Klick, Ctrl+A für alle
- **Zonen-Labels** als Billboard-Text über Zonen (immer zur Kamera)
- **Text-Labels** als schwebende Billboard-Beschriftungen
- **Auto-Save** in localStorage (F5-safe, 300ms Debounce)
- **JSON Export/Import** über Toolbar-Buttons
- Dunkles UI-Design mit Toolbar, Bibliothek-Panel und Inspector-Panel
- **Präsentationsmodus** mit Klick-Info-Panel (Name, Beschreibung, Metadaten)
- **Demo-Layout** "Beispielwerk" mit ~50 Assets sofort ladbar
- **Performance-HUD** (FPS, Assets, Heap) einblendbar mit H-Taste
- **Keyboard-Shortcuts-Modal** per ?-Taste
- **Alignment-Tools** bei Multi-Select (Ausrichten und Verteilen)
- **PNG-Screenshot-Export** über Toolbar-Button
- Modus-Wechsel per Toolbar oder Taste P / ESC
- Grid-Overlay auf dem Hallenboden (nur im Edit-Modus)

## Bedienung

| Aktion | Eingabe |
|--------|---------|
| Kamera drehen | Linke Maustaste + Ziehen |
| Kamera zoomen | Mausrad |
| Kamera schwenken | Rechte Maustaste + Ziehen |
| Kamera Isometrisch | Taste 1 |
| Kamera Top-Down | Taste 2 |
| Kamera Front | Taste 3 |
| Kamera Seite | Taste 4 |
| Platzierung abbrechen | Escape |
| Undo | Ctrl/Cmd + Z |
| Redo | Ctrl/Cmd + Y |
| Kopieren | Ctrl/Cmd + C |
| Einfügen | Ctrl/Cmd + V |
| Duplizieren | Ctrl/Cmd + D |
| Alle auswählen | Ctrl/Cmd + A |
| Löschen | Delete / Backspace |
| Bewegen-Modus | G |
| Rotieren-Modus | R |
| Skalieren-Modus | S |
| Präsentationsmodus | P |
| Performance-HUD | H |
| Shortcuts anzeigen | ? |
| Screenshot | Toolbar: 📷 |
| Demo-Layout laden | Toolbar: 🏭 Demo |

## Tech Stack

- React 19 + TypeScript
- Vite 8 (Build-Tool)
- Three.js + @react-three/fiber + @react-three/drei (3D)
- Zustand (State-Management)
- ESLint + Prettier (Code-Qualität)
- Vitest (Unit-Tests)
