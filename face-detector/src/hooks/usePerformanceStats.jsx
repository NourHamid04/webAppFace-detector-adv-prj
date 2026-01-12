import { useEffect, useRef, useState } from "react";
//custom hook to compute the FPS and the average detection time per ms
export function usePerformanceStats() {
  // useRef values are mutable and do NOT trigger re-renders
  // They are ideal for high-frequency updates (per frame)
  const frameCount = useRef(0);                 // Counts processed frames
  const lastFpsTime = useRef(performance.now()); // Timestamp of last FPS update
  const detectionTimes = useRef([]);             // Stores detection durations

  // useState holds aggregated stats for UI updates
  // Updated only once per second
  const [stats, setStats] = useState({
    fps: 0,
    avgDetectionTime: 0,
  });

  // Function called ONCE per processed frame
  function onFrame(detectionDurationMs) {
    // Increment frame counter
    frameCount.current += 1;

    // Store detection time for this frame
    detectionTimes.current.push(detectionDurationMs);

    // Current timestamp
    const now = performance.now();

    // Time elapsed since last FPS update
    const elapsed = now - lastFpsTime.current;

    // Update stats approximately once per second
    if (elapsed >= 1000) {
      // Compute frames per second
      const fps = Math.round(
        (frameCount.current * 1000) / elapsed
      );

      // Compute average detection time
      const avgDetectionTime =
        detectionTimes.current.reduce((a, b) => a + b, 0) /
        detectionTimes.current.length;

      // Update UI state with aggregated statistics
      setStats({
        fps,
        avgDetectionTime: Math.round(avgDetectionTime),
      });

      // Reset counters for next time window
      frameCount.current = 0;
      detectionTimes.current = [];
      lastFpsTime.current = now;
    }
  }

  // Expose stats and per-frame update function
  return { stats, onFrame };
}
