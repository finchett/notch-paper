import React, { useReducer } from "react";
import { AppContext } from "../hooks/useAppContext";

// Initial state for all centralized app state
const initialState = {
  barColor: "#000000",
  macModel: 'MacBook Pro 16"',
  macModels: {
    'MacBook Air 13"': { width: 2560, height: 1600 },
    'MacBook Pro 13"': { width: 2560, height: 1600 },
    'MacBook Pro 14"': { width: 3024, height: 1964 },
    'MacBook Pro 16"': { width: 3456, height: 2234 },
    'MacBook Air 15"': { width: 2880, height: 1864 },
  },
  barHeight: 74,
  bgMode: "Center",
  shadowColor: "#000000",
  shadowBlur: 10,
  shadowOpacity: 0.3,
  centerCornerRadius: 0,
  advancedOpen: false,
  centerScale: 1,
  centerBgColor: "#ffffff",
  cornerRadius: 0,
  squircle: false,
  image: null,
  lowOpacity: false,
};

// Reducer function to handle state updates
function appReducer(state, action) {
  switch (action.type) {
    case "SET_BAR_COLOR":
      return { ...state, barColor: action.payload };
    case "SET_MAC_MODEL":
      return { ...state, macModel: action.payload };
    case "SET_BAR_HEIGHT":
      return { ...state, barHeight: action.payload };
    case "SET_BG_MODE":
      return { ...state, bgMode: action.payload };
    case "SET_SHADOW_COLOR":
      return { ...state, shadowColor: action.payload };
    case "SET_SHADOW_BLUR":
      return { ...state, shadowBlur: action.payload };
    case "SET_SHADOW_OPACITY":
      return { ...state, shadowOpacity: action.payload };
    case "SET_CENTER_CORNER_RADIUS":
      return { ...state, centerCornerRadius: action.payload };
    case "SET_ADVANCED_OPEN":
      return { ...state, advancedOpen: action.payload };
    case "SET_CENTER_SCALE":
      return { ...state, centerScale: action.payload };
    case "SET_CENTER_BG_COLOR":
      return { ...state, centerBgColor: action.payload };
    case "SET_CORNER_RADIUS":
      return { ...state, cornerRadius: action.payload };
    case "SET_SQUIRCLE":
      return { ...state, squircle: action.payload };
    case "SET_IMAGE":
      return { ...state, image: action.payload };
    case "SET_LOW_OPACITY":
      return { ...state, lowOpacity: action.payload };
    default:
      return state;
  }
}

// Provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}
