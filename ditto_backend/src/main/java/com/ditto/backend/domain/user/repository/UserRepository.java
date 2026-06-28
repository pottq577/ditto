package com.ditto.backend.domain.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ditto.backend.domain.user.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
}
