import React, { useState, useEffect, useRef, useCallback } from "react";

const BackgroundPreview = ({ processedImage, processing, lowOpacity }) => {
  const [show, setShow] = useState(false);
  const firstLoad = useRef(true);
  const [zoom, setZoom] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (lowOpacity) {
      setZoom(1);
      setOffsetX(0);
      setOffsetY(0);
    }
  }, [lowOpacity]);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!processing && processedImage) {
      const delay = firstLoad.current ? 300 : 0;
      timerRef.current = setTimeout(() => {
        setShow(true);
        if (firstLoad.current) firstLoad.current = false;
        timerRef.current = null;
      }, delay);
    } else if (!processedImage) {
      timerRef.current = setTimeout(() => {
        setShow(false);
        timerRef.current = null;
      }, 0);
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [processing, processedImage]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offsetX, y: e.clientY - offsetY });
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (isDragging) {
        setOffsetX(e.clientX - dragStart.x);
        setOffsetY(e.clientY - dragStart.y);
      }
    },
    [isDragging, dragStart],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = (e) => {
    e.preventDefault();
    if (e.ctrlKey) {
      const zoomFactor = e.deltaY > 0 ? 0.95 : 1.05;
      setZoom((prevZoom) => Math.min(Math.max(prevZoom * zoomFactor, 0.1), 5));
    } else {
      setOffsetX((prev) => prev - e.deltaX);
      setOffsetY((prev) => prev - e.deltaY);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
      return () => container.removeEventListener("wheel", handleWheel);
    }
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);
  return (
    <div
      ref={containerRef}
      className={`background-preview ${show ? "visible" : ""} ${isDragging ? "dragging" : ""}`}
      onMouseDown={handleMouseDown}
    >
      <img
        src={processedImage}
        alt="Processed wallpaper preview"
        className={`processed-image ${isDragging ? "dragging" : ""}`}
        onMouseDown={handleMouseDown}
        style={{
          transform: `scale(${zoom}) translate(${offsetX / zoom}px, ${offsetY / zoom}px)`,
          transformOrigin: "center",
        }}
      />
      <button
        onClick={() => {
          setZoom(1);
          setOffsetX(0);
          setOffsetY(0);
        }}
        className="reset-button"
      >
        ⛶
      </button>
    </div>
  );
};

export default React.memo(BackgroundPreview);
