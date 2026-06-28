package com.ditto.backend.domain.sticker.repository;

import com.ditto.backend.domain.sticker.entity.Sticker;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StickerRepository extends JpaRepository<Sticker, Long> {
    List<Sticker> findByCoupleId(Long coupleId);
}
