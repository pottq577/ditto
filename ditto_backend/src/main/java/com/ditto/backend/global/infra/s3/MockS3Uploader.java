package com.ditto.backend.global.infra.s3;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class MockS3Uploader {
    private static final String UPLOAD_DIR = "uploads/";

    public String upload(MultipartFile file) {
        if (file.isEmpty()) return null;
        try {
            File dir = new File(UPLOAD_DIR);
            if (!dir.exists()) {
                dir.mkdirs();
            }
            String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(UPLOAD_DIR, filename);
            Files.write(filePath, file.getBytes());
            // 반환은 로컬 정적 리소스 경로로
            return "http://localhost:8080/uploads/" + filename;
        } catch (IOException e) {
            throw new RuntimeException("Mock S3 upload failed", e);
        }
    }
}
