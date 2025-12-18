import { useEffect, useState } from "react";

export function useUserMedia(constraints) {
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((mediaStream) => {
        if (active) setStream(mediaStream);
      })
      .catch((err) => setError(err));

    return () => {
      active = false;
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  return { stream, error };
}
