// src/shared/theme/theme.ts
export const colors = {
  background: "#000000",
  surface: "#111111",
  surfaceLight: "#222222",
  surfaceOverlay: "#333333",
  primary: "#4A90E2",
  text: "#ffffff",
  textMuted: "#aaaaaa",
  error: "#FF4444",
  overlay: "rgba(255,255,255,0.3)",
  bubbleBackground: "rgba(255,255,255,0.9)",
  bubbleText: "#000000",
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
    fontSize: 18,
    fontWeight: "bold" as const,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold" as const,
  },
  bodyText: {
    fontSize: 14,
  },
};

export const globalStyles = {
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
};
