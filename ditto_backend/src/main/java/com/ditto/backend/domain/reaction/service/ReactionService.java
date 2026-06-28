package com.ditto.backend.domain.reaction.service;

import com.ditto.backend.domain.reaction.dto.ReactionResponseDto;
import com.ditto.backend.domain.reaction.entity.Reaction;
import com.ditto.backend.domain.reaction.repository.ReactionRepository;
import com.ditto.backend.domain.sticker.entity.Sticker;
import com.ditto.backend.domain.sticker.repository.StickerRepository;
import com.ditto.backend.domain.user.entity.User;
import com.ditto.backend.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReactionService {

    private final ReactionRepository reactionRepository;
    private final StickerRepository stickerRepository;
    private final UserRepository userRepository;

    @Transactional
    public ReactionResponseDto addReaction(Long stickerId, Long userId, String content) {
        Sticker sticker = stickerRepository.findById(stickerId).orElseThrow();
        User user = userRepository.findById(userId).orElseThrow();

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
        return reactionRepository.findByStickerId(stickerId).stream()
                .map(r -> new ReactionResponseDto(r.getId(), r.getSticker().getId(), r.getUser().getId(), r.getContent()))
                .collect(Collectors.toList());
    }
}
