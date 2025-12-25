import React, { useRef } from "react";
import { useAppContext } from "../hooks/useAppContext";

const FileSection = ({
  image,
  handleFileChange,
  downloadImage,
  processedImage,
}) => {
  const { state, dispatch } = useAppContext();
  const fileInputRef = useRef(null);

  return (
    <div className="file-section">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        id="file-input"
        style={{ display: "none" }}
      />
      <label htmlFor="file-input" className="file-selector">
        {image ? (
          <img src={image.src} alt="Selected Image" className="thumbnail" />
        ) : (
          <span className="choose-text">Choose Image</span>
        )}
      </label>
      <div className="file-controls">
        <div className="control-group">
          <small>Corner Radius</small>
          <div className="button-group">
            {[{ value: 0 }, { value: 16 }, { value: 32 }, { value: 48 }].map(
              (option) => (
                <button
                  key={option.value}
                  disabled={!state.image}
                  onClick={() =>
                    dispatch({
                      type: "SET_CORNER_RADIUS",
                      payload: option.value,
                    })
                  }
                  className={
                    state.cornerRadius === option.value ? "selected" : ""
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
              ),
            )}
          </div>
        </div>
        <div className="control-group">
          <small>Squircle</small>
          <input
            type="checkbox"
            disabled={!state.image}
            checked={state.squircle}
            onChange={(e) =>
              dispatch({ type: "SET_SQUIRCLE", payload: e.target.checked })
            }
          />
        </div>
      </div>

      <button onClick={downloadImage} disabled={!processedImage}>
        Download
      </button>
    </div>
  );
};

export default React.memo(FileSection);
