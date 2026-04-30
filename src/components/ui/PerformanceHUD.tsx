import { useEffect, useRef, useState } from 'react';

interface PerfStats {
  fps: number;
  assets: number;
  memory: number;
}

export function PerformanceHUD({ assetCount }: { assetCount: number }) {
  const [stats, setStats] = useState<PerfStats>({ fps: 0, assets: 0, memory: 0 });
  const framesRef = useRef(0);
  const lastTimeRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    lastTimeRef.current = performance.now();

    function tick() {
      framesRef.current++;
      const now = performance.now();
      const elapsed = now - lastTimeRef.current;

      if (elapsed >= 1000) {
        const fps = Math.round((framesRef.current * 1000) / elapsed);
        const memory =
          'memory' in performance
            ? Math.round(
                ((performance as unknown as { memory: { usedJSHeapSize: number } }).memory
                  .usedJSHeapSize /
                  1024 /
                  1024) *
                  10,
              ) / 10
            : 0;

        setStats({ fps, assets: assetCount, memory });
        framesRef.current = 0;
        lastTimeRef.current = now;
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [assetCount]);

  return (
    <div className="perf-hud">
      <div className="perf-hud-row">
        <span className="perf-hud-label">FPS</span>
        <span className={`perf-hud-value ${stats.fps < 30 ? 'perf-warn' : ''}`}>
          {stats.fps}
        </span>
      </div>
      <div className="perf-hud-row">
        <span className="perf-hud-label">Assets</span>
        <span className="perf-hud-value">{stats.assets}</span>
      </div>
      {stats.memory > 0 && (
        <div className="perf-hud-row">
          <span className="perf-hud-label">Heap</span>
          <span className="perf-hud-value">{stats.memory} MB</span>
        </div>
      )}
    </div>
  );
}
