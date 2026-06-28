import { StyleSheet } from 'react-native';
import { colors, spacing, typography, globalStyles } from '../../../shared/theme/theme';

export const styles = StyleSheet.create({
  container: {
    ...globalStyles.container,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.xxl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    backgroundColor: colors.surface,
  },
  headerTitle: {
    color: colors.text,
    ...typography.headerTitle,
  },
  headerBtn: {
    color: colors.primary,
    ...typography.buttonText,
  },
  canvas: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
    marginTop: spacing.xxl,
  },
  emptyText: {
    color: colors.textMuted,
    marginTop: 100,
  },
  stickerWrapper: {
    position: 'absolute',
    width: 250,
    height: 250,
  },
  stickerImage: {
    width: '100%',
    height: '100%',
  },
  bubble: {
    position: 'absolute',
    backgroundColor: colors.bubbleBackground,
    padding: spacing.sm,
    borderRadius: 15,
    maxWidth: 150,
  },
  bubbleText: {
    color: colors.bubbleText,
    ...typography.bodyText,
  },
  reactionInputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surfaceLight,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surfaceOverlay,
    color: colors.text,
    padding: spacing.sm,
    borderRadius: 8,
  }
});
