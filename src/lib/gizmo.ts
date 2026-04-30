import type { Tool } from '../store/useStore';

export type GizmoMode = 'translate' | 'rotate' | 'scale';

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export function toolToGizmoMode(tool: Tool): GizmoMode | null {
  switch (tool) {
    case 'move':
      return 'translate';
    case 'rotate':
      return 'rotate';
    case 'scale':
      return 'scale';
    default:
      return null;
  }
}

export function constrainToAxis(delta: Vec3, axis: 'x' | 'y' | 'z'): Vec3 {
  switch (axis) {
    case 'x':
      return { x: delta.x, y: 0, z: 0 };
    case 'y':
      return { x: 0, y: delta.y, z: 0 };
    case 'z':
      return { x: 0, y: 0, z: delta.z };
  }
}

export function constrainToPlane(delta: Vec3, plane: 'xy' | 'xz' | 'yz'): Vec3 {
  switch (plane) {
    case 'xy':
      return { x: delta.x, y: delta.y, z: 0 };
    case 'xz':
      return { x: delta.x, y: 0, z: delta.z };
    case 'yz':
      return { x: 0, y: delta.y, z: delta.z };
  }
}

export function calculateGizmoSize(cameraDistance: number): number {
  const baseSize = 1.0;
  const scaleFactor = 0.1;
  return Math.max(0.5, baseSize + cameraDistance * scaleFactor);
}

export function snapToGrid(value: number, gridSize: number): number {
  return Math.round(value / gridSize) * gridSize;
}

export function clampPosition(value: number): number {
  return Math.max(-500, Math.min(500, value));
}

export function clampScale(value: number): number {
  return Math.max(0.01, Math.min(100, value));
}

export function normalizeRotation(degrees: number): number {
  let result = degrees % 360;
  if (result < 0) result += 360;
  return result === 0 ? 0 : result;
}

export function radToDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}
