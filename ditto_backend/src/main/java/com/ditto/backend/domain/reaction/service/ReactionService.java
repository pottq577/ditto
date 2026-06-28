package com.ditto.backend.domain.reaction.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ditto.backend.domain.reaction.dto.ReactionResponseDto;
import com.ditto.backend.domain.reaction.entity.Reaction;
import com.ditto.backend.domain.reaction.repository.ReactionRepository;
import com.ditto.backend.domain.sticker.entity.Sticker;
import com.ditto.backend.domain.sticker.repository.StickerRepository;
import com.ditto.backend.domain.user.entity.User;
import com.ditto.backend.domain.user.repository.UserRepository;
import com.ditto.backend.global.error.exception.BusinessException;
import com.ditto.backend.global.error.exception.ErrorCode;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReactionService {

    private final ReactionRepository reactionRepository;
    private final StickerRepository stickerRepository;
    private final UserRepository userRepository;

    @Transactional
    public ReactionResponseDto addReaction(Long stickerId, Long userId, String content) {
        Sticker sticker = stickerRepository.findById(stickerId)
                .orElseThrow(() -> new BusinessException(ErrorCode.STICKER_NOT_FOUND));
        
        com.ditto.backend.domain.couple.entity.Couple couple = sticker.getCouple();
        if (!couple.getUser1().getId().equals(userId) && !couple.getUser2().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }

        User user = userRepository.getReferenceById(userId);

        Reaction reaction = Reaction.builder()
                .sticker(sticker)
                .user(user)
                .content(content)
                .build();

        reactionRepository.save(reaction);

        return new ReactionResponseDto(reaction.getId(), sticker.getId(), user.getId(), content);
    }

    @Transactional(readOnly = true)
    public List<ReactionResponseDto> getReactions(Long stickerId) {
        return reactionRepository.findByStickerIdOrderByCreatedAtAsc(stickerId).stream()
                .map(r -> new ReactionResponseDto(r.getId(), r.getSticker().getId(), r.getUser().getId(), r.getContent()))
                .collect(Collectors.toList());
    }
}
