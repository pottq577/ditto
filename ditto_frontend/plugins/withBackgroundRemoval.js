// @ts-check
const { withXcodeProject, IOSConfig } = require('@expo/config-plugins');
const path = require('path');
const fs = require('fs');

const MODULE_NAME = 'BackgroundRemovalModule';
const SOURCE_DIR = path.join(__dirname, '../modules/BackgroundRemoval/ios');
const FILES = [`${MODULE_NAME}.swift`, `${MODULE_NAME}.m`];

/**
 * Expo Config Plugin — BackgroundRemoval 네이티브 모듈
 * prebuild 시:
 *  1. modules/BackgroundRemoval/ios/ 파일을 ios/<AppName>/ 로 복사
 *  2. Xcode 프로젝트에 파일 참조 추가
 */
const withBackgroundRemoval = (config) => {
  return withXcodeProject(config, async (mod) => {
    const project = mod.modResults;
    const projectName = mod.modRequest.projectName;
    const platformProjectRoot = mod.modRequest.platformProjectRoot;
    const targetDir = path.join(platformProjectRoot, projectName);

    for (const file of FILES) {
      const src = path.join(SOURCE_DIR, file);
      const dest = path.join(targetDir, file);

      if (!fs.existsSync(src)) {
        throw new Error(`[withBackgroundRemoval] 소스 파일 없음: ${src}`);
      }
      fs.copyFileSync(src, dest);

      // Xcode 프로젝트에 파일 참조 추가 (이미 있으면 스킵)
      const existing = project.pbxFileReferences();
      const alreadyAdded = Object.values(existing).some(
        (ref) => ref && ref.path && ref.path.replace(/^"/, '').replace(/"$/, '') === file
      );

      if (!alreadyAdded) {
        IOSConfig.XcodeUtils.addResourceFileToGroup({
          filepath: path.join(projectName, file),
          groupName: projectName,
          project,
          isBuildFile: true,
          verbose: false,
        });
      }
    }

    return mod;
  });
};

module.exports = withBackgroundRemoval;
