package com.ditto.backend.domain.reaction.controller;

import com.ditto.backend.domain.reaction.dto.ReactionResponseDto;
import com.ditto.backend.domain.reaction.service.ReactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/reactions")
@RequiredArgsConstructor
public class ReactionController {

    private final ReactionService reactionService;

    @PostMapping
    public ResponseEntity<ReactionResponseDto> addReaction(
            @RequestParam("stickerId") Long stickerId,
            @RequestParam("userId") Long userId,
            @RequestParam("content") String content) {
        return ResponseEntity.ok(reactionService.addReaction(stickerId, userId, content));
    }

    @GetMapping("/sticker/{stickerId}")
    public ResponseEntity<List<ReactionResponseDto>> getReactions(@PathVariable Long stickerId) {
        return ResponseEntity.ok(reactionService.getReactions(stickerId));
    }
}
