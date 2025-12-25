import { useEffect } from "react";

const macModels = {
  'MacBook Air 13"': { width: 2560, height: 1600 },
  'MacBook Pro 13"': { width: 2560, height: 1600 },
  'MacBook Pro 14"': { width: 3024, height: 1964 },
  'MacBook Pro 16"': { width: 3456, height: 2234 },
  'MacBook Air 15"': { width: 2880, height: 1864 },
};

export function useMacModelDetection(dispatch) {
  useEffect(() => {
    const dpr = window.devicePixelRatio || 1;
    const screenWidth = Math.round(window.screen.width * dpr);
    const screenHeight = Math.round(window.screen.height * dpr);
    let closestModel = null;
    let minDiff = Infinity;
    for (const [model, dims] of Object.entries(macModels)) {
      const diff =
        Math.abs(dims.width - screenWidth) +
        Math.abs(dims.height - screenHeight);
      if (diff < minDiff) {
        minDiff = diff;
        closestModel = model;
      }
    }
    if (closestModel && minDiff <= 200) {
      dispatch({ type: "SET_MAC_MODEL", payload: closestModel });
    }
  }, [dispatch]);

  return { macModels };
}
