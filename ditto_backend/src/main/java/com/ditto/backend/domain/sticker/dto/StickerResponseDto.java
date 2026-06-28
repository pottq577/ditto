package com.ditto.backend.domain.sticker.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class StickerResponseDto {
    private Long id;
    private String imageUrl;
    private Long userId;
}
