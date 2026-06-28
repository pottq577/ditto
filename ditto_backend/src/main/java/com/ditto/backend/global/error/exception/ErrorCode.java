package com.ditto.backend.global.error.exception;

import org.springframework.http.HttpStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    // 공통
    INVALID_INPUT_VALUE(HttpStatus.BAD_REQUEST, "C001", "Invalid Input Value"),
    METHOD_NOT_ALLOWED(HttpStatus.METHOD_NOT_ALLOWED, "C002", "Invalid HTTP Method"),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "C003", "Server Error"),

    // 엔티티 관련
    FORBIDDEN(HttpStatus.FORBIDDEN, "C005", "Access is denied"),
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "U001", "User is not found"),
    COUPLE_NOT_FOUND(HttpStatus.NOT_FOUND, "C004", "Couple is not found"),
    STICKER_NOT_FOUND(HttpStatus.NOT_FOUND, "S001", "Sticker is not found"),

    // 파일 및 외부 연동
    FILE_UPLOAD_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "F001", "File upload failed");

    private final HttpStatus status;
    private final String code;
    private final String message;
}
