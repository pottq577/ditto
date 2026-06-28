package com.ditto.backend.domain.reaction.repository;

import com.ditto.backend.domain.reaction.entity.Reaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReactionRepository extends JpaRepository<Reaction, Long> {
    List<Reaction> findByStickerId(Long stickerId);
}
