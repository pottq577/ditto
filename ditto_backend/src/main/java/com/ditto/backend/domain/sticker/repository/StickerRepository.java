package com.ditto.backend.domain.sticker.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ditto.backend.domain.sticker.entity.Sticker;

public interface StickerRepository extends JpaRepository<Sticker, Long> {
    List<Sticker> findByCoupleId(Long coupleId);

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = { "user" })
    List<Sticker> findByCoupleIdAndCreatedAtGreaterThanEqualAndCreatedAtLessThan(Long coupleId, LocalDateTime start,
            LocalDateTime end);
}
