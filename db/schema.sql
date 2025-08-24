-- SubscriptionMaster Database Schema
-- 생성일: 2025-01-27
-- 버전: 1.0.0

-- 사용자 테이블
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  avatar_url TEXT,
  timezone VARCHAR(50) DEFAULT 'UTC',
  preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 머천트 테이블 (정규화된 상호명)
CREATE TABLE merchants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_norm VARCHAR(255) NOT NULL,
  name_original VARCHAR(255),
  category VARCHAR(100),
  cancel_url TEXT,
  terms_hash TEXT,
  logo_url TEXT,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 구독 테이블
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  merchant_id UUID NOT NULL REFERENCES merchants(id),
  plan VARCHAR(255),
  cycle VARCHAR(50) CHECK (cycle IN ('monthly', 'yearly', 'trial')),
  next_bill_at TIMESTAMPTZ,
  price NUMERIC(12,2),
  currency VARCHAR(3) DEFAULT 'KRW',
  status VARCHAR(50) CHECK (status IN ('active', 'paused', 'canceled')) DEFAULT 'active',
  meta JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 거래 내역 테이블
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  merchant_id UUID REFERENCES merchants(id),
  subscription_id UUID REFERENCES subscriptions(id),
  amount NUMERIC(12,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'KRW',
  ts TIMESTAMPTZ NOT NULL,
  source VARCHAR(50), -- email, card_csv, bank_csv, manual
  raw JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 알림 테이블
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) CHECK (type IN ('trial_d3', 'price_up', 'duplicate', 'unused_seat')),
  trigger_at TIMESTAMPTZ NOT NULL,
  payload JSONB NOT NULL,
  sent_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 절감 테이블
CREATE TABLE savings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) CHECK (type IN ('cancel', 'pause', 'switch_yearly', 'coupon')),
  amount NUMERIC(12,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'KRW',
  proof_ref TEXT,
  subscription_id UUID REFERENCES subscriptions(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 동의 테이블
CREATE TABLE consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scope VARCHAR(100) NOT NULL, -- 'receipt_email', 'alerts', 'analytics', ...
  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoke_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 감사 로그 테이블
CREATE TABLE audit_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  action VARCHAR(255) NOT NULL,
  target VARCHAR(255),
  target_id UUID,
  at TIMESTAMPTZ DEFAULT NOW(),
  ip INET,
  user_agent TEXT,
  meta JSONB
);

-- 정규화 규칙 테이블
CREATE TABLE normalization_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canonical_name VARCHAR(255) NOT NULL,
  synonyms TEXT[] NOT NULL,
  category VARCHAR(100),
  cancel_url TEXT,
  ruleset_version VARCHAR(20) DEFAULT '1.0.0',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_next_bill ON subscriptions(next_bill_at);
CREATE INDEX idx_subscriptions_merchant_id ON subscriptions(merchant_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_ts ON transactions(ts);
CREATE INDEX idx_transactions_merchant_id ON transactions(merchant_id);

CREATE INDEX idx_alerts_user_id ON alerts(user_id);
CREATE INDEX idx_alerts_trigger_at ON alerts(trigger_at);
CREATE INDEX idx_alerts_type ON alerts(type);

CREATE INDEX idx_savings_user_id ON savings(user_id);
CREATE INDEX idx_savings_created_at ON savings(created_at);

CREATE INDEX idx_consents_user_id ON consents(user_id);
CREATE INDEX idx_consents_scope ON consents(scope);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_at ON audit_logs(at);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);

CREATE INDEX idx_normalization_rules_canonical ON normalization_rules(canonical_name);
CREATE INDEX idx_normalization_rules_synonyms ON normalization_rules USING GIN(synonyms);

-- 트리거 함수: updated_at 자동 업데이트
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 생성
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_merchants_updated_at BEFORE UPDATE ON merchants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 샘플 데이터 삽입 (개발용)
INSERT INTO normalization_rules (canonical_name, synonyms, category, cancel_url) VALUES
  ('Netflix', ARRAY['NETFLIX.COM', 'NETFLIX*', 'Netflix KR'], 'OTT', 'https://www.netflix.com/cancelplan'),
  ('Spotify', ARRAY['SPOTIFYABONNEMANG', 'SPOTIFY*PREMIUM'], 'Music', 'https://www.spotify.com/account/subscription/'),
  ('YouTube Premium', ARRAY['GOOGLE *YOUTUBE', 'YOUTUBE PREMIUM'], 'OTT', 'https://www.youtube.com/premium'),
  ('Notion', ARRAY['NOTION LABS', 'NOTION*'], 'Productivity', 'https://www.notion.so/help/cancel-subscription'),
  ('Figma', ARRAY['FIGMA INC', 'FIGMA*'], 'Design', 'https://www.figma.com/help/account-billing/');
