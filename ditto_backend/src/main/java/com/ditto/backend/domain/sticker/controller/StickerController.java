package com.ditto.backend.domain.sticker.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ditto.backend.global.auth.LoginUser;

import com.ditto.backend.domain.sticker.dto.StickerResponseDto;
import com.ditto.backend.domain.sticker.service.StickerService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/stickers")
@RequiredArgsConstructor
public class StickerController {

    private final StickerService stickerService;

    @PostMapping
    public ResponseEntity<StickerResponseDto> uploadSticker(
            @LoginUser Long userId,
            @RequestParam("coupleId") Long coupleId,
            @RequestPart("file") MultipartFile file) {

        StickerResponseDto response = stickerService.uploadSticker(userId, coupleId, file);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/couple/{coupleId}")
    public ResponseEntity<List<StickerResponseDto>> getCoupleStickers(@PathVariable Long coupleId) {
        return ResponseEntity.ok(stickerService.getCoupleStickers(coupleId));
    }
}
