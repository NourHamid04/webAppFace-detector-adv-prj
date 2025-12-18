import { useEffect, useRef, useState } from "react";

export function usePerformanceStats() {
  // refs → no re-render
  const frameCount = useRef(0);
  const lastFpsTime = useRef(performance.now());
  const detectionTimes = useRef([]);

  // state → updated once per second
  const [stats, setStats] = useState({
    fps: 0,
    avgDetectionTime: 0,
  });

  // called ONCE per frame
  function onFrame(detectionDurationMs) {
    frameCount.current += 1;
    detectionTimes.current.push(detectionDurationMs);

    const now = performance.now();
    const elapsed = now - lastFpsTime.current;

    if (elapsed >= 1000) {
      const fps = Math.round(
        (frameCount.current * 1000) / elapsed
      );

      const avgDetectionTime =
        detectionTimes.current.reduce((a, b) => a + b, 0) /
        detectionTimes.current.length;

      setStats({
        fps,
        avgDetectionTime: Math.round(avgDetectionTime),
      });

      // reset counters
      frameCount.current = 0;
      detectionTimes.current = [];
      lastFpsTime.current = now;
    }
  }

  return { stats, onFrame };
}
