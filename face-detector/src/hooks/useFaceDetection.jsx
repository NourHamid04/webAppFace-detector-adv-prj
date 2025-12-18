import { useEffect, useRef, useState } from "react";
import { loadFaceDetector, detectFaces } from "../services/faceDetector";

export function useFaceDetection(videoRef) {
  const [faces, setFaces] = useState([]);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return;

    let running = true;

    async function start() {
      await loadFaceDetector();

      const loop = async () => {
        if (!running || !videoRef.current) return;

        const video = videoRef.current;

        if (video.videoWidth > 0 && video.videoHeight > 0) {
          const detections = await detectFaces(video);
          setFaces(detections);
        }

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

  return faces;
}
