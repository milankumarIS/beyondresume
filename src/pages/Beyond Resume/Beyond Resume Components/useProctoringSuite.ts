import { useEffect, useRef, useState } from "react";

type DetectionResults = {
  objects: string[];
  faces: number;
};

export const useProctoringSuite = (
  videoRef: React.RefObject<HTMLVideoElement | null>
) => {
  const [results, setResults] = useState<DetectionResults>({
    objects: [],
    faces: 1,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [proctoringReady, setProctoringReady] = useState(false);

  useEffect(() => {
    setProctoringReady(true);
  }, []);

  useEffect(() => {
    if (!proctoringReady) return;

    let stop = false;
    let apiRunning = false;

    // Draw video continuously on canvas
    const drawVideo = () => {
      if (stop) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video && canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        }
      }
      requestAnimationFrame(drawVideo);
    };

    drawVideo();

    // Function to send frame to API
    const sendFrameToApi = async () => {
      if (apiRunning || stop) return;
      apiRunning = true;

      const video = videoRef.current;
      if (!video) {
        apiRunning = false;
        return;
      }

      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = video.videoWidth;
      tempCanvas.height = video.videoHeight;
      const tempCtx = tempCanvas.getContext("2d");
      tempCtx?.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);

      tempCanvas.toBlob(async (blob) => {
        if (!blob) {
          apiRunning = false;
          return;
        }

        try {
          const formData = new FormData();
          formData.append("image", blob, "frame.png");

          const response = await fetch("https://br.skillablers.com/api/detect/", {
            method: "POST",
            body: formData,
          });
          const data = await response.json();
// console.log(data);

          setResults({
            faces: data.faceResult?.faceCount ?? 0,
            objects: data.objectResult?.detectedClasses ?? [],
          });
        } catch (err) {
          console.warn("Detection API failed:", err);
        } finally {
          apiRunning = false;
          if (!stop) sendFrameToApi(); 
        }
      }, "image/jpeg");
    };

    // Start first API call after 1 second
    const timer = setTimeout(() => {
      if (!stop) sendFrameToApi();
    }, 1000);

    return () => {
      stop = true;
      clearTimeout(timer);
    };
  }, [videoRef, proctoringReady]);

  return { canvasRef, results, proctoringReady };
};
