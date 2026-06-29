// @ts-check
const { withAppBuildGradle, withMainApplication } = require('@expo/config-plugins');
const path = require('path');
const fs = require('fs');

const MODULE_DIR = path.join(__dirname, '../modules/BackgroundRemoval/android');
const TARGET_DIR_SUFFIX = 'com/ditto/frontend/backgroundremoval';

/**
 * Expo Config Plugin — BackgroundRemoval 네이티브 모듈 (안드로이드)
 */
const withBackgroundRemovalAndroid = (config) => {
  // 1. build.gradle 의존성 추가
  config = withAppBuildGradle(config, (config) => {
    if (!config.modResults.contents.includes('play-services-mlkit-subject-segmentation')) {
      config.modResults.contents = config.modResults.contents.replace(
        /dependencies\s*\{/,
        `dependencies {\n    implementation 'com.google.android.gms:play-services-mlkit-subject-segmentation:16.0.0-beta1'`
      );
    }
    return config;
  });

  // 2. MainApplication.kt 수정 및 파일 복사
  config = withMainApplication(config, (config) => {
    let contents = config.modResults.contents;
    
    // 패키지 import 추가
    if (!contents.includes('import com.ditto.frontend.backgroundremoval.BackgroundRemovalPackage')) {
      contents = contents.replace(
        /package [^\n]+/,
        `$& \nimport com.ditto.frontend.backgroundremoval.BackgroundRemovalPackage`
      );
    }

    // 패키지 리스트에 등록
    if (!contents.includes('BackgroundRemovalPackage()')) {
      contents = contents.replace(
        /PackageList\(this\)\.packages/,
        `PackageList(this).packages.apply {\n          add(BackgroundRemovalPackage())\n        }`
      );
    }
    config.modResults.contents = contents;

    // 파일 복사
    const targetDir = path.join(config.modRequest.platformProjectRoot, 'app/src/main/java', TARGET_DIR_SUFFIX);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const files = ['BackgroundRemovalModule.kt', 'BackgroundRemovalPackage.kt'];
    for (const file of files) {
      fs.copyFileSync(path.join(MODULE_DIR, file), path.join(targetDir, file));
    }

    return config;
  });

  return config;
};

module.exports = withBackgroundRemovalAndroid;
