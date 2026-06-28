package com.ditto.backend.domain.sticker.controller;

import com.ditto.backend.domain.sticker.dto.StickerResponseDto;
import com.ditto.backend.domain.sticker.service.StickerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api/v1/stickers")
@RequiredArgsConstructor
public class StickerController {

    private final StickerService stickerService;

    @PostMapping
    public ResponseEntity<StickerResponseDto> uploadSticker(
            @RequestParam("userId") Long userId,
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
