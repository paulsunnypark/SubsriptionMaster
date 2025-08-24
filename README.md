# SubscriptionMaster

구독 관리 및 비용 절감을 위한 통합 플랫폼

## 🎯 프로젝트 개요

SubscriptionMaster는 사용자의 구독 서비스를 자동으로 수집하고, 중복/유령 구독을 탐지하며, 비용 절감 기회를 제안하는 웹 기반 서비스입니다.

### 주요 기능
- **자동 데이터 수집**: CSV, 이메일, 수동 입력을 통한 구독 정보 수집
- **스마트 정규화**: 머천트명 정규화 및 중복 구독 탐지
- **비용 가시화**: 캘린더, 예측, 현금흐름 분석
- **알림 시스템**: 트라이얼 종료, 가격 인상, 중복 구독 경고
- **액션 가이드**: 해지/전환 절차 및 스크립트 제공

## 🏗️ 기술 스택

- **Frontend**: Next.js (PWA) + Tailwind CSS
- **Backend**: NestJS (REST API)
- **Database**: PostgreSQL
- **Cache/Queue**: Redis
- **Storage**: AWS S3
- **Authentication**: OAuth2/OIDC

## 🚀 빠른 시작

### 1. 환경 설정
```bash
# 의존성 설치
npm run setup

# 개발 환경 실행 (PostgreSQL + Redis)
npm run docker:dev

# 데이터베이스 마이그레이션
npm run db:migrate
```

### 2. 개발 서버 실행
```bash
# 백엔드 + 프론트엔드 동시 실행
npm run dev

# 또는 개별 실행
npm run dev:backend    # 백엔드만 (포트: 3001)
npm run dev:frontend   # 프론트엔드만 (포트: 3000)
```

### 3. 프로덕션 빌드
```bash
# 전체 빌드
npm run build

# 프로덕션 환경 실행
npm run docker:prod
```

## 📁 프로젝트 구조

```
subscriptionmaster/
├── backend/           # NestJS 백엔드
├── frontend/          # Next.js 프론트엔드
├── db/               # 데이터베이스 스키마
├── config/           # 설정 파일들
├── docs/             # 프로젝트 문서
├── scripts/          # 개발/배포 스크립트
└── docker-compose.*.yml
```

## 🧪 테스트

```bash
# 전체 테스트 실행
npm test

# 백엔드 테스트만
npm run test:backend

# 프론트엔드 테스트만
npm run test:frontend
```

## 📊 KPI 목표

- **A1**: 24시간 내 2건 이상 연동 사용자 비율 ≥45%
- **A2**: 제안→행동 전환율 ≥15%
- **R**: 4주 리텐션 ≥35%
- **절감액**: 월 평균 절감 ≥₩10,000/인

## 🔧 환경 변수

프로젝트 루트의 `.env.example` 파일을 참고하여 `.env` 파일을 생성하세요.

## 📚 문서

- [통합 스펙 문서](./docs/SubscriptionMaster_AllInOne.md)
- [API 문서](./docs/api.md)
- [데이터베이스 스키마](./db/schema.sql)

## 🤝 기여

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.
