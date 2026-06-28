import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { CameraPage } from './src/pages/camera/ui/CameraPage';

export default function App() {
  return (
    <View style={styles.container}>
      <CameraPage />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
