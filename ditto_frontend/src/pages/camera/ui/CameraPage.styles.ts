import { StyleSheet } from "react-native";
import { spacing, typography, lightColors } from "@/shared/theme/theme";

export const createStyles = (colors: typeof lightColors, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: colors.text,
    marginBottom: spacing.lg,
    ...typography.bodyText,
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: spacing.xl,
  },
  captureBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.overlay,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.text,
  },
  captureInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.text,
  },
  preview: {
    flex: 1,
    width: "100%",
  },
  actionRow: {
    position: "absolute",
    bottom: spacing.xl,
    flexDirection: "row",
    gap: spacing.lg,
  },
  button: {
    backgroundColor: colors.surfaceOverlay,
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.3 : 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sendButton: {
    backgroundColor: colors.primary,
  },
  buttonText: {
    color: colors.text,
    ...typography.buttonText,
  },
  sendButtonText: {
    color: isDark ? colors.text : "#FFFFFF", // 흰색 텍스트 강제 (프라이머리 컬러 위)
    ...typography.buttonText,
  },
  loader: {
    position: "absolute",
  },
});
