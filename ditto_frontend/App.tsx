import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { useState } from "react";
import { CameraPage } from "./src/pages/camera/ui/CameraPage";
import { MergedViewPage } from "./src/pages/merged/ui/MergedViewPage";
import { globalStyles } from "./src/shared/theme/theme";

export default function App() {
  const [currentPage, setCurrentPage] = useState<"camera" | "merged">("camera");

  return (
    <View style={globalStyles.container}>
      {currentPage === "camera" ? (
        <CameraPage onComplete={() => setCurrentPage("merged")} />
      ) : (
        <MergedViewPage onBack={() => setCurrentPage("camera")} />
      )}
      <StatusBar style="auto" />
    </View>
  );
}
