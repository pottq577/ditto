import { NativeModules } from "react-native";

interface BackgroundRemovalModuleType {
  /**
   * 입력 이미지에서 배경을 제거해 투명 PNG URI를 반환한다.
   * iOS 전용 (Vision VNGenerateForegroundInstanceMaskRequest, iOS 17+).
   *
   * @param imageUri - 로컬 파일 URI (file:// 또는 절대경로)
   * @returns 처리된 PNG의 file:// URI
   * @throws { code: "NO_SUBJECT" } 피사체를 찾을 수 없을 때
   * @throws { code: "PROCESSING_FAILED" } 내부 처리 실패
   */
  removeBackground(imageUri: string): Promise<string>;
}

const { BackgroundRemovalModule } = NativeModules;

if (!BackgroundRemovalModule) {
  console.warn(
    "[BackgroundRemoval] 네이티브 모듈 없음. expo prebuild 후 네이티브 빌드(Xcode/Android Studio) 필요.",
  );
}

export const BackgroundRemoval =
  BackgroundRemovalModule as BackgroundRemovalModuleType;
