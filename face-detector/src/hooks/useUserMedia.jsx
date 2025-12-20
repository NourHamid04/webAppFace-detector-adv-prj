import { useEffect, useState } from "react";

// Custom hook to request and manage user media (camera / microphone)
export function useUserMedia(constraints) {
  // State holding the MediaStream returned by getUserMedia
  const [stream, setStream] = useState(null);

  // State holding any error that occurs while requesting media
  const [error, setError] = useState(null);

  useEffect(() => {
    // Flag to prevent state updates after unmount
    let active = true;

    // Request access to user media using browser API
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((mediaStream) => {
        // Update state only if the component is still mounted
        if (active) setStream(mediaStream);
      })
      .catch((err) => {
        // Store permission or device errors
        setError(err);
      });

    // Cleanup function executed on component unmount
    return () => {
      // Mark hook as inactive
      active = false;

      // Stop all media tracks to release camera/mic resources
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // Expose the media stream and any error
  return { stream, error };
}
