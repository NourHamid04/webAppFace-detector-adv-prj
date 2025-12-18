import { useEffect, useRef } from "react";
import { useUserMedia } from "../../hooks/useUserMedia";
import { useFaceApi } from "../../hooks/useFaceApi";
import { useFaceAnalytics } from "../../hooks/useFaceAnalytics";

import PerformancePanel from "../PerformancePanel";
import AnalyticsPanel from "../AnalyticsPanel";

export default function VideoStage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const { stream, error } = useUserMedia({
    video: { facingMode: "user" },
    audio: false,
  });

  const { faces, stats } = useFaceApi(videoRef);
  const analytics = useFaceAnalytics(faces, videoRef);

  /* 🔹 Attach stream to video */
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  /* 🔹 FIX 1: Size canvas when video metadata is ready */
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const handleLoadedMetadata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      video.removeEventListener(
        "loadedmetadata",
        handleLoadedMetadata
      );
    };
  }, []);

  /* 🔹 FIX 2: Draw faces ONLY when detections change */
  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    if (canvas.width === 0 || canvas.height === 0) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#00ff00";
    ctx.lineWidth = 2;

    faces.forEach((face) => {
      const { x, y, width, height } = face.box;
      ctx.strokeRect(x, y, width, height);
    });
  }, [faces]);

  if (error) {
    return <div className="text-red-400">{error.message}</div>;
  }

  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover"
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      <PerformancePanel stats={stats} />
      <AnalyticsPanel analytics={analytics} />
    </div>
  );
}
