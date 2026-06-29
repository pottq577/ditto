package com.ditto.backend.global.infra.s3;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ditto.backend.global.error.exception.BusinessException;
import com.ditto.backend.global.error.exception.ErrorCode;

@Service
public class MockS3Uploader {
    private static final String UPLOAD_DIR = "uploads/";
    private static final List<String> ALLOWED_CONTENT_TYPES = List.of("image/jpeg", "image/png", "image/webp",
            "image/gif");

    public String upload(MultipartFile file) {
        if (file.isEmpty()) {
            throw new BusinessException(ErrorCode.INVALID_INPUT_VALUE);
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT_VALUE);
        }

        try {
            File dir = new File(UPLOAD_DIR);
            if (!dir.exists()) {
                dir.mkdirs();
            }
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null) {
                originalFilename = "unknown";
            }
            String cleanFilename = Paths.get(originalFilename).getFileName().toString();
            String filename = System.currentTimeMillis() + "_" + cleanFilename;
            Path filePath = Paths.get(UPLOAD_DIR, filename);

            Path uploadDirPath = Paths.get(UPLOAD_DIR).toAbsolutePath().normalize();
            Path targetPath = filePath.toAbsolutePath().normalize();

            if (!targetPath.startsWith(uploadDirPath)) {
                throw new BusinessException(ErrorCode.FILE_UPLOAD_ERROR);
            }

            Files.write(targetPath, file.getBytes());
            // 반환은 로컬 정적 리소스 경로로 상대경로만 저장
            return "/uploads/" + filename;
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.FILE_UPLOAD_ERROR);
        }
    }
}
