import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { useState } from "react";
import { CameraPage } from "@/pages/camera/ui/CameraPage";
import { MergedViewPage } from "@/pages/merged/ui/MergedViewPage";
import { globalStyles } from "@/shared/theme/theme";

import { AuthProvider } from "@/shared/lib/AuthContext";

export default function App() {
  const [currentPage, setCurrentPage] = useState<"camera" | "merged">("camera");

  return (
    <AuthProvider>
      <View style={globalStyles.container}>
        {currentPage === "camera" ? (
          <CameraPage onComplete={() => setCurrentPage("merged")} />
        ) : (
          <MergedViewPage onBack={() => setCurrentPage("camera")} />
        )}
        <StatusBar style="auto" />
      </View>
    </AuthProvider>
  );
}
