import { useState, useEffect, useRef } from "react";

export function useDragging() {
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const appRef = useRef(null);

  const handleMouseDown = (e) => {
    if (e.target.closest("select, input, button, .file-selector")) return;
    setDragging(true);
    const rect = appRef.current.getBoundingClientRect();
    setDragStart({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (dragging) {
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;
        appRef.current.style.left = `${newX}px`;
        appRef.current.style.top = `${newY}px`;
        appRef.current.style.transform = "none";
        appRef.current.style.bottom = "auto";
      }
    };

    const handleMouseUp = () => {
      setDragging(false);
    };

    if (dragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, dragStart]);

  const handleResize = () => {
    if (appRef.current) {
      const rect = appRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth - 20;
      const windowHeight = window.innerHeight - 20;
      let newLeft = rect.left;
      let newTop = rect.top;
      if (newLeft < 0) newLeft = 20;
      if (newTop < 0) newTop = 20;
      if (newLeft + rect.width > windowWidth)
        newLeft = windowWidth - rect.width;
      if (newTop + rect.height > windowHeight)
        newTop = windowHeight - rect.height;
      appRef.current.style.left = `${newLeft}px`;
      appRef.current.style.top = `${newTop}px`;
      appRef.current.style.bottom = "auto";
      appRef.current.style.transform = "none";
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { appRef, handleMouseDown, dragging, handleResize };
}
