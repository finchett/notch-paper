import { useState, useRef, useEffect, useCallback } from "react";

export function useImageProcessing(
  macModel,
  macModels,
  barHeight,
  barColor,
  bgMode,
  cornerRadius,
  squircle,
  shadowBlur,
  shadowColor,
  shadowOpacity,
  centerCornerRadius,
  centerScale,
  centerBgColor,
) {
  const [image, setImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [processing, setProcessing] = useState(false);

  const workerRef = useRef(null);
  const timeoutRef = useRef(null);
  const previousUrlRef = useRef(null);

  useEffect(() => {
    workerRef.current = new Worker(new URL("../worker.js", import.meta.url));
    workerRef.current.onmessage = (e) => {
      if (e.data !== "error") {
        if (previousUrlRef.current) {
          URL.revokeObjectURL(previousUrlRef.current);
        }
        const url = URL.createObjectURL(e.data);
        previousUrlRef.current = url;
        setProcessedImage(url);
      }
      setProcessing(false);
    };
    return () => {
      workerRef.current.terminate();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (previousUrlRef.current) {
        URL.revokeObjectURL(previousUrlRef.current);
      }
    };
  }, []);

  const processImage = useCallback(() => {
    if (image) {
      setProcessing(true);
      const { width, height } = macModels[macModel];
      workerRef.current.postMessage({
        imageSrc: image.src,
        width,
        height,
        barHeight,
        barColor,
        bgMode,
        cornerRadius,
        squircle,
        shadowBlur,
        shadowColor,
        shadowOpacity,
        centerCornerRadius,
        centerScale,
        centerBgColor,
      });
    }
  }, [
    image,
    macModels,
    macModel,
    barHeight,
    barColor,
    bgMode,
    cornerRadius,
    squircle,
    shadowBlur,
    shadowColor,
    shadowOpacity,
    centerCornerRadius,
    centerScale,
    centerBgColor,
  ]);

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    // Set debounce very low because things typically don't take long.
    timeoutRef.current = setTimeout(processImage, 20);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [processImage]);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setImage(img);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const downloadImage = useCallback(() => {
    if (!processedImage) return;
    const link = document.createElement("a");
    link.download = "notch-hidden-background.png";
    link.href = processedImage;
    link.click();
  }, [processedImage]);

  return {
    image,
    processedImage,
    processing,
    handleFileChange,
    downloadImage,
  };
}
