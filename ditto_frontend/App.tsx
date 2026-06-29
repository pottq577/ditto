import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useFonts } from "expo-font";
import { GowunBatang_400Regular } from "@expo-google-fonts/gowun-batang";
import { GowunDodum_400Regular } from "@expo-google-fonts/gowun-dodum";

import { CameraPage } from "@/pages/camera/ui/CameraPage";
import { MergedViewPage } from "@/pages/merged/ui/MergedViewPage";
import { ThemeProvider, useTheme } from "@/shared/theme/theme";
import { AuthProvider } from "@/shared/lib/AuthContext";

const MainApp = () => {
  const [currentPage, setCurrentPage] = useState<"camera" | "merged">("camera");
  const { colors, isDark } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {currentPage === "camera" ? (
        <CameraPage onComplete={() => setCurrentPage("merged")} />
      ) : (
        <MergedViewPage onBack={() => setCurrentPage("camera")} />
      )}
      <StatusBar style={isDark ? "light" : "dark"} />
    </View>
  );
};

export default function App() {
  const [fontsLoaded] = useFonts({
    GowunBatang_400Regular,
    GowunDodum_400Regular,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F9F8F6" }}>
        <ActivityIndicator size="large" color="#E85D4E" />
      </View>
    );
  }

  return (
    <AuthProvider>
      <ThemeProvider>
        <MainApp />
      </ThemeProvider>
    </AuthProvider>
  );
}
