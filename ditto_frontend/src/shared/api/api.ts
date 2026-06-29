import { Platform } from 'react-native';
import Constants from 'expo-constants';

const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const localhost = hostUri.split(':')[0];
    return `http://${localhost}:8080`;
  }

  if (__DEV__) {
    return Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080';
  }

  throw new Error("EXPO_PUBLIC_API_URL is not defined");
};

export const API_BASE_URL = getBaseUrl();
