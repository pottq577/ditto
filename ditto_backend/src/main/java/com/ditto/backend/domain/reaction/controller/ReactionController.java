package com.ditto.backend.domain.reaction.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;

import com.ditto.backend.global.auth.LoginUser;
import jakarta.validation.Valid;

import com.ditto.backend.domain.reaction.dto.ReactionRequestDto;
import com.ditto.backend.domain.reaction.dto.ReactionResponseDto;
import com.ditto.backend.domain.reaction.service.ReactionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/reactions")
@RequiredArgsConstructor
public class ReactionController {

    private final ReactionService reactionService;

    @PostMapping
    public ResponseEntity<ReactionResponseDto> addReaction(
            @LoginUser Long userId,
            @Valid @RequestBody ReactionRequestDto request) {
        return ResponseEntity.ok(reactionService.addReaction(request.getStickerId(), userId, request.getContent()));
    }

    @GetMapping("/sticker/{stickerId}")
    public ResponseEntity<List<ReactionResponseDto>> getReactions(@PathVariable Long stickerId,
            @LoginUser Long userId) {
        return ResponseEntity.ok(reactionService.getReactions(stickerId, userId));
    }
}
