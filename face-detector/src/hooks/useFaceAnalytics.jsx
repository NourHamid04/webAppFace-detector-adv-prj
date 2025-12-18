import { useEffect, useRef, useState } from "react";

export function useFaceAnalytics(faces, videoRef) {
  // history buffer (no re-render)
  const historyRef = useRef([]);
  const lastUpdateRef = useRef(performance.now());

  // exposed analytics (low-frequency updates)
  const [analytics, setAnalytics] = useState({
    faceCount: 0,
    avgFaceSize: 0,
    avgFacesOverTime: 0,
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0) return;

    const now = performance.now();

    // --- Current frame analytics ---
    const faceCount = faces.length;

    let avgFaceSize = 0;
    if (faceCount > 0) {
      const totalArea = faces.reduce((sum, face) => {
        const { width, height } = face.box;
        return sum + width * height;
      }, 0);

      // normalize by frame size
      avgFaceSize =
        totalArea /
        faceCount /
        (video.videoWidth * video.videoHeight);
    }

    // --- History buffer ---
    historyRef.current.push(faceCount);

    // keep last ~2 seconds (assuming ~60fps → 120 frames)
    if (historyRef.current.length > 120) {
      historyRef.current.shift();
    }

    // --- Update UI once per second ---
    if (now - lastUpdateRef.current >= 1000) {
      const avgFacesOverTime =
        historyRef.current.reduce((a, b) => a + b, 0) /
        historyRef.current.length;

      setAnalytics({
        faceCount,
        avgFaceSize,
        avgFacesOverTime: avgFacesOverTime.toFixed(2),
      });

      lastUpdateRef.current = now;
    }
  }, [faces, videoRef]);

  return analytics;
}
