package com.ditto.backend.domain.sticker.service;

import com.ditto.backend.domain.couple.entity.Couple;
import com.ditto.backend.domain.couple.repository.CoupleRepository;
import com.ditto.backend.domain.sticker.dto.StickerResponseDto;
import com.ditto.backend.domain.sticker.entity.Sticker;
import com.ditto.backend.domain.sticker.repository.StickerRepository;
import com.ditto.backend.domain.user.entity.User;
import com.ditto.backend.domain.user.repository.UserRepository;
import com.ditto.backend.global.infra.s3.MockS3Uploader;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StickerService {

    private final StickerRepository stickerRepository;
    private final UserRepository userRepository;
    private final CoupleRepository coupleRepository;
    private final MockS3Uploader s3Uploader;

    @Transactional
    public StickerResponseDto uploadSticker(Long userId, Long coupleId, MultipartFile file) {
        User user = userRepository.findById(userId).orElseThrow();
        Couple couple = coupleRepository.findById(coupleId).orElseThrow();

        String imageUrl = s3Uploader.upload(file);

        Sticker sticker = Sticker.builder()
                .user(user)
                .couple(couple)
                .imageUrl(imageUrl)
                .build();

        stickerRepository.save(sticker);

        return new StickerResponseDto(sticker.getId(), sticker.getImageUrl(), user.getId());
    }

    @Transactional(readOnly = true)
    public List<StickerResponseDto> getCoupleStickers(Long coupleId) {
        return stickerRepository.findByCoupleId(coupleId).stream()
                .map(s -> new StickerResponseDto(s.getId(), s.getImageUrl(), s.getUser().getId()))
                .collect(Collectors.toList());
    }
}
