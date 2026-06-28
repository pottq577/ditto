import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import imglyRemoveBackground, { Config } from '@imgly/background-removal';

export const CameraPage = () => {
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
        console.error('카메라 촬영 실패:', error);
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
        publicPath: 'https://static.imgly.com/@imgly/background-removal-data/1.4.3/dist/',
        progress: (key, current, total) => {
          console.log(`Downloading ${key}: ${current}/${total}`);
        }
      };

      const resultBlob = await imglyRemoveBackground(blob, config);
      
      // 3. Convert result blob to base64 or save it
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64data = reader.result as string;
        
        // Save to FileSystem
        const filename = `nucci_${Date.now()}.png`;
        const destPath = `${FileSystem.documentDirectory}${filename}`;
        
        // Save base64 string (strip the data prefix)
        const base64Code = base64data.split(',')[1];
        await FileSystem.writeAsStringAsync(destPath, base64Code, {
          encoding: FileSystem.EncodingType.Base64,
        });

        setPhotoUri(destPath);
        setIsProcessing(false);
      };
      reader.readAsDataURL(resultBlob);

    } catch (error) {
      console.error('누끼 처리 실패:', error);
      setIsProcessing(false);
    }
  };

  const retake = () => {
    setPhotoUri(null);
  };

  if (photoUri) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: photoUri }} style={styles.preview} resizeMode="contain" />
        <TouchableOpacity style={styles.button} onPress={retake}>
          <Text style={styles.buttonText}>다시 찍기</Text>
        </TouchableOpacity>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    marginBottom: 20,
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 40,
  },
  captureBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  preview: {
    flex: 1,
    width: '100%',
  },
  button: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    position: 'absolute',
    bottom: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
