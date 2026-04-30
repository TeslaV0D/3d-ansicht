# WERKPLAN – 3D Fabrik-Visualisierungstool

Browserbasiertes, interaktives 3D-Visualisierungstool für industrielle Fabrik- und Hallenlayouts.

## Projekt starten

```bash
npm install
npm run dev
```

Öffne http://localhost:5173 im Browser.

## Features

- 3D-Fabrikhalle mit konfigurierbaren Wänden und Boden
- Isometrische Kamera mit OrbitControls (Drehen, Zoomen, Schwenken)
- Dunkles UI-Design mit Toolbar, Bibliothek-Panel und Inspector-Panel
- Edit-Modus und Präsentationsmodus
- Grid-Overlay auf dem Hallenboden

## Bedienung

| Aktion | Eingabe |
|--------|---------|
| Kamera drehen | Linke Maustaste + Ziehen |
| Kamera zoomen | Mausrad |
| Kamera schwenken | Rechte Maustaste + Ziehen |

## Tech Stack

- React 19 + TypeScript
- Vite 8 (Build-Tool)
- Three.js + @react-three/fiber + @react-three/drei (3D)
- Zustand (State-Management)
- ESLint + Prettier (Code-Qualität)
- Vitest (Unit-Tests)
