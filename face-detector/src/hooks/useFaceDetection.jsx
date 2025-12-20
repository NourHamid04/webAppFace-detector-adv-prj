import { useEffect, useRef, useState } from "react";
import { loadFaceDetector, detectFaces } from "../services/faceDetector";

// Custom hook responsible for real-time face detection
export function useFaceDetection(videoRef) {
  // State holding detected faces
  const [faces, setFaces] = useState([]);

  // Reference to store requestAnimationFrame ID
  const rafRef = useRef(null);

  useEffect(() => {
    // Exit early if the video element is not available
    if (!videoRef.current) return;

    // Flag used to safely stop the detection loop
    let running = true;

    // Async initialization function
    async function start() {
      // Load the face detection model (handled by service layer)
      await loadFaceDetector();

      // Detection loop executed on each animation frame
      const loop = async () => {
        // Stop if unmounted or video is missing
        if (!running || !videoRef.current) return;

        const video = videoRef.current;

        // Ensure video has valid dimensions before detection
        if (video.videoWidth > 0 && video.videoHeight > 0) {
          // Run face detection on the current frame
          const detections = await detectFaces(video);

          // Update detected faces state
          setFaces(detections);
        }

        // Schedule the next detection cycle
        rafRef.current = requestAnimationFrame(loop);
      };

      // Start the detection loop
      rafRef.current = requestAnimationFrame(loop);
    }

    // Start detection process
    start();

    // Cleanup function when component unmounts
    return () => {
      // Stop the loop
      running = false;

      // Cancel any pending animation frame
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [videoRef]);

  // Return detected faces
  return faces;
}
