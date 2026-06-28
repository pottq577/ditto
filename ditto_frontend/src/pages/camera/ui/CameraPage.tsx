import React, { useState, useRef } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system";
import imglyRemoveBackground, { Config } from "@imgly/background-removal";
import { Logger } from "../../../shared/lib/logger";
import { styles } from './CameraPage.styles';
import { API_BASE_URL } from "../../../shared/api/api";

export const CameraPage = ({ onComplete }: { onComplete: () => void }) => {
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
      }
    }
  };

  const processImage = async (uri: string) => {
    setIsProcessing(true);
    try {
      // 1. Fetch file as blob
      const response = await fetch(uri);
      const blob = await response.blob();

      // 2. Process with imgly
      const config: Config = {
        publicPath:
          "https://static.imgly.com/@imgly/background-removal-data/1.4.3/dist/",
        progress: (key, current, total) => {
          Logger.info(`Downloading ${key}: ${current}/${total}`);
        },
      };

      const resultBlob = await imglyRemoveBackground(blob, config);

      // 3. Convert result blob to base64 or save it
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          if (typeof reader.result !== "string") {
            throw new Error("Failed to read processed image");
          }

          const filename = `nucci_${Date.now()}.png`;
          const destPath = `${FileSystem.documentDirectory}${filename}`;
          const base64Code = reader.result.split(",")[1];

          if (!base64Code) {
            throw new Error("Failed to extract image payload");
          }

          await FileSystem.writeAsStringAsync(destPath, base64Code, {
            encoding: FileSystem.EncodingType.Base64,
          });

          setPhotoUri(destPath);
        } catch (error) {
          Logger.error("누끼 저장 실패:", error);
        } finally {
          setIsProcessing(false);
        }
      };
      reader.onerror = () => {
        Logger.error("누끼 읽기 실패");
        setIsProcessing(false);
      };
      reader.readAsDataURL(resultBlob);
    } catch (error) {
      Logger.error("누끼 처리 실패:", error);
      setIsProcessing(false);
    }
  };

  const sendSticker = async () => {
    if (!photoUri) return;
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("file", {
        uri: photoUri,
        name: `sticker_${Date.now()}.png`,
        type: "image/png",
      } as any);

      // 더미 데이터: userId=1, coupleId=1
      const response = await fetch(`${API_BASE_URL}/api/v1/stickers?coupleId=1`, {
        method: "POST",
        headers: {
          "X-User-Id": "1",
        },
        body: formData,
      });

      if (response.ok) {
        alert("전송 완료!");
        onComplete();
      } else {
        alert("전송 실패");
      }
    } catch (error) {
      Logger.error("업로드 에러:", error);
      alert("업로드 중 오류 발생");
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
      <CameraView style={styles.camera} ref={cameraRef} facing="back">
        <View style={styles.overlay}>
          {isProcessing ? (
            <ActivityIndicator size="large" color="#ffffff" />
          ) : (
            <TouchableOpacity style={styles.captureBtn} onPress={takePicture}>
              <View style={styles.captureInner} />
            </TouchableOpacity>
          )}
        </View>
      </CameraView>
    </View>
  );
};
