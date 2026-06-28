package com.ditto.backend.domain.reaction.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ditto.backend.domain.reaction.entity.Reaction;

public interface ReactionRepository extends JpaRepository<Reaction, Long> {
    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"user", "sticker"})
    List<Reaction> findByStickerIdOrderByCreatedAtAsc(Long stickerId);
}
