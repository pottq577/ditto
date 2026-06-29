# Ditto 📸✨

> **하루를 투명한 스티커로 기록하고, 연인과 시각적으로 공유하는 커플 다이어리 앱이에요**

## 📖 What is Ditto?

Ditto(디토)는 뻔한 텍스트나 꽉 찬 사진을 넘어, **'오늘 본 것, 기억하고 싶은 것'의 배경을 지우고 스티커로 만들어 공유**하는 완전히 새로운 커플 다이어리 서비스예요.
서로 만든 투명한 스티커가 매일 밤 하나의 화면에 합쳐져요. 텍스트 채팅으로는 다 느낄 수 없는 아날로그 감성을 전해드려요.

## ✨ Key Features

- **Magic Background Removal**: 카메라로 사진을 찍으면 기기 안의 AI가 배경을 지우고 피사체만 깔끔하게 오려내요.
- **Daily Sticker Sync**: 매일 정해진 시간에 각자 모은 스티커가 양쪽 폰 화면에 위아래로 나타나 하나의 뷰를 완성해요.
- **Floating Reactions**: 공유한 스티커 위에 말풍선으로 코멘트와 리액션을 남길 수 있어요.
- **Grace Period Machine**: 오늘 스티커를 보내지 않았다면, 다음 날 오전 6시에 어제의 기록으로 안전하게 보관해요.
- **Private Couple Pairing**: 소셜 로그인과 1:1 초대 코드로 둘만의 안전하고 프라이빗한 소셜 네트워크를 만들어요.

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

디토는 기능 추가와 관리가 쉽도록 엄격한 아키텍처 패턴을 따라요.

- **Frontend (FSD)**: 폴더를 6개 계층(`app`, `pages`, `widgets`, `features`, `entities`, `shared`)으로 나누어, 비즈니스 로직과 UI 화면이 서로 얽히지 않게 했어요.
- **Backend (DDD)**: `user`, `couple`, `sticker`, `reaction` 등 핵심 도메인별로 코드를 나누어 서비스를 쉽게 확장할 수 있어요.

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

- [x] 기기 안에서 누끼 따는 카메라 연동 및 로컬 캐싱 파이프라인 구축
- [ ] 스티커 업로드 및 합쳐진 뷰(Merged View) 렌더링
- [ ] 하루 유예 시간 및 소멸 상태 머신 개발
- [ ] 말풍선 리액션 및 스티커 드래그, 크기 조절 기능
- [ ] 소셜 로그인 및 딥링크로 커플 연결하기
- [ ] 푸시 알림 및 캘린더 기록 기능

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
