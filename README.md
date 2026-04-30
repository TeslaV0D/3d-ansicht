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
- Dunkles UI-Design mit Toolbar, Bibliothek-Panel und Inspector-Panel
- Edit-Modus und Präsentationsmodus
- Grid-Overlay auf dem Hallenboden

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

## Tech Stack

- React 19 + TypeScript
- Vite 8 (Build-Tool)
- Three.js + @react-three/fiber + @react-three/drei (3D)
- Zustand (State-Management)
- ESLint + Prettier (Code-Qualität)
- Vitest (Unit-Tests)
