package com.ditto.backend.domain.reaction.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ditto.backend.domain.reaction.entity.Reaction;

public interface ReactionRepository extends JpaRepository<Reaction, Long> {
    List<Reaction> findByStickerId(Long stickerId);
}
