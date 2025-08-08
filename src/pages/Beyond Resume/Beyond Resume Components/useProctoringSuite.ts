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
      await tf.ready();

      const faceDetector = await faceDetection.createDetector(
        SupportedModels.MediaPipeFaceDetector,
        {
          runtime: "tfjs",
          maxFaces: 5,
        }
      );
      faceDetectorRef.current = faceDetector;

      const cocoModel = await cocoSsd.load();
      cocoModelRef.current = cocoModel;

      setProctoringReady(true);
    };

    loadModels();
  }, []);

  // Proctoring readiness checker
  // useEffect(() => {
  //   const checkReady = setInterval(() => {
  //     const video = videoRef.current;
  //     if (
  //       cocoModelRef.current &&
  //       faceDetectorRef.current &&
  //       video?.readyState === 4 
  //     ) {
  //       setProctoringReady(true);
  //       clearInterval(checkReady);
  //     }
  //   }, 500);

  //   return () => clearInterval(checkReady);
  // }, [videoRef]);

  // Main detection loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
      if (!proctoringReady) return;

    const detect = async () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (
        !video ||
        !canvas ||
        !cocoModelRef.current ||
        !faceDetectorRef.current ||
        !proctoringReady
      )
        return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const faces = await faceDetectorRef.current.estimateFaces(video, {
        flipHorizontal: false,
      });

      const predictions = await cocoModelRef.current.detect(video);
      const objects = predictions.map((pred) => pred.class);

      setResults({ faces, objects });
    };

    interval = setInterval(detect, 1000);
    return () => clearInterval(interval);
  }, [videoRef, proctoringReady]);

  return {
    canvasRef,
    results,
    proctoringReady,
  };
};
