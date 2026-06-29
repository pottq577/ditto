package com.ditto.backend.global.infra.rapidapi;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.ditto.backend.global.error.exception.BusinessException;
import com.ditto.backend.global.error.exception.ErrorCode;

@Component
public class BackgroundRemovalClient {

    @Value("${rapidapi.background-removal.key}")
    private String apiKey;

    @Value("${rapidapi.background-removal.host:background-removal-ai.p.rapidapi.com}")
    private String apiHost;

    private final RestTemplate restTemplate;

    public BackgroundRemovalClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public byte[] removeBackground(MultipartFile file) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            headers.set("X-RapidAPI-Key", apiKey);
            headers.set("X-RapidAPI-Host", apiHost);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("image", new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename() != null ? file.getOriginalFilename() : "image.jpg";
                }
            });

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(
                    "https://" + apiHost + "/remove-background",
                    requestEntity,
                    Map.class
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                String imageUrl = (String) response.getBody().get("image_url");
                if (imageUrl != null) {
                    byte[] imageBytes = restTemplate.getForObject(imageUrl, byte[].class);
                    if (imageBytes != null) {
                        return imageBytes;
                    }
                }
            }
            throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            throw new BusinessException(ErrorCode.INTERNAL_SERVER_ERROR);
        }
    }
}
