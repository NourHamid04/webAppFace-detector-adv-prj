import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { usePerformanceStats } from "./usePerformanceStats";

let modelsLoaded = false;

async function loadModels() {
  if (modelsLoaded) return;
  await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
  modelsLoaded = true;
}

export function useFaceApi(videoRef) {
  const [faces, setFaces] = useState([]);
  const rafRef = useRef(null);

  const { stats, onFrame } = usePerformanceStats();

  useEffect(() => {
    if (!videoRef.current) return;

    let running = true;

    async function start() {
      await loadModels();

      const video = videoRef.current;
      if (video.readyState < 2) {
        await new Promise((r) => (video.onloadeddata = r));
      }

      const options = new faceapi.TinyFaceDetectorOptions({
        inputSize: 224,
        scoreThreshold: 0.5,
      });

      const loop = async () => {
        if (!running) return;

        const startTime = performance.now();
        const detections = await faceapi.detectAllFaces(
          video,
          options
        );
        const endTime = performance.now();

        onFrame(endTime - startTime);
        setFaces(detections);

        rafRef.current = requestAnimationFrame(loop);
      };

      rafRef.current = requestAnimationFrame(loop);
    }

    start();

    return () => {
      running = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [videoRef]);

  return { faces, stats };
}
