import { useEffect, useRef, useState } from "react";

// Custom hook to compute analytics from face detection results
export function useFaceAnalytics(faces, videoRef) {
  // Reference storing recent face counts (no re-render on update)
  const historyRef = useRef([]);

  // Reference storing last time analytics were pushed to state
  const lastUpdateRef = useRef(performance.now());

  // State exposed to the UI (updated at low frequency)
  const [analytics, setAnalytics] = useState({
    faceCount: 0,
    avgFaceSize: 0,
    avgFacesOverTime: 0,
  });

  useEffect(() => {
    // Access the video element
    const video = videoRef.current;

    // Exit early if video is not ready
    if (!video || video.videoWidth === 0) return;

    // Current timestamp
    const now = performance.now();

    // ---------- Current frame analytics ----------

    // Number of faces detected in current frame
    const faceCount = faces.length;

    // Average face size relative to the video frame
    let avgFaceSize = 0;

    if (faceCount > 0) {
      // Compute total area of all detected faces
      const totalArea = faces.reduce((sum, face) => {
        const { width, height } = face.box;
        return sum + width * height;
      }, 0);

      // Normalize by frame size to get relative face size
      avgFaceSize =
        totalArea /
        faceCount /
        (video.videoWidth * video.videoHeight);
    }

    // ---------- History buffer ----------

    // Store current face count in history
    historyRef.current.push(faceCount);

    // Keep approximately last 2 seconds of data (~120 frames at 60 FPS)
    if (historyRef.current.length > 120) {
      historyRef.current.shift();
    }

    // ---------- Update UI once per second ----------

    if (now - lastUpdateRef.current >= 1000) {
      // Compute average number of faces over recent history
      const avgFacesOverTime =
        historyRef.current.reduce((a, b) => a + b, 0) /
        historyRef.current.length;

      // Update analytics state
      setAnalytics({
        faceCount,
        avgFaceSize,
        avgFacesOverTime: avgFacesOverTime.toFixed(2),
      });

      // Update timestamp of last UI update
      lastUpdateRef.current = now;
    }
  }, [faces, videoRef]);

  // Return computed analytics
  return analytics;
}
