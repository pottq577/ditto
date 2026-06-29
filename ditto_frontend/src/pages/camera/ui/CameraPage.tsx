import React, { useState, useRef } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system/legacy";
import { Logger } from "@/shared/lib/logger";
import { styles } from "./CameraPage.styles";
import { API_BASE_URL } from "@/shared/api/api";
import { useAuth } from "@/shared/lib/AuthContext";
import { BackgroundRemoval } from "@/shared/native/BackgroundRemovalModule";

export const CameraPage = ({ onComplete }: { onComplete: () => void }) => {
  const { userId, coupleId } = useAuth();
  const [permission, requestPermission] = useCameraPermissions();
  /** 누끼 처리된 PNG URI. null이면 촬영 전 or 처리 전. */
  const [processedUri, setProcessedUri] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>카메라 권한이 필요합니다.</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>권한 허용</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (!cameraRef.current) return;
    setIsProcessing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      if (!photo?.uri) return;

      // iOS: 네이티브 모듈로 온디바이스 누끼 처리
      if (Platform.OS === "ios" && BackgroundRemoval) {
        try {
          const nuked = await BackgroundRemoval.removeBackground(photo.uri);
          setProcessedUri(nuked);
        } catch (err: any) {
          Logger.error("누끼 처리 실패:", err);
          const msg =
            err?.code === "NO_SUBJECT"
              ? "피사체를 찾을 수 없습니다. 다시 찍어주세요."
              : "누끼 처리 중 오류가 발생했습니다.";
          Alert.alert("오류", msg);
        } finally {
          // 원본 JPEG 임시 파일 삭제
          try {
            await FileSystem.deleteAsync(photo.uri, { idempotent: true });
          } catch (e) {
            Logger.error("원본 파일 삭제 실패", e);
          }
        }
      } else {
        // 비 iOS 환경 fallback (개발 참고용)
        setProcessedUri(photo.uri);
      }
    } catch (error) {
      Logger.error("카메라 촬영 실패:", error);
      Alert.alert("오류", "사진 촬영에 실패했습니다.");
    } finally {
      setIsProcessing(false);
    }
  };

  const sendSticker = async () => {
    if (!processedUri || isProcessing) return;
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("file", {
        uri: processedUri,
        name: `sticker_${Date.now()}.png`,
        type: "image/png",
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
        Alert.alert("성공", "전송 완료!");

        try {
          await FileSystem.deleteAsync(processedUri, { idempotent: true });
        } catch (e) {
          Logger.error("캐시 파일 삭제 실패", e);
        }

        onComplete();
      } else {
        Alert.alert("실패", "전송에 실패했습니다.");
      }
    } catch (error) {
      Logger.error("업로드 에러:", error);
      Alert.alert("오류", "업로드 중 오류가 발생했습니다.");
    } finally {
      setIsProcessing(false);
    }
  };

  const retake = () => {
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
            color="#ffffff"
          />
        )}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.button}
            onPress={retake}
            disabled={isProcessing}
          >
            <Text style={styles.buttonText}>다시 찍기</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.sendButton]}
            onPress={sendSticker}
            disabled={isProcessing}
          >
            <Text style={styles.buttonText}>전송하기</Text>
          </TouchableOpacity>
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
          <ActivityIndicator size="large" color="#ffffff" />
        ) : (
          <TouchableOpacity style={styles.captureBtn} onPress={takePicture}>
            <View style={styles.captureInner} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
