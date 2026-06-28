package com.ditto.backend.global.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.ditto.backend.domain.couple.entity.Couple;
import com.ditto.backend.domain.couple.repository.CoupleRepository;
import com.ditto.backend.domain.user.entity.User;
import com.ditto.backend.domain.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CoupleRepository coupleRepository;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            User user1 = User.builder().nickname("UserA").providerId("mock_a").build();
            User user2 = User.builder().nickname("UserB").providerId("mock_b").build();

            userRepository.save(user1);
            userRepository.save(user2);

            Couple couple = Couple.builder().user1(user1).user2(user2).build();
            coupleRepository.save(couple);

            System.out.println("Dummy users and couple initialized: Couple ID = " + couple.getId());
        }
    }
}
