package com.ditto.backend.domain.reaction.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ReactionRequestDto {
    @NotNull(message = "Sticker ID cannot be null")
    private Long stickerId;

    @NotBlank(message = "Content cannot be blank")
    @Size(max = 255, message = "Content must be less than 255 characters")
    private String content;
}
