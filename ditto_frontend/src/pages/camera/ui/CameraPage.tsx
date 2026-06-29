import React, { useState, useRef } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system/legacy";
import { removeBackground, Config } from "@imgly/background-removal";
import { Logger } from "@/shared/lib/logger";
import { styles } from "./CameraPage.styles";
import { API_BASE_URL } from "@/shared/api/api";
import { useAuth } from "@/shared/lib/AuthContext";

import { NucciWebView } from "@/shared/ui/NucciWebView";

export const CameraPage = ({ onComplete }: { onComplete: () => void }) => {
  const { userId, coupleId } = useAuth();
  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [rawBase64, setRawBase64] = useState<string | null>(null);
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
    if (cameraRef.current) {
      try {
        setIsProcessing(true);
        const photo = await cameraRef.current.takePictureAsync({
          base64: true,
          quality: 0.8,
        });

        if (photo?.uri && photo?.base64) {
          setPhotoUri(photo.uri); // 원본 이미지를 프리뷰로 먼저 표시 (로딩 중)
          setRawBase64(photo.base64); // WebView로 전송하여 누끼 따기 시작
        } else {
          setIsProcessing(false);
        }
      } catch (error) {
        Logger.error("카메라 촬영 실패:", error);
        Alert.alert("오류", "사진 촬영에 실패했습니다.");
        setIsProcessing(false);
      }
    }
  };

  const handleNucciSuccess = async (resultBase64: string) => {
    try {
      const filename = `nucci_${Date.now()}.png`;
      const destPath = `${FileSystem.cacheDirectory}${filename}`;
      await FileSystem.writeAsStringAsync(destPath, resultBase64, {
        encoding: FileSystem.EncodingType.Base64,
      });
      setPhotoUri(destPath); // 누끼 처리된 이미지로 교체
    } catch (e) {
      Logger.error("누끼 로컬 저장 실패, 원본 유지", e);
    } finally {
      setIsProcessing(false);
      setRawBase64(null);
    }
  };

  const handleNucciError = (error: string) => {
    Logger.error("WebView 누끼 에러, 원본 유지:", error);
    setIsProcessing(false);
    setRawBase64(null);
  };

  const sendSticker = async () => {
    if (!photoUri || isProcessing) return;
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("file", {
        uri: photoUri,
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

        // 업로드 성공 후 캐시 파일 삭제 (선택적)
        try {
          await FileSystem.deleteAsync(photoUri, { idempotent: true });
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
    setPhotoUri(null);
  };

  if (photoUri) {
    return (
      <View style={styles.container}>
        <Image
          source={{ uri: photoUri }}
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
        <NucciWebView
          base64Image={rawBase64}
          onSuccess={handleNucciSuccess}
          onError={handleNucciError}
        />
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
      <NucciWebView
        base64Image={rawBase64}
        onSuccess={handleNucciSuccess}
        onError={handleNucciError}
      />
    </View>
  );
};
