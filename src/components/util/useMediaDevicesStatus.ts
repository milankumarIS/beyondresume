import { useEffect, useRef, useState } from "react";

const useMediaDevicesStatus = () => {
  const [hasCamera, setHasCamera] = useState(false);
  const [cameraAccessible, setCameraAccessible] = useState(false);
  const [hasMic, setHasMic] = useState(false);
  const [micAccessible, setMicAccessible] = useState(false);
  const [micSilent, setMicSilent] = useState(true);
  const [isMicOn, setIsMicOn] = useState(false);

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    // ---------- CAMERA CHECK ----------
    const checkCamera = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((d) => d.kind === "videoinput");

        if (videoDevices.length > 0) {
          setHasCamera(true);

          try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            stream.getTracks().forEach((t) => t.stop());
            setCameraAccessible(true);
          } catch (err) {
            console.warn("Camera exists but not accessible:", err);
            setCameraAccessible(false);
          }
        } else {
          console.warn("No camera found");
          setHasCamera(false);
        }
      } catch (err) {
        console.error("Error checking camera:", err);
        setHasCamera(false);
      }
    };

    // ---------- MICROPHONE CHECK ----------
    const initMicDetection = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioDevices = devices.filter((d) => d.kind === "audioinput");

        if (audioDevices.length > 0) {
          setHasMic(true);

          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaStreamRef.current = stream;
          setMicAccessible(true);
          setIsMicOn(true);

          const audioContext = new AudioContext();
          audioContextRef.current = audioContext;
          const source = audioContext.createMediaStreamSource(stream);
          const analyser = audioContext.createAnalyser();
          analyser.fftSize = 512;
          source.connect(analyser);
          analyserRef.current = analyser;

          const data = new Uint8Array(analyser.frequencyBinCount);
          let silentCounter = 0;

          intervalRef.current = window.setInterval(() => {
            analyser.getByteFrequencyData(data);
            const avg = data.reduce((a, b) => a + b, 0) / data.length;

            if (avg < 1) {
              silentCounter++;
              if (silentCounter >= 10) {
                setMicSilent(true);
                setIsMicOn(false);
              }
            } else {
              silentCounter = 0;
              setMicSilent(false);
              setIsMicOn(true);
            }
          }, 500);
        } else {
          console.warn("No microphone found");
          setHasMic(false);
        }
      } catch (err) {
        console.warn("Microphone not accessible:", err);
        setHasMic(false);
        setMicAccessible(false);
        setMicSilent(true);
        setIsMicOn(false);
      }
    };

    checkCamera();
    initMicDetection();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      audioContextRef.current?.close();
      analyserRef.current?.disconnect();
      mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return {
    hasCamera,
    cameraAccessible,
    hasMic,
    micAccessible,
    micSilent,
    isMicOn,
  };
};

export default useMediaDevicesStatus;
