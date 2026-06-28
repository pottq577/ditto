package com.ditto.backend.global.infra.s3;

import java.util.UUID;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class MockS3Uploader {

    // MVP 용 가짜 S3 업로더: S3 URL 형식의 더미 문자열 반환
    public String upload(MultipartFile file) {
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        return "https://mock-s3-bucket.s3.ap-northeast-2.amazonaws.com/" + fileName;
    }
}
