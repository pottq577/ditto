import { StyleSheet } from "react-native";
import {
  colors,
  spacing,
  typography,
  globalStyles,
} from "../../../shared/theme/theme";

export const styles = StyleSheet.create({
  container: {
    ...globalStyles.container,
    ...globalStyles.center,
  },
  text: {
    color: colors.text,
    marginBottom: spacing.lg,
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
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
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
  },
  sendButton: {
    backgroundColor: colors.primary,
  },
  buttonText: {
    color: colors.text,
    ...typography.buttonText,
  },
  loader: {
    position: "absolute",
  },
});
