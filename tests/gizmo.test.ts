import { describe, test, expect } from 'vitest';
import {
  constrainToAxis,
  constrainToPlane,
  calculateGizmoSize,
  snapToGrid,
  clampPosition,
  clampScale,
  normalizeRotation,
  radToDeg,
  degToRad,
  toolToGizmoMode,
} from '../src/lib/gizmo';

describe('gizmo utilities', () => {
  describe('constrainToAxis', () => {
    test('constraining to X-axis zeroes Y and Z', () => {
      const delta = { x: 10, y: 5, z: 2 };
      const constrained = constrainToAxis(delta, 'x');
      expect(constrained).toEqual({ x: 10, y: 0, z: 0 });
    });

    test('constraining to Y-axis zeroes X and Z', () => {
      const delta = { x: 10, y: 5, z: 2 };
      const constrained = constrainToAxis(delta, 'y');
      expect(constrained).toEqual({ x: 0, y: 5, z: 0 });
    });

    test('constraining to Z-axis zeroes X and Y', () => {
      const delta = { x: 10, y: 5, z: 2 };
      const constrained = constrainToAxis(delta, 'z');
      expect(constrained).toEqual({ x: 0, y: 0, z: 2 });
    });
  });

  describe('constrainToPlane', () => {
    test('XY plane zeroes Z', () => {
      const delta = { x: 3, y: 4, z: 5 };
      expect(constrainToPlane(delta, 'xy')).toEqual({ x: 3, y: 4, z: 0 });
    });

    test('XZ plane zeroes Y', () => {
      const delta = { x: 3, y: 4, z: 5 };
      expect(constrainToPlane(delta, 'xz')).toEqual({ x: 3, y: 0, z: 5 });
    });

    test('YZ plane zeroes X', () => {
      const delta = { x: 3, y: 4, z: 5 };
      expect(constrainToPlane(delta, 'yz')).toEqual({ x: 0, y: 4, z: 5 });
    });
  });

  describe('calculateGizmoSize', () => {
    test('gizmo size scales with camera distance', () => {
      const size1 = calculateGizmoSize(10);
      const size2 = calculateGizmoSize(20);
      expect(size2).toBeGreaterThan(size1);
    });

    test('minimum size is 0.5', () => {
      const size = calculateGizmoSize(0);
      expect(size).toBeGreaterThanOrEqual(0.5);
    });

    test('large distance gives proportionally larger size', () => {
      const size = calculateGizmoSize(100);
      expect(size).toBeGreaterThan(5);
    });
  });

  describe('snapToGrid', () => {
    test('snaps to nearest grid unit', () => {
      expect(snapToGrid(2.3, 1)).toBe(2);
      expect(snapToGrid(2.7, 1)).toBe(3);
      expect(snapToGrid(2.5, 1)).toBe(3);
    });

    test('works with fractional grid sizes', () => {
      expect(snapToGrid(1.3, 0.5)).toBe(1.5);
      expect(snapToGrid(1.1, 0.5)).toBe(1);
    });

    test('negative values snap correctly', () => {
      expect(snapToGrid(-2.3, 1)).toBe(-2);
      expect(snapToGrid(-2.7, 1)).toBe(-3);
    });
  });

  describe('clampPosition', () => {
    test('values within range are unchanged', () => {
      expect(clampPosition(10)).toBe(10);
      expect(clampPosition(-100)).toBe(-100);
    });

    test('clamps to ±500', () => {
      expect(clampPosition(600)).toBe(500);
      expect(clampPosition(-600)).toBe(-500);
    });
  });

  describe('clampScale', () => {
    test('values within range are unchanged', () => {
      expect(clampScale(1)).toBe(1);
      expect(clampScale(50)).toBe(50);
    });

    test('clamps minimum to 0.01', () => {
      expect(clampScale(0)).toBe(0.01);
      expect(clampScale(-5)).toBe(0.01);
    });

    test('clamps maximum to 100', () => {
      expect(clampScale(150)).toBe(100);
    });
  });

  describe('normalizeRotation', () => {
    test('keeps values 0-360 unchanged', () => {
      expect(normalizeRotation(90)).toBe(90);
      expect(normalizeRotation(0)).toBe(0);
      expect(normalizeRotation(359)).toBe(359);
    });

    test('wraps values above 360', () => {
      expect(normalizeRotation(450)).toBe(90);
      expect(normalizeRotation(720)).toBe(0);
    });

    test('wraps negative values', () => {
      expect(normalizeRotation(-90)).toBe(270);
      expect(normalizeRotation(-360)).toBe(0);
    });
  });

  describe('radToDeg / degToRad', () => {
    test('converts radians to degrees', () => {
      expect(radToDeg(Math.PI)).toBeCloseTo(180);
      expect(radToDeg(Math.PI / 2)).toBeCloseTo(90);
    });

    test('converts degrees to radians', () => {
      expect(degToRad(180)).toBeCloseTo(Math.PI);
      expect(degToRad(90)).toBeCloseTo(Math.PI / 2);
    });

    test('round-trip conversion is identity', () => {
      expect(radToDeg(degToRad(45))).toBeCloseTo(45);
      expect(degToRad(radToDeg(1.5))).toBeCloseTo(1.5);
    });
  });

  describe('toolToGizmoMode', () => {
    test('maps move to translate', () => {
      expect(toolToGizmoMode('move')).toBe('translate');
    });

    test('maps rotate to rotate', () => {
      expect(toolToGizmoMode('rotate')).toBe('rotate');
    });

    test('maps scale to scale', () => {
      expect(toolToGizmoMode('scale')).toBe('scale');
    });

    test('returns null for select', () => {
      expect(toolToGizmoMode('select')).toBeNull();
    });

    test('returns null for place', () => {
      expect(toolToGizmoMode('place')).toBeNull();
    });
  });
});
