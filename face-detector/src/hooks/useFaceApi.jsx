import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { usePerformanceStats } from "./usePerformanceStats";

// Global flag to ensure models are loaded only once
let modelsLoaded = false;

// Function responsible for loading AI models
async function loadModels() {
  // If models are already loaded, do nothing
  if (modelsLoaded) return;

  // Load the Tiny Face Detector model from the public /models folder
  await faceapi.nets.tinyFaceDetector.loadFromUri("/models");

  // Mark models as loaded to avoid reloading
  modelsLoaded = true;
}

// Custom React hook for face detection
export function useFaceApi(videoRef) {
  // State that stores detected faces (bounding boxes, etc.)
  const [faces, setFaces] = useState([]);

  // Reference to store the current requestAnimationFrame ID
  const rafRef = useRef(null);

  // Performance statistics hook
  const { stats, onFrame } = usePerformanceStats();

  useEffect(() => {
    // If the video element is not yet available, exit
    if (!videoRef.current) return;

    // Flag used to safely stop the detection loop on unmount
    let running = true;

    // Async function to initialize detection
    async function start() {
      // Load AI models (only once globally)
      await loadModels();

      const video = videoRef.current;

      // Ensure the video has loaded enough data to start processing
      if (video.readyState < 2) {
        // Wait until video data is available
        await new Promise((r) => (video.onloadeddata = r));
      }

      // Configuration options for Tiny Face Detector
      const options = new faceapi.TinyFaceDetectorOptions({
        inputSize: 224,       // Input resolution for the model
        scoreThreshold: 0.5,  // Confidence threshold for detections
      });

      // Main detection loop
      const loop = async () => {
        // If the hook is no longer active, stop looping
        if (!running) return;

        // Start timing detection
        const startTime = performance.now();

        // Run face detection on the current video frame
        const detections = await faceapi.detectAllFaces(
          video,
          options
        );

        // End timing detection
        const endTime = performance.now();

        // Update performance statistics with detection duration
        onFrame(endTime - startTime);

        // Update detected faces state
        setFaces(detections);

        // Schedule the next frame detection
        rafRef.current = requestAnimationFrame(loop);
      };

      // Start the detection loop
      rafRef.current = requestAnimationFrame(loop);
    }

    // Start the face detection process
    start();

    // Cleanup function executed when component unmounts
    return () => {
      // Stop the detection loop
      running = false;

      // Cancel any pending animation frame
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [videoRef]);

  // Return detected faces and performance statistics
  return { faces, stats };
}



