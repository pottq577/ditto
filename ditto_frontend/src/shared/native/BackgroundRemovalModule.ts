import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";

interface BackgroundRemovalModuleType {
  removeBackground(imageUri: string): Promise<string>;
}

export const BackgroundRemoval: BackgroundRemovalModuleType = {
  async removeBackground(imageUri: string): Promise<string> {
    try {
      console.log("[BackgroundRemoval] Sending image to local AI server...");

      const formData = new FormData();
      formData.append("image", {
        uri: imageUri,
        type: "image/jpeg",
        name: "photo.jpg",
      } as any);

      // Using the host IP of the Windows machine from WSL, or localhost if running locally
      const serverUrl = "http://10.0.2.2:5000/remove";

      const response = await fetch(serverUrl, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      // We need to save the binary response to a local file so the app can display it
      const blob = await response.blob();

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async () => {
          const base64data = (reader.result as string).split(",")[1];
          const tempPath =
            FileSystem.cacheDirectory + `nucci_${Date.now()}.png`;
          try {
            await FileSystem.writeAsStringAsync(tempPath, base64data, {
              encoding: FileSystem.EncodingType.Base64,
            });
            console.log(
              "[BackgroundRemoval] Saved removed background to",
              tempPath,
            );
            resolve(tempPath);
          } catch (e) {
            reject(e);
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("[BackgroundRemoval] API fallback failed:", error);
      throw error;
    }
  },
};
