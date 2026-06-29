import React from "react";
import {
  Pressable,
  PressableProps,
  StyleProp,
  ViewStyle,
  StyleSheet,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface AnimatedButtonProps extends PressableProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  static?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const AnimatedButton = ({
  children,
  style,
  static: isStatic = false,
  ...props
}: AnimatedButtonProps) => {
  const scale = useSharedValue(1);

  const flattenedStyle = StyleSheet.flatten(style) ?? {};
  const baseTransform = (flattenedStyle.transform as any[]) ?? [];
  const { transform: _ignoredTransform, ...restStyle } = flattenedStyle;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [...baseTransform, { scale: scale.value }],
    };
  });

  const handlePressIn = (e: any) => {
    if (!isStatic) {
      scale.value = withSpring(0.96, {
        mass: 0.5,
        stiffness: 400,
        damping: 20,
      });
    }
    props.onPressIn?.(e);
  };

  const handlePressOut = (e: any) => {
    if (!isStatic) {
      scale.value = withSpring(1, {
        mass: 0.5,
        stiffness: 400,
        damping: 20,
      });
    }
    props.onPressOut?.(e);
  };

  return (
    <AnimatedPressable
      {...props}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[restStyle, animatedStyle]}
    >
      {children}
    </AnimatedPressable>
  );
};
