import React, { useEffect } from "react";
import "./App.css";
import Controls from "./components/Controls";
import FileSection from "./components/FileSection";
import BackgroundPreview from "./components/BackgroundPreview";
import { useMacModelDetection } from "./hooks/useMacModelDetection";
import { useDragging } from "./hooks/useDragging";
import { useImageProcessing } from "./hooks/useImageProcessing";
import { AppProvider } from "./contexts/AppContext";
import { useAppContext } from "./hooks/useAppContext";

function AppContent() {
  const { state, dispatch } = useAppContext();
  const { macModels } = useMacModelDetection(dispatch);
  const { appRef, handleMouseDown, dragging, handleResize } = useDragging();

  const { image, processedImage, processing, handleFileChange, downloadImage } =
    useImageProcessing(
      state.macModel,
      macModels,
      state.barHeight,
      state.barColor,
      state.bgMode,
      state.cornerRadius,
      state.squircle,
      state.shadowBlur,
      state.shadowColor,
      state.shadowOpacity,
      state.centerCornerRadius,
      state.centerScale,
      state.centerBgColor,
    );

  useEffect(() => {
    document.body.style.background = "none";
  }, [processedImage]);

  useEffect(() => {
    handleResize();
  }, [handleResize]);

  useEffect(() => {
    const handleWheel = (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };
    document.addEventListener("wheel", handleWheel, { passive: false });
    return () => document.removeEventListener("wheel", handleWheel);
  }, []);

  useEffect(() => {
    dispatch({ type: "SET_IMAGE", payload: image });
  }, [image, dispatch]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        dispatch({ type: "SET_LOW_OPACITY", payload: true });
      }
    };
    const handleKeyUp = (e) => {
      if (e.code === "Space") {
        dispatch({ type: "SET_LOW_OPACITY", payload: false });
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [dispatch]);

  return (
    <>
      <div
        className="app"
        ref={appRef}
        onMouseDown={handleMouseDown}
        style={{
          cursor: dragging ? "grabbing" : "grab",
          opacity: state.lowOpacity ? 0 : 1,
          filter: state.lowOpacity ? "blur(10px)" : "none",
        }}
      >
        <div className="main-layout">
          <Controls />
          <div className="separator"></div>
          <FileSection
            image={image}
            processing={processing}
            handleFileChange={handleFileChange}
            downloadImage={downloadImage}
            processedImage={processedImage}
          />
        </div>
      </div>
      <BackgroundPreview
        processedImage={processedImage}
        processing={processing}
        lowOpacity={state.lowOpacity}
      />
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
