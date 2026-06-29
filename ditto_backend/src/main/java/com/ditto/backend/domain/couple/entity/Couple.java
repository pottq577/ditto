package com.ditto.backend.domain.couple.entity;

import com.ditto.backend.domain.user.entity.User;
import com.ditto.backend.global.error.ErrorCode;
import com.ditto.backend.global.error.exception.BusinessException;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "couples")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Couple {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user1_id", nullable = false)
    private User user1;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user2_id", nullable = false)
    private User user2;

    @Column(name = "connected_at", nullable = false)
    private LocalDateTime connectedAt;

    @Builder
    public Couple(User user1, User user2) {
        if (user1 == null || user2 == null) {
            throw new BusinessException(ErrorCode.INVALID_INPUT_VALUE);
        }
        if (user1 == user2 || (user1.getId() != null && user1.getId().equals(user2.getId()))) {
            throw new BusinessException(ErrorCode.INVALID_INPUT_VALUE);
        }
        this.user1 = user1;
        this.user2 = user2;
        this.connectedAt = LocalDateTime.now();
    }
}
