import React, { createContext, useContext, ReactNode } from "react";
import { useColorScheme } from "react-native";

export const lightColors = {
  background: "#F9F8F6",
  surface: "#FFFFFF",
  surfaceLight: "#F2F0EB",
  surfaceOverlay: "#E5E3DB",
  primary: "#E85D4E",
  text: "#2C2C2A",
  textMuted: "#8E8D8A",
  error: "#E85D4E",
  overlay: "rgba(249, 248, 246, 0.7)",
  bubbleBackground: "rgba(255, 255, 255, 0.95)",
  bubbleText: "#2C2C2A",
  divider: "rgba(44, 44, 42, 0.1)",
  stickerBorder: "#FFFFFF",
};

export const darkColors = {
  background: "#1A1B22",
  surface: "#2A2D35",
  surfaceLight: "#23252C",
  surfaceOverlay: "#3A3D46",
  primary: "#E85D4E",
  text: "#EAE8E3",
  textMuted: "#8E8D8A",
  error: "#E85D4E",
  overlay: "rgba(26, 27, 34, 0.7)",
  bubbleBackground: "rgba(42, 45, 53, 0.95)",
  bubbleText: "#EAE8E3",
  divider: "rgba(234, 232, 227, 0.1)",
  stickerBorder: "#2A2D35",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 40,
  xxl: 50,
};

export const typography = {
  headerTitle: {
    fontFamily: "GowunBatang_400Regular",
    fontSize: 24,
  },
  buttonText: {
    fontFamily: "GowunDodum_400Regular",
    fontSize: 16,
  },
  bodyText: {
    fontFamily: "GowunDodum_400Regular",
    fontSize: 16,
    lineHeight: 22,
  },
  mutedText: {
    fontFamily: "GowunDodum_400Regular",
    fontSize: 14,
  },
};

type ThemeContextType = {
  colors: typeof lightColors;
  isDark: boolean;
};

export const ThemeContext = createContext<ThemeContextType>({
  colors: lightColors,
  isDark: false,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const activeColors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ colors: activeColors, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};
