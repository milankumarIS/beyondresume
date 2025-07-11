import { useEffect, useRef } from "react";

export default function GLBViewer({
  height = "500px",
  isSpeaking,
  zoom = 60,
  onLoaded, 
}: {
  height?: any;
  zoom?: any;
  isSpeaking?: boolean;
  onLoaded?: () => void; 
}) {

const url = "https://models.readyplayer.me/6867705729169260c205d1bc.glb";

  const modelRef = useRef<any>(null);
  const mouthAnimationRef = useRef<number | null>(null);
  const rotationAnimationRef = useRef<number | null>(null);

  useEffect(() => {
    const modelViewer = modelRef.current;
    if (!modelViewer) return;

    const handleLoad = () => {
      const model = modelViewer.model;
      if (!model) {
        return;
      }

      if (onLoaded) onLoaded();

      const symbols = Object.getOwnPropertySymbols(model);
      const rootsSymbol = symbols.find((sym) =>
        sym.toString().includes("roots")
      );
      if (!rootsSymbol) {
        console.warn("⚠️ Could not find 'roots' symbol.");
        return;
      }

      const nodes = model[rootsSymbol];
      const headNode = nodes.find((node: any) => node.name === "Wolf3D_Head");
      const teethNode = nodes.find((node: any) => node.name === "Wolf3D_Teeth");

      const mouthOpenIndex = headNode.mesh.morphTargetDictionary["mouthOpen"];
      const mouthSmileIndex = headNode.mesh.morphTargetDictionary["mouthSmile"];

      let time = 0;

      const animateMouth = () => {
        time += 0.05;
        const factor = 3.5;

        headNode.mesh.morphTargetInfluences[mouthOpenIndex] =
          (Math.sin(time * factor) + 1) / 2;
        headNode.mesh.morphTargetInfluences[mouthSmileIndex] =
          Math.sin(time * factor) / 3;

        mouthAnimationRef.current = requestAnimationFrame(animateMouth);
      };

      const animateRotation = () => {
        time += 0.0001;
        const maxRotation = 1;
        const angle = Math.sin(time) * maxRotation;
        const elevation = isSpeaking ? 120 : 90;
        const distance = isSpeaking ? zoom : 100;
        modelViewer.cameraOrbit = `${angle}deg ${elevation}deg ${distance}%`;
        modelViewer.cameraTarget = isSpeaking ? "0m 1.35m 0m" : "auto";
        modelViewer.fieldOfView = isSpeaking ? "25deg" : "45deg";

        rotationAnimationRef.current = requestAnimationFrame(animateRotation);
      };

      if (isSpeaking) {
        animateMouth();
        animateRotation();
      } else {
        if (mouthAnimationRef.current)
          cancelAnimationFrame(mouthAnimationRef.current);
        if (rotationAnimationRef.current)
          cancelAnimationFrame(rotationAnimationRef.current);
      }
    };

    modelViewer.addEventListener("load", handleLoad);
    handleLoad();

    return () => {
      modelViewer.removeEventListener("load", handleLoad);
      if (mouthAnimationRef.current)
        cancelAnimationFrame(mouthAnimationRef.current);
      if (rotationAnimationRef.current)
        cancelAnimationFrame(rotationAnimationRef.current);
    };
  }, [isSpeaking, onLoaded]);

  return (
    <model-viewer
      ref={modelRef}
      src={url}
      alt="3D Model"
      render-mode="always"
      style={{ width: "100%", height: height }}
      min-camera-orbit="-10deg 90deg auto"
      max-camera-orbit="10deg 90deg auto"
    />
  );
}
