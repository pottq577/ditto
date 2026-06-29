# Ditto 📸✨

> **당신의 하루를 투명한 스티커로 기록하고, 연인과 시각적으로 공유하는 커플 다이어리 앱**

## 📖 What is Ditto?

Ditto(디토)는 단순한 텍스트나 정형화된 사진을 넘어, **'오늘 본 것, 기억하고 싶은 것'을 피사체 누끼(배경 제거) 스티커로 만들어 공유**하는 완전히 새로운 형태의 커플 다이어리 서비스입니다.
서로가 만든 투명한 스티커들이 매일 밤 하나의 화면에 합쳐지며, 텍스트 채팅으로는 담을 수 없는 시각적이고 아날로그적인 감성을 제공합니다.

## ✨ Key Features

- **Magic Background Removal**: 카메라 촬영 즉시 온디바이스(On-Device) AI가 배경을 날리고 피사체만 깔끔하게 오려냅니다.
- **Daily Sticker Sync**: 매일 정해진 시간, 각자가 채집한 스티커들이 양쪽 폰 화면 위아래로 동기화되어 하나의 뷰를 완성합니다.
- **Floating Reactions**: 공유된 스티커 위에 말풍선 형태의 코멘트와 리액션을 남길 수 있습니다.
- **Grace Period Machine**: 당일 미전송 시, 익일 오전 6시를 기점으로 상태 머신이 동작하여 어제의 기록을 영구히 아카이빙합니다.
- **Private Couple Pairing**: 안전한 소셜 로그인과 1:1 초대 코드를 통한 폐쇄형 프라이빗 소셜 네트워크를 제공합니다.

## 🛠 Tech Stack

### Frontend

- **Framework**: React Native, Expo (SDK 54)
- **Language**: TypeScript
- **Architecture**: Feature-Sliced Design (FSD)
- **AI / Native Core**: Google ML Kit (Subject Segmentation) / Expo Modules API

### Backend

- **Framework**: Java 17, Spring Boot
- **Architecture**: Domain-Driven Design (DDD) Layered Architecture
- **Database**: PostgreSQL
- **Storage**: AWS S3

## 🏗 Architecture Overview

디토는 높은 확장성과 유지보수성을 위해 엄격한 아키텍처 패턴을 따릅니다.

- **Frontend (FSD)**: `app`, `pages`, `widgets`, `features`, `entities`, `shared` 계층으로 분리하여 비즈니스 로직과 UI 컴포넌트의 결합도를 낮췄습니다.
- **Backend (DDD)**: `user`, `couple`, `sticker`, `reaction` 등 핵심 도메인 단위로 패키지를 분리하여 독립적인 서비스 확장이 가능합니다.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- Java 17+ & Gradle
- Android Studio / Xcode

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/ditto.git

# 2. Frontend Setup
cd ditto_frontend
npm install
npx expo start --dev-client

# 3. Backend Setup
cd ditto_backend
./gradlew bootRun
```

## 🗺 Roadmap

- [x] 온디바이스 누끼 카메라 연동 및 로컬 캐싱 파이프라인 구축
- [ ] 스티커 업로드 및 합쳐진 뷰(Merged View) 렌더링 도입
- [ ] 일일 유예(Grace Period) 및 소멸 상태 머신 개발
- [ ] 말풍선 리액션 및 스티커 드래그/리사이징 구현
- [ ] 소셜 로그인 및 딥링크 기반 커플 매칭 기능
- [ ] Push 알림 시스템 및 캘린더 히스토리 구축

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
