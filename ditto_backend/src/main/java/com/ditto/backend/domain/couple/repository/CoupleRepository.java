package com.ditto.backend.domain.couple.repository;

import com.ditto.backend.domain.couple.entity.Couple;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CoupleRepository extends JpaRepository<Couple, Long> {
}
