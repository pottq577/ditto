package com.ditto.backend.domain.couple.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ditto.backend.domain.couple.entity.Couple;

public interface CoupleRepository extends JpaRepository<Couple, Long> {
}
