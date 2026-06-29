import React, { useState, useRef, useMemo } from "react";
import { Text, View, Image, ActivityIndicator, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system/legacy";
import { Logger } from "@/shared/lib/logger";
import { createStyles } from "./CameraPage.styles";
import { API_BASE_URL } from "@/shared/api/api";
import { useAuth } from "@/shared/lib/AuthContext";
import { BackgroundRemoval } from "@/shared/native/BackgroundRemovalModule";
import { useTheme } from "@/shared/theme/theme";
import { AnimatedButton } from "@/shared/ui/AnimatedButton";

export const CameraPage = ({ onComplete }: { onComplete: () => void }) => {
  const { userId, coupleId } = useAuth();
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  const [permission, requestPermission] = useCameraPermissions();
  const [processedUri, setProcessedUri] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>카메라 권한이 필요해요.</Text>
        <AnimatedButton style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>권한 허용하기</Text>
        </AnimatedButton>
      </View>
    );
  }

  const takePicture = async () => {
    if (!cameraRef.current) return;
    setIsProcessing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      if (!photo?.uri) return;

      if (BackgroundRemoval) {
        try {
          const nuked = await BackgroundRemoval.removeBackground(photo.uri);
          setProcessedUri(nuked);
        } catch (err: any) {
          Logger.error("누끼 처리 실패:", err);
          const msg =
            err?.code === "NO_SUBJECT"
              ? "대상을 찾지 못했어요. 다시 찍어주세요."
              : "배경을 지우는 중 문제가 생겼어요.";
          Alert.alert("오류", msg);
        } finally {
          try {
            await FileSystem.deleteAsync(photo.uri, { idempotent: true });
          } catch (e) {
            Logger.error("원본 파일 삭제 실패", e);
          }
        }
      } else {
        setProcessedUri(photo.uri);
      }
    } catch (error) {
      Logger.error("카메라 촬영 실패:", error);
      Alert.alert("오류", "사진을 찍지 못했어요.");
    } finally {
      setIsProcessing(false);
    }
  };

  const sendSticker = async () => {
    if (!processedUri || isProcessing) return;
    setIsProcessing(true);
    try {
      const formData = new FormData();
      const ext =
        processedUri.split(".").pop()?.toLowerCase() === "png" ? "png" : "jpeg";
      const mime = ext === "png" ? "image/png" : "image/jpeg";
      formData.append("file", {
        uri: processedUri,
        name: `sticker_${Date.now()}.${ext}`,
        type: mime,
      } as any);

      const response = await fetch(
        `${API_BASE_URL}/api/v1/stickers?coupleId=${coupleId || 1}`,
        {
          method: "POST",
          headers: {
            "X-User-Id": userId || "1",
          },
          body: formData,
        },
      );

      if (response.ok) {
        Alert.alert("성공", "일상을 담았어요!");

        try {
          await FileSystem.deleteAsync(processedUri, { idempotent: true });
        } catch (e) {
          Logger.error("캐시 파일 삭제 실패", e);
        }

        onComplete();
      } else {
        Alert.alert("실패", "다이어리에 붙이지 못했어요.");
      }
    } catch (error) {
      Logger.error("업로드 에러:", error);
      Alert.alert("문제 발생", "저장하는 중 문제가 생겼어요.");
    } finally {
      setIsProcessing(false);
    }
  };

  const retake = async () => {
    if (processedUri) {
      try {
        await FileSystem.deleteAsync(processedUri, { idempotent: true });
      } catch (e) {
        Logger.error("캐시 파일 삭제 실패", e);
      }
    }
    setProcessedUri(null);
  };

  if (processedUri) {
    return (
      <View style={styles.container}>
        <Image
          source={{ uri: processedUri }}
          style={styles.preview}
          resizeMode="contain"
        />
        {isProcessing && (
          <ActivityIndicator
            style={styles.loader}
            size="large"
            color={colors.primary}
          />
        )}
        <View style={styles.actionRow}>
          <AnimatedButton
            style={styles.button}
            onPress={retake}
            disabled={isProcessing}
          >
            <Text style={styles.buttonText}>다시 담기</Text>
          </AnimatedButton>
          <AnimatedButton
            style={[styles.button, styles.sendButton]}
            onPress={sendSticker}
            disabled={isProcessing}
          >
            <Text style={styles.sendButtonText}>다이어리에 붙이기</Text>
          </AnimatedButton>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef} facing="back" />
      <View
        style={[
          styles.overlay,
          {
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 10,
          },
        ]}
      >
        {isProcessing ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <AnimatedButton style={styles.captureBtn} onPress={takePicture}>
            <View style={styles.captureInner} />
          </AnimatedButton>
        )}
      </View>
    </View>
  );
};
