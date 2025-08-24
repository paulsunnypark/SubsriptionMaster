A. 요구 요약 & 확정 가정

* 목표: 앞서 제공한 모든 개별 MD를 한데 모아, 설계·구현·테스트·운영까지 한 문서로 추진 가능한 **통합 스펙 MD(All-in-One)** 를 생성합니다.
* 범위: MVP(0–90일) 중심, 개인(다구독) 우선 + Business/팀 기능은 Feature Flag로 설계 포함.
* 기본 스택: FE=Next.js(PWA)+Tailwind, BE=NestJS(REST), DB=Postgres, 캐시/큐=Redis, OBJ=S3, 단일 리전.
* 보안/컴플: 최소권한 OAuth, PII 분리암호화+KMS, 감사로그, 보존기간 정책.
* KPI: A1(24h 연동≥2건), A2(절감 제안→행동 전환), R(4주 리텐션), 1인당 절감액.

B. 수용 기준(AC)

1. 통합 파일만으로 API·DDL·알림·보안·KPI를 구현/운영할 수 있어야 한다.
2. 모든 규칙(중복/인상/트라이얼) 임계값과 예시는 문서 내에 수치로 명시되어야 한다.
3. 테스트(Gherkin) 예시 ≥6개, 에러/엣지(헤더 누락, 중복행, TZ) 포함.
4. 런북에 RTO/RPO, 백업/복구, 배포/롤백 절차가 있어야 한다.
5. Feature Flag 목록/기본값/롤아웃 전략이 표로 정리되어야 한다.

C. 설계 요약 & 파일맵

* 산출물: `docs/SubscriptionMaster_AllInOne.md` (아래 E 코드블록의 내용 그대로 저장)
* 구성 섹션: PRD, Tech Spec, API, Data Model(DDL), Normalization Rules, Alerts, Security/Compliance, Test Plan, Runbook, KPI, Feature Flags, Config Guide(.env), Roadmap, 부록.

D. 구현 체크리스트

* [x] 모든 단일 문서 내용을 구조화된 단일 목차로 병합
* [x] 임계값(인상 15%, 중복 35일, D–3) 명시
* [x] Mermaid/YAML/SQL/Gherkin 블록 정리
* [x] KPI↔테이블 매핑 포함
* [x] 운영 런북/RTO/RPO/롤백 포함

E. 코드 전체(통합 MD 파일; 파일 경로: `docs/SubscriptionMaster_AllInOne.md`)

````md
# SubscriptionMaster — 통합 스펙 (All-in-One)

생성일: 2025-08-24  
버전: 1.0.0

> 본 문서는 **웹 기반 가입정보관리·비용절감·제안** 서비스의 PRD + 기술명세 + API/DDL + 룰 + 보안/운영 + 테스트 + 로드맵을 **하나의 파일**로 제공합니다.

---

## 목차
1. [엑서큐티브 서머리](#엑서큐티브-서머리)  
2. [PRD — 제품명세서(MVP 0–90일)](#prd--제품명세서mvp-0–90일)  
3. [기술명세서(아키텍처·도메인·NFR)](#기술명세서아키텍처도메인nfr)  
4. [API 계약 요약(OpenAPI)](#api-계약-요약openapi)  
5. [데이터 모델 & DDL](#데이터-모델--ddl)  
6. [정규화/중복·인상 탐지 룰](#정규화중복인상-탐지-룰)  
7. [알림 플레이북(스케줄러/템플릿/캡핑)](#알림-플레이북스케줄러템플릿캡핑)  
8. [보안 & 컴플라이언스](#보안--컴플라이언스)  
9. [테스트 계획(Unit/Integration/E2E)](#테스트-계획unitintegratione2e)  
10. [운영 런북(백업·복구·배포·장애)](#운영-런북백업복구배포장애)  
11. [KPI & 메트릭(산식/계측/대시보드)](#kpi--메트릭산식계측대시보드)  
12. [Feature Flags](#feature-flags)  
13. [설정 가이드 & .env 예시](#설정-가이드--env-예시)  
14. [로드맵(90일)](#로드맵90일)  
15. [부록(샘플 CSV/스크립트/라벨 정의)](#부록샘플-csv스크립트라벨-정의)

---

## 엑서큐티브 서머리

- 핵심 가설: **자동 수집 + 지출 가시화 + 행동 유도 알림 = 유지/전환 상승**  
- 90일 MVP 목표: 사용자가 **첫 24시간 내 ≥2건 연동(A1)**, **무료체험/중복/인상** 3대 이벤트에서 **즉시 절약 행동(A2)**.  
- 타깃: 다구독 개인(우선), 스타트업/스몰비즈(설계 포함, 플래그 OFF).  
- 수익: Pro(₩3–7천/월), Business(₩2–5천/인·월), 절감 성과 수수료, 제휴/리퍼럴, 데이터 인사이트(B2B 익명·동의 기반).  
- 스택: FE=Next.js(PWA)+Tailwind, BE=NestJS(REST), DB=Postgres, Redis(큐/캐시), S3(영수증), 단일 리전.  
- 보안: 최소 권한 OAuth/OIDC, PII 분리 암호화(KMS), 감사로그, 보존기간 정책.

---

## PRD — 제품명세서(MVP 0–90일)

### 1) 타깃 & 문제
- 다구독 개인/팀은 구독이 분산되어 **총액·중복·트라이얼 종료**를 놓치며 불필요 지출 발생.  
- 해지/전환 절차가 복잡해 행동 전환율이 낮음.

### 2) 핵심 가치
1) **자동 인입**(이메일/CSV/수동) 2) **가시화**(달력/예측/합계) 3) **행동 유도 알림**(D–3/인상/중복) + **원클릭 가이드**.

### 3) 범위(Scope)
- **In**: 이메일/CSV 인입, 정규화/중복·인상 탐지, 캘린더·예측, D-3 알림, 액션 가이드, KPI 대시보드.  
- **Out**: 결제수단 저장/발급(가상카드=파트너 토큰), 완전 자동 해지 대행(초기엔 가이드 중심).

### 4) 핵심 기능(MVP)
- 구독 인입(파일·수동·이메일 파서), 정규화/중복 탐지, 달력/현금흐름/예측, 트라이얼·인상 경보, 원클릭 액션 가이드, 보안/신뢰.

### 5) 유저 스토리 & AC(발췌)
- **US1** 업로드 3분 내 구독리스트 확인 → **A1 카드** 갱신.  
- **US2** 트라이얼 **D–3 알림** 수신 → **해지/연간전환 가이드** 실행 로그.  
- **US3** **중복/유령** 탐지 → **절감 카드** 표시(정확).  
- **US4** **가격 인상** 사전 인지 → **대안 비교 카드** 노출.  
- **US5** **안전한 처리/보존** → PII 분리/암호화·감사로그·보존기간.

### 6) 성공지표(목표)
- A1 ≥45%, A2 ≥15%, 4주 리텐션 ≥35%, 절감 ≥₩10,000/인/월.

### 7) 페이월(스냅샷)
- Pro: 인상 실시간 알림/가성비 대안/가족공유 — ₩3–7천/월.  
- Business: SaaS 인벤토리/좌석정리/정책·승인 — ₩2–5천/인·월(최저과금).

---

## 기술명세서(아키텍처·도메인·NFR)

```mermaid
flowchart LR
  U[PWA]-->FE[Next.js]
  FE-->API[NestJS]
  API-->DB[(Postgres)]
  API-->Q[Redis Queue]
  API-->OBJ[(S3)]
  W1[Email Parser]-->DB
  W1-->Q
  W2[Scheduler/Alerts]-->DB
  W2-->NOTI[Mail/SMS/Push]
  API-->AUTH[OAuth/OIDC]
  API-->OBS[Logs/Metrics/Trace]
````

### 도메인 모듈

* **Ingest**(CSV/메일 수집/검증/중복 제거)
* **Normalize**(상호명→머천트 매핑, 중복/유령 탐지)
* **Subscriptions**(주기/다음 결제일, 합계)
* **Forecast/Calendar**(달력, 단순 예측, 증감율)
* **Alerts**(D–3, 인상, Business 좌석 미사용)
* **Action Center**(해지/일시중지/연간전환 가이드·스크립트)
* **Savings**(절감 이벤트 집계)
* **Security/Consent**(동의, 감사로그, PII 분리)
* **Admin/Business**(조직/SSO/도메인 스캔·벤치마크)

### NFR

* 성능 p50<300ms/p95<800ms, 가용성 SLO 99.9%, 큐 재시도(지수 백오프), 멱등 처리.
* 보안: OAuth2/OIDC, RBAC, PII 컬럼 분리+KMS 암호화, OWASP Top10, 비밀=KMS/PSM.
* 관측성: 구조화 로깅, APM, 핵심 KPI 메트릭 노출.

### 에러/레이트리밋/멱등

* 429 쿼터(사용자/토큰/라우트), `Idempotency-Key` 지원, 큐 작업 멱등 키(해시).

---

## API 계약 요약(OpenAPI)

```yaml
openapi: 3.0.3
info: { title: SubscriptionMaster API, version: "1.0.0" }
paths:
  /ingest/upload:
    post:
      summary: CSV 업로드
      requestBody:
        required: true
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                file: { type: string, format: binary }
                source: { type: string, enum: [card_csv, bank_csv] }
      responses:
        "200": { $ref: "#/components/responses/IngestOk" }
        "422": { $ref: "#/components/responses/ValidationError" }
  /ingest/email/test:
    post: { summary: IMAP/POP3 연결 테스트, responses: { "200": { description: OK } } }
  /subscriptions:
    get:
      summary: 구독 목록(정규화 적용)
      parameters: [{ in: query, name: month, schema: { type: string, pattern: "^[0-9]{4}-[0-9]{2}$" }}]
      responses: { "200": { $ref: "#/components/responses/SubList" } }
  /alerts/preview:
    post: { summary: D-3/인상 경보 미리보기, responses: { "200": { description: OK } } }
  /actions/generate:
    post:
      summary: 해지/전환 가이드 생성
      requestBody: { content: { application/json: { schema: { $ref: "#/components/schemas/ActionRequest" }}}}
      responses: { "200": { $ref: "#/components/responses/ActionGuide" } }
components:
  responses:
    IngestOk:
      description: OK
      content: { application/json: { schema: { $ref: "#/components/schemas/IngestResult" } } }
    ValidationError: { description: 잘못된 파일/헤더/행 }
    SubList:
      description: 구독 목록
      content: { application/json: { schema: { $ref: "#/components/schemas/SubscriptionList" } } }
    ActionGuide:
      description: 가이드/스크립트
      content: { application/json: { schema: { $ref: "#/components/schemas/ActionGuide" } } }
  schemas:
    IngestResult:
      type: object
      properties:
        accepted: { type: integer }
        rejected: { type: integer }
        errors: { type: array, items: { type: object, properties: { row: { type: integer }, reason: { type: string }}}}
    Merchant: { type: object, properties: { id: { type: string, format: uuid }, name_norm: { type: string }, category: { type: string }, cancel_url: { type: string } } }
    Subscription:
      type: object
      properties:
        id: { type: string, format: uuid }
        merchant: { $ref: "#/components/schemas/Merchant" }
        plan: { type: string }
        cycle: { type: string, enum: [monthly, yearly, trial] }
        next_bill_at: { type: string, format: date-time }
        price: { type: number }
        status: { type: string, enum: [active, paused, canceled] }
        badges: { type: array, items: { type: string, enum: [duplicate, ghost, price_up, trial_ending] } }
    SubscriptionList:
      type: object
      properties:
        total_monthly: { type: number }
        total_yearly: { type: number }
        items: { type: array, items: { $ref: "#/components/schemas/Subscription" } }
    ActionRequest: { type: object, properties: { subscription_id: { type: string }, intent: { type: string, enum: [cancel, pause, switch_yearly] } } }
    ActionGuide:
      type: object
      properties:
        steps: { type: array, items: { type: string } }
        script: { type: string }
        links: { type: array, items: { type: string } }
```

---

## 데이터 모델 & DDL

```mermaid
erDiagram
  USER ||--o{ SUBSCRIPTION : owns
  MERCHANT ||--o{ SUBSCRIPTION : has
  MERCHANT ||--o{ TRANSACTION : billed
  USER ||--o{ TRANSACTION : makes
  USER ||--o{ ALERT : receives
  USER ||--o{ SAVING : earns
  USER ||--o{ CONSENT : grants
```

```sql
-- 핵심 테이블
create table merchants(
  id uuid primary key,
  name_norm text not null,
  category text,
  cancel_url text,
  terms_hash text,
  created_at timestamptz default now()
);

create table subscriptions(
  id uuid primary key,
  user_id uuid not null,
  merchant_id uuid not null references merchants(id),
  plan text,
  cycle text check (cycle in ('monthly','yearly','trial')),
  next_bill_at timestamptz,
  price numeric(12,2),
  status text check (status in ('active','paused','canceled')) default 'active',
  meta jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);
create index idx_sub_user on subscriptions(user_id);
create index idx_sub_next on subscriptions(next_bill_at);

create table transactions(
  id uuid primary key,
  user_id uuid not null,
  merchant_id uuid references merchants(id),
  amount numeric(12,2) not null,
  ts timestamptz not null,
  source text, -- email, card_csv, bank_csv, manual
  raw jsonb,
  created_at timestamptz default now()
);

create table alerts(
  id uuid primary key,
  user_id uuid not null,
  type text check (type in ('trial_d3','price_up','duplicate','unused_seat')),
  trigger_at timestamptz not null,
  payload jsonb not null,
  sent_at timestamptz,
  created_at timestamptz default now()
);

create table savings(
  id uuid primary key,
  user_id uuid not null,
  type text check (type in ('cancel','pause','switch_yearly','coupon')),
  amount numeric(12,2) not null,
  proof_ref text,
  created_at timestamptz default now()
);

create table consents(
  id uuid primary key,
  user_id uuid not null,
  scope text not null, -- 'receipt_email','alerts','analytics', ...
  granted_at timestamptstz not null default now(),
  revoke_at timestamptz
);

create table audit_logs(
  id bigserial primary key,
  user_id uuid,
  action text not null,
  target text,
  at timestamptz default now(),
  ip inet,
  meta jsonb
);
```

**KPI 매핑(요약)**

* **A1** = `연동≥2건 사용자 수 / 신규 사용자 수` (24h) — 소스: `transactions` + 온보딩 로그
* **A2** = `action_completed / offer_impressions` — 소스: `alerts` + 클릭 이벤트
* **R(4주)** = Cohort Retention — 소스: 세션/이벤트 로그
* **월 절감액** = `sum(savings.amount where month=...)`

---

## 정규화/중복·인상 탐지 룰

```yaml
canonical:
  - key: "Netflix"
    synonyms: ["NETFLIX.COM", "NETFLIX*", "Netflix KR"]
    category: "OTT"
    cancel_url: "https://www.netflix.com/cancelplan"
  - key: "Spotify"
    synonyms: ["SPOTIFYABONNEMANG", "SPOTIFY*PREMIUM"]
    category: "Music"

rules:
  duplicate:
    window_days: 35
    price_tolerance: 0.10
  ghost:
    criteria:
      - no_login_days: 60   # 사용지표 연동 시

price_increase:
  min_delta_pct: 0.15
  lookback_months: 6

trial:
  notify_days_before: 3
```

**운영 지침**

* 룰 버저닝: `ruleset_version` 필드를 이벤트/결과에 저장.
* 과탐/미탐 대응: 임계값 조정 + 사용자 피드백 루프(신고 버튼).

---

## 알림 플레이북(스케줄러/템플릿/캡핑)

**타입 & 트리거**

* `trial_d3`: `subscriptions.cycle='trial'` & `next_bill_at = T+3d`
* `price_up`: 최근 6개월 평균 대비 ≥15% 인상
* `duplicate`: 동일 canonical merchant 월 중복 결제

```mermaid
sequenceDiagram
  participant CRON as Scheduler
  participant API as API
  participant DB as Postgres
  participant Q as Redis
  participant NOTI as Mail/SMS/Push
  CRON->>API: /jobs/scan-trial-d3
  API->>DB: find trials expiring in 3 days
  API->>Q: enqueue trial_d3
  Q->>NOTI: send templated message
  API->>DB: mark sent_at
```

**빈도 캡핑**

* 동일 유형/머천트 **1일 1회**, 주간 최대 3회.

**템플릿(예시)**

* 제목: `[D-3] {merchant} 무료체험 종료 임박`
* 본문: “지금 해지/연간전환 시 연 ₩{saving} 절감 예상”
* 버튼: `해지 절차`, `연간 전환`, `상담 스크립트 보기`

---

## 보안 & 컴플라이언스

**정책**

* 최소 권한 OAuth 스코프, 세션/토큰 만료·회전.
* PII 분리 테이블/컬럼, KMS 암호화(AES-GCM), 전송 중 TLS.
* 결제정보 저장 금지(파트너 토큰만).
* 동의/보존: `consents` 기반, 철회 시 즉시 마스킹 & 파기 스케줄.
* 감사로그: 모든 읽기/쓰기/관리자 행위 기록.

**운영 통제**

* WAF/레이트리밋, 관리자 2FA, 비밀은 KMS/Parameter Store.
* 보안 이벤트 탐지 → 세션 무효화 & 알림.

---

## 테스트 계획(Unit/Integration/E2E)

**Unit**: CSV 파싱(헤더/타입), 중복/인상 탐지, 절감 계산, 날짜/TZ.
**Integration**: `/ingest/upload`→DB 반영/중복 제거, `/actions/generate`→가이드 생성.
**E2E(Gherkin)**

```gherkin
Feature: Ingest & Normalize
  Scenario: CSV 업로드 성공
    Given 유효 CSV 10행
    When /ingest/upload 로 업로드
    Then accepted=10, rejected=0, 구독 5건 생성

  Scenario: 중복 탐지
    Given 동일 canonical merchant 월 2건
    When 정규화/중복 룰 실행
    Then duplicate 배지 표시

Feature: Trial D-3 Alert
  Scenario: 트라이얼 종료 알림
    Given next_bill_at 이 3일 남은 trial
    When 스케줄러 실행
    Then trial_d3 알림 발송 & Action Guide 생성

Feature: Price Increase
  Scenario: 6개월 평균 대비 20% 상승
    Given 최근 결제액 기록
    When 인상 감지
    Then price_up 경보 & 대안 카드

Feature: CSV 오류 처리
  Scenario: 잘못된 헤더
    Given header 누락 CSV
    When 업로드
    Then 422 ValidationError 와 오류행 리포트

Feature: Timezone Safety
  Scenario: 다른 TZ 사용자
    Given next_bill_at UTC 저장
    When 사용자 TZ 렌더링
    Then 달력과 알림 시간이 로컬 TZ 로 정확히 표기
```

---

## 운영 런북(백업·복구·배포·장애)

**헬스체크**: `GET /health` 200, DB 마이그레이션 OK.
**백업/복구**: DB 일 1회 스냅샷 + PITR, **RPO ≤ 15분**, **RTO ≤ 60분**. OBJ 버전닝/라이프사이클.
**장애 대응**: 큐 적체 5분↑ → 재시도 백오프/워커 수평 확장. 알림 실패율 10%↑ → 공급자 스왑(서킷 브레이커), 대체 경로.
**릴리즈/롤백**: Blue-Green 또는 Canary(5%→25%→100%), 실패 시 이전 이미지로 즉시 롤백.

---

## KPI & 메트릭(산식/계측/대시보드)

**정의**

* **A1**: `연동≥2건 사용자 수 / 신규 사용자 수` (24h)
* **A2**: `행동완료 / 제안노출`
* **R(4주)**: Cohort Retention
* **절감액**: `sum(savings.amount)`

**계측 지점**

* 업로드 성공/실패, 정규화 결과, 알림 발송/클릭, 가이드 실행, 절감 기록.

**대시보드 카드**

* A1, A2, 4주 리텐션, 이번달/연간 절감 예상, 위험(트라이얼/인상/중복) 카운트.

---

## Feature Flags

| Flag          | Default | 설명                  |
| ------------- | ------- | ------------------- |
| BUSINESS      | OFF     | 조직/SSO/좌석·정책        |
| PRICE\_INTEL  | OFF     | 카테고리 평균/시즌 최저가      |
| VIRTUAL\_CARD | OFF     | 구독별 한도/락(파트너 연동)    |
| EXT\_USAGE    | OFF     | 사용량 지표(브라우저 확장/캘린더) |

* 롤아웃: Dev→%Canary→All, 메트릭 가드(A2/오류율).

---

## 설정 가이드 & .env 예시

```
NODE_ENV=development
PORT=3000
DATABASE_URL=postgres://user:pass@host:5432/subscriptionmaster
REDIS_URL=redis://host:6379
S3_ENDPOINT=https://s3.example.com
S3_BUCKET=subscriptionmaster-receipts
OAUTH_CLIENT_ID=xxx
OAUTH_CLIENT_SECRET=xxx
JWT_SECRET=change_me
KMS_KEY_ID=alias/subsaver-kms
ALERT_EMAIL_PROVIDER=ses
ALERT_SMS_PROVIDER=null
```

* 시크릿 관리: 로컬은 `.env`, 스테이지/프로덕션은 KMS/Secret Manager.

---

## 로드맵(90일)

* **W1–2**: CSV/이메일 인입, 정규화 v1, 대시보드 스켈레톤
* **W3–4**: 캘린더/예측, D–3 알림, 액션 가이드 v1
* **W5–6**: 가격 인상 감지, 절감 카드, KPI 트래킹
* **W7–8**: 보안·감사로그·보존정책, 부하/성능 테스트
* **W9–10**: Pro 페이월, 결제(구독과 별도), GTM 툴
* **W11–12**: Business 토글 베타 / Price Intel 연구

---

## 부록(샘플 CSV/스크립트/라벨 정의)

**샘플 CSV 스키마**: `date, merchant, amount, currency, memo, source`

**해지/전환 스크립트(예시)**

* 해지(전화): “최근 3개월 사용 내역이 없고, 결제액이 월 ₩X입니다. 오늘 해지 부탁드립니다.”
* 연간 전환: “동일 플랜 연간 요금이 월 결제 대비 연 ₩Y 절감되어 전환 희망합니다.”

**위험 라벨**: `duplicate`, `ghost`, `price_up`, `trial_ending`

```

F. 실행/테스트 방법(명령어 포함)  
1) 위 코드블록을 `docs/SubscriptionMaster_AllInOne.md`로 저장.  
2) OpenAPI 블록만 별도 추출 시 `openapi.yaml`로 저장 후 Swagger/Redoc 렌더.  
3) DDL 블록을 `db/schema.sql`로 저장 후 `psql -f db/schema.sql` 적용.  
4) 룰 블록을 `config/normalization-rules.yaml`로 저장 후 서버 부팅 시 로드.  
5) 테스트: `테스트 계획` 섹션의 Gherkin을 기준으로 E2E(Cypress/Cucumber) 구현.

G. 셀프 리뷰(정적 분석/테스트 관점)  
- 문서 일관성: API↔DDL↔룰↔KPI가 상호 참조되며 임계값이 명확.  
- 운영 공백 없음: 백업/RTO·RPO/장애·롤백 포함.  
- 보안 기준 반영: PII 분리 암호화/KMS/감사로그/비밀관리 원칙 제시.  
- 테스트 커버리지: 정상/오류/엣지/TZ 포함한 Gherkin ≥6개.

H. 트러블슈팅 노트  
- CSV 헤더 상이: 업로드 시 헤더 매핑 UI 제공, 오류행 리포트 저장.  
- 과탐(인상/중복): 임계값 플래그화, 룰 버전 롤백.  
- 알림 과다: 채널 우선순위/빈도 캡/주간 요약.  
- TZ 문제: `next_bill_at` UTC 저장 + 클라이언트 렌더 시 사용자 TZ 변환.

I. 다음 이터레이션 제안(선택)  
- Price Intelligence 대시보드(카테고리 평균/시즌성) + 대안 추천 A/B.  
- Business 좌석 미사용 탐지(SSO/도메인 스캔) 고도화.  
- 브라우저 확장(체크아웃 인터셉트) 기반 실시간 절감 제안.
```
