package com.ditto.backend.domain.reaction.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ReactionResponseDto {
    private Long id;
    private Long stickerId;
    private Long userId;
    private String content;
}
