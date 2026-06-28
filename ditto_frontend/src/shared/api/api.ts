// React Native (Expo) 안드로이드 에뮬레이터에서 로컬호스트를 가리키려면 10.0.2.2를 사용합니다.
// iOS 시뮬레이터나 웹 환경에서는 localhost가 작동합니다.
import { Platform } from 'react-native';

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 
  (Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080');
