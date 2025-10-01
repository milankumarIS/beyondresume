import { useEffect, useRef, useState } from "react";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import * as faceDetection from "@tensorflow-models/face-detection";
import { SupportedModels } from "@tensorflow-models/face-detection";
import "@tensorflow/tfjs-backend-webgl";

type DetectionResults = {
  objects: string[];
  faces: faceDetection.Face[];
};

export const useProctoringSuite = (
  videoRef: React.RefObject<HTMLVideoElement | null>
) => {
  const [results, setResults] = useState<DetectionResults>({
    objects: [],
    faces: [],
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cocoModelRef = useRef<cocoSsd.ObjectDetection | null>(null);
  const faceDetectorRef = useRef<faceDetection.FaceDetector | null>(null);
  const [proctoringReady, setProctoringReady] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      await tf.setBackend("webgl");
      await tf.ready();

      const faceDetector = await faceDetection.createDetector(
        SupportedModels.MediaPipeFaceDetector,
        { runtime: "tfjs", maxFaces: 3 }
      );
      faceDetectorRef.current = faceDetector;

      const cocoModel = await cocoSsd.load({ base: "lite_mobilenet_v2" });
      cocoModelRef.current = cocoModel;

      setProctoringReady(true);
    };

    loadModels();
  }, []);

  useEffect(() => {
    if (!proctoringReady) return;
    let lastDetection = 0;
    let stop = false;

    const detect = async (time: number) => {
      if (stop) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;

      if (time - lastDetection > 800) {
        lastDetection = time;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Resize canvas to video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Downscale input for performance (internal detection only)
        const tempCanvas = document.createElement("canvas");
        const scale = 0.20; // ~40% of original
        tempCanvas.width = video.videoWidth * scale;
        tempCanvas.height = video.videoHeight * scale;
        const tmpCtx = tempCanvas.getContext("2d");
        tmpCtx?.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);

        const input = tf.browser.fromPixels(tempCanvas);

        // Run both detectors
        const [faces, predictions] = await Promise.all([
          faceDetectorRef.current?.estimateFaces(input),
          cocoModelRef.current?.detect(tempCanvas),
        ]);

        const objects = predictions?.map((pred) => pred.class) || [];
        setResults({ faces: faces || [], objects });

        input.dispose(); // free GPU memory

        // Draw video back
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }

      requestAnimationFrame(detect);
    };

    requestAnimationFrame(detect);
    return () => {
      stop = true;
    };
  }, [videoRef, proctoringReady]);

  return { canvasRef, results, proctoringReady };
};