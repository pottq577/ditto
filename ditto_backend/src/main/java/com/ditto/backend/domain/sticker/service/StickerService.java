package com.ditto.backend.domain.sticker.service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.ditto.backend.domain.couple.entity.Couple;
import com.ditto.backend.domain.couple.repository.CoupleRepository;
import com.ditto.backend.domain.sticker.dto.StickerResponseDto;
import com.ditto.backend.domain.sticker.entity.Sticker;
import com.ditto.backend.domain.sticker.repository.StickerRepository;
import com.ditto.backend.domain.user.entity.User;
import com.ditto.backend.domain.user.repository.UserRepository;
import com.ditto.backend.global.error.exception.BusinessException;
import com.ditto.backend.global.error.exception.ErrorCode;
import com.ditto.backend.global.infra.s3.MockS3Uploader;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StickerService {

    private final StickerRepository stickerRepository;
    private final UserRepository userRepository;
    private final CoupleRepository coupleRepository;
    private final MockS3Uploader s3Uploader;

    @Transactional
    public StickerResponseDto uploadSticker(Long userId, Long coupleId, MultipartFile file) {
        Couple couple = coupleRepository.findById(coupleId)
                .orElseThrow(() -> new BusinessException(ErrorCode.COUPLE_NOT_FOUND));

        if (!couple.getUser1().getId().equals(userId) && !couple.getUser2().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }

        User user = userRepository.getReferenceById(userId);

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
    public List<StickerResponseDto> getCoupleStickers(Long coupleId, Long userId) {
        Couple couple = coupleRepository.findById(coupleId)
                .orElseThrow(() -> new BusinessException(ErrorCode.COUPLE_NOT_FOUND));

        if (!couple.getUser1().getId().equals(userId) && !couple.getUser2().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }

        ZoneId zoneId = ZoneId.of("Asia/Seoul");
        LocalDateTime now = LocalDateTime.now(zoneId);
        LocalDateTime start;
        LocalDateTime end;

        if (now.getHour() < 6) {
            // 오전 6시 이전이면 어제 오전 6시부터 오늘 오전 6시 미만
            start = now.minusDays(1).withHour(6).withMinute(0).withSecond(0).withNano(0);
            end = now.withHour(6).withMinute(0).withSecond(0).withNano(0);
        } else {
            // 오전 6시 이후면 오늘 오전 6시부터 내일 오전 6시 미만
            start = now.withHour(6).withMinute(0).withSecond(0).withNano(0);
            end = now.plusDays(1).withHour(6).withMinute(0).withSecond(0).withNano(0);
        }

        return stickerRepository.findByCoupleIdAndCreatedAtGreaterThanEqualAndCreatedAtLessThan(coupleId, start, end).stream()
                .map(s -> new StickerResponseDto(s.getId(), s.getImageUrl(), s.getUser().getId()))
                .collect(Collectors.toList());
    }
}
