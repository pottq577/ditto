# Ditto (스티커 다이어리 앱)

> **상태: 일시 중단 (Paused)** - 네이티브 개발 환경의 높은 난이도 및 유지보수 비용 이슈로 인한 프로젝트 잠정 중단.

## 프로젝트 개요
커플이 오늘 하루 본 것, 기억하고 싶은 것을 사진으로 찍어 누끼 스티커로 만들고, 하루 한 번 상대방에게 전송하여 각자의 하루를 시각적으로 공유하는 커플 다이어리 앱.

## 기술 스택
- **Frontend**: React Native + Expo (SDK 54)
- **Backend**: Java (Spring Boot) + PostgreSQL + AWS S3
- **AI Background Removal**: Google ML Kit (Native) / `rembg` (Python fallback for emulator)

## 디렉토리 구조
- `ditto_frontend/`: 프론트엔드 코드 (Feature-Sliced Design 아키텍처 적용)
- `ditto_backend/`: 백엔드 코드 (Domain-Driven Design 아키텍처 적용)
- `docs/`: 기획, 아키텍처 설계 및 작업 리뷰 문서 모음
- `rembg_server.py`: 에뮬레이터 테스트용 로컬 AI 누끼 서버

## 참고 문서
자세한 개발 기획 및 프로젝트 멈춤 시점의 작업 현황은 `docs/review/` 디렉토리를 참고하세요.
