package com.ditto.backend.domain.reaction.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ReactionRequestDto {
    private Long stickerId;
    private String content;
}
