import React, { useRef, useEffect } from "react";
import { useAppContext } from "../hooks/useAppContext";

const Controls = () => {
  const { state, dispatch } = useAppContext();
  const dropdownRef = useRef();

  const barHeightOptions = {
    "Menu Bar (M1 Pro 74px)": 74,
    "Notch (M2+ 64px)": 64,
  };

  useEffect(() => {
    const app = document.querySelector(".app");
    const advancedSection = dropdownRef.current
      ? dropdownRef.current.parentElement
      : null;

    const updatePosition = () => {
      if (!dropdownRef.current) return;

      const appRect = app.getBoundingClientRect();
      const dropdown = dropdownRef.current;
      const dropdownWidth = 310;
      const margin = 10;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let left, top;

      // Calculate positions relative to app's top-left
      const rightPos = appRect.width + margin;
      const leftPos = -dropdownWidth - margin;
      const belowPos = appRect.height + margin;
      const abovePos = -200 - margin;

      // Check if placing to the right fits in viewport
      if (appRect.left + rightPos + dropdownWidth <= viewportWidth) {
        left = rightPos;
        top = 0;
      } else if (appRect.left + leftPos >= 0) {
        // Place to the left
        left = leftPos;
        top = 0;
      } else {
        // Fallback: below or above
        if (appRect.top + belowPos + 200 <= viewportHeight) {
          left = 0;
          top = belowPos;
        } else {
          left = 0;
          top = Math.max(-appRect.top + 10, abovePos);
        }
      }

      dropdown.style.left = left + "px";
      dropdown.style.top = top + "px";
      dropdown.style.right = "auto";
      dropdown.style.bottom = "auto";
    };

    if (state.advancedOpen && dropdownRef.current) {
      // Move dropdown to app for absolute positioning relative to app
      app.appendChild(dropdownRef.current);
      updatePosition();

      // Set invisible initially
      dropdownRef.current.style.opacity = "0";
      dropdownRef.current.style.transform = "scale(0.9)";
      dropdownRef.current.style.pointerEvents = "none";

      // Make visible after positioning
      requestAnimationFrame(() => {
        if (dropdownRef.current) {
          dropdownRef.current.style.opacity = "1";
          dropdownRef.current.style.transform = "scale(1)";
          dropdownRef.current.style.pointerEvents = "auto";
        }
      });

      // Listen for mousemove to update position during dragging
      const handleMouseMove = () => updatePosition();
      document.addEventListener("mousemove", handleMouseMove);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
      };
    } else if (
      (dropdownRef.current && advancedSection) ||
      (dropdownRef.current && !state.advancedOpen)
    ) {
      // Start close animation
      dropdownRef.current.style.opacity = "0";
      dropdownRef.current.style.transform = "scale(0.9)";
      dropdownRef.current.style.pointerEvents = "none";

      // Move back to advanced-section after animation
      setTimeout(() => {
        if (dropdownRef.current && advancedSection) {
          advancedSection.appendChild(dropdownRef.current);
          // Reset to default position
          dropdownRef.current.style.left = "100%";
          dropdownRef.current.style.top = "0";
          dropdownRef.current.style.right = "auto";
          dropdownRef.current.style.bottom = "auto";
        }
      }, 200); // Match animation duration
    }
  }, [state.advancedOpen]);

  return (
    <div className="controls">
      <div className="control-group">
        <small>Color</small>
        <input
          type="color"
          value={state.barColor}
          disabled={!state.image}
          onChange={(e) =>
            dispatch({ type: "SET_BAR_COLOR", payload: e.target.value })
          }
        />
      </div>
      <div className="control-group">
        <small>Model</small>
        <select
          value={state.macModel}
          disabled={!state.image}
          onChange={(e) =>
            dispatch({ type: "SET_MAC_MODEL", payload: e.target.value })
          }
        >
          {Object.keys(state.macModels).map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
      </div>
      <div className="control-group">
        <small>Height</small>
        <select
          value={state.barHeight}
          disabled={!state.image}
          onChange={(e) =>
            dispatch({
              type: "SET_BAR_HEIGHT",
              payload: Number(e.target.value),
            })
          }
        >
          {Object.entries(barHeightOptions).map(([label, value]) => (
            <option key={label} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div className="control-group">
        <small>Background Mode</small>
        <div className="background-mode-container">
          <div className="select-wrapper">
            <select
              value={state.bgMode}
              disabled={!state.image}
              onChange={(e) => {
                dispatch({ type: "SET_BG_MODE", payload: e.target.value });
                dispatch({ type: "SET_ADVANCED_OPEN", payload: false });
              }}
            >
              <option value="Stretch">Stretch</option>
              <option value="Center">Center</option>
            </select>
          </div>
          {state.bgMode === "Center" && (
            <span
              onClick={
                state.image
                  ? () =>
                      dispatch({
                        type: "SET_ADVANCED_OPEN",
                        payload: !state.advancedOpen,
                      })
                  : undefined
              }
              className={`cog-icon ${!state.image ? "disabled" : ""}`}
            >
              ⚙
            </span>
          )}
        </div>
      </div>
      {(state.bgMode === "Center" || dropdownRef) && (
        <div className="advanced-section">
          <div ref={dropdownRef} className="advanced-content">
            <div
              className="close-button"
              onClick={() =>
                dispatch({ type: "SET_ADVANCED_OPEN", payload: false })
              }
            >
              <span className="close-icon">×</span>
            </div>
            <div className="control-group" style={{ marginRight: "10px" }}>
              <small>Shadow Color</small>
              <input
                type="color"
                value={state.shadowColor}
                disabled={!state.image}
                onChange={(e) =>
                  dispatch({
                    type: "SET_SHADOW_COLOR",
                    payload: e.target.value,
                  })
                }
              />
            </div>
            <div className="control-group">
              <small>Shadow Blur</small>
              <div className="range-group">
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={state.shadowBlur}
                  disabled={!state.image}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_SHADOW_BLUR",
                      payload: Number(e.target.value),
                    })
                  }
                />
                <small>{state.shadowBlur}px</small>
              </div>
            </div>
            <div className="control-group">
              <small>Shadow Opacity</small>
              <div className="range-group">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={state.shadowOpacity}
                  disabled={!state.image}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_SHADOW_OPACITY",
                      payload: Number(e.target.value),
                    })
                  }
                />
                <small>{state.shadowOpacity}</small>
              </div>
            </div>
            <div className="control-group">
              <small>Center Scale</small>
              <div className="range-group">
                <input
                  type="range"
                  min="0.1"
                  max="2"
                  step="0.1"
                  value={state.centerScale}
                  disabled={!state.image}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_CENTER_SCALE",
                      payload: Number(e.target.value),
                    })
                  }
                />
                <small>{state.centerScale.toFixed(1)}x</small>
              </div>
            </div>
            <div className="control-group">
              <small>Center Background Color</small>
              <input
                type="color"
                value={state.centerBgColor}
                disabled={!state.image}
                onChange={(e) =>
                  dispatch({
                    type: "SET_CENTER_BG_COLOR",
                    payload: e.target.value,
                  })
                }
              />
            </div>
            <div className="control-group">
              <small>Corner Radius</small>
              <div className="button-group">
                {[
                  { value: 0 },
                  { value: 16 },
                  { value: 32 },
                  { value: 48 },
                ].map((option) => (
                  <button
                    key={option.value}
                    disabled={!state.image}
                    onClick={() =>
                      dispatch({
                        type: "SET_CENTER_CORNER_RADIUS",
                        payload: option.value,
                      })
                    }
                    className={
                      state.centerCornerRadius === option.value
                        ? "selected"
                        : ""
                    }
                  >
                    {option.value === 0 ? (
                      "None"
                    ) : (
                      <>
                        {option.value}
                        <small>px</small>
                      </>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <small className="space-tooltip">
        Hold <code>space</code> to focus
      </small>
    </div>
  );
};

export default React.memo(Controls);
