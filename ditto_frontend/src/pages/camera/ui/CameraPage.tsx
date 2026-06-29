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

export const CameraPage = ({ onComplete }: { onComplete: () => void }) => {
  const { userId, coupleId } = useAuth();
  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
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
        const photo = await cameraRef.current.takePictureAsync({
          base64: false,
          quality: 0.8,
        });

        if (photo?.uri) {
          processImage(photo.uri);
        }
      } catch (error) {
        Logger.error("카메라 촬영 실패:", error);
        Alert.alert("오류", "사진 촬영에 실패했습니다.");
      }
    }
  };

  const processImage = async (uri: string) => {
    setIsProcessing(true);
    try {
      // 1. Fetch file as blob (RN에서 file:// fetch가 종종 실패하므로 대비)
      let blob;
      try {
        const response = await fetch(uri);
        blob = await response.blob();
      } catch (e) {
        Logger.error("로컬 파일 fetch 실패, 원본 이미지 사용:", e);
        setPhotoUri(uri);
        setIsProcessing(false);
        return;
      }

      // 2. Process with imgly (RN 환경에서는 WASM/WebWorker 지원 한계로 실패할 확률 높음)
      const config: Config = {
        publicPath:
          "https://static.imgly.com/@imgly/background-removal-data/1.4.3/dist/",
      };

      const resultBlob = await removeBackground(blob, config);

      // 3. Convert result blob to base64 or save it
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          if (typeof reader.result !== "string") {
            throw new Error("Failed to read processed image");
          }

          const filename = `nucci_${Date.now()}.png`;
          const destPath = `${FileSystem.cacheDirectory}${filename}`;
          const base64Code = reader.result.split(",")[1];

          if (!base64Code) {
            throw new Error("Failed to extract image payload");
          }

          await FileSystem.writeAsStringAsync(destPath, base64Code, {
            encoding: FileSystem.EncodingType.Base64,
          });

          setPhotoUri(destPath);
        } catch (error) {
          Logger.error("누끼 저장 실패, 원본 이미지 사용:", error);
          setPhotoUri(uri);
        } finally {
          setIsProcessing(false);
        }
      };
      reader.onerror = () => {
        Logger.error("누끼 읽기 실패, 원본 이미지 사용");
        setPhotoUri(uri);
        setIsProcessing(false);
      };
      reader.readAsDataURL(resultBlob);
    } catch (error) {
      Logger.error(
        "누끼 처리 실패(Web 전용 라이브러리 제약), 원본 이미지 사용:",
        error,
      );
      setPhotoUri(uri); // 오류 시 원본 이미지라도 사용할 수 있게 Fallback
      setIsProcessing(false);
    }
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
