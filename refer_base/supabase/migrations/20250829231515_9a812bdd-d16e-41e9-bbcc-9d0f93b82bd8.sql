-- SubWatch Wise 구독 관리 앱을 위한 데이터베이스 스키마 생성

-- 1. 구독 카테고리 테이블
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT DEFAULT '📱',
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. 서비스 제공업체 테이블
CREATE TABLE public.merchants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_normalized TEXT NOT NULL,
  domain TEXT,
  logo_url TEXT,
  category_id UUID REFERENCES public.categories(id),
  cancel_url TEXT,
  support_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 3. 기존 subscriptions 테이블 수정 (merchant 연동)
ALTER TABLE public.subscriptions 
ADD COLUMN IF NOT EXISTS merchant_id UUID REFERENCES public.merchants(id),
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id),
ADD COLUMN IF NOT EXISTS trial_end_date DATE,
ADD COLUMN IF NOT EXISTS last_charged_date DATE,
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'KRW',
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS notes TEXT;

-- 4. 알림 테이블
CREATE TABLE public.alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('trial_expiry', 'price_increase', 'duplicate', 'unused', 'renewal_reminder')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'dismissed', 'completed')),
  scheduled_for TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 5. 절약 목표 테이블
CREATE TABLE public.saving_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_amount INTEGER NOT NULL CHECK (target_amount > 0),
  current_amount INTEGER DEFAULT 0 CHECK (current_amount >= 0),
  target_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 6. 절약 기록 테이블 
CREATE TABLE public.savings_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  goal_id UUID REFERENCES public.saving_goals(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('cancel', 'downgrade', 'yearly_switch', 'coupon', 'negotiation', 'family_plan')),
  amount INTEGER NOT NULL CHECK (amount > 0),
  currency TEXT DEFAULT 'KRW',
  description TEXT NOT NULL,
  action_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 7. 데이터 업로드 기록 테이블
CREATE TABLE public.ingest_uploads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed', 'cancelled')),
  total_rows INTEGER DEFAULT 0,
  processed_rows INTEGER DEFAULT 0,
  successful_rows INTEGER DEFAULT 0,
  failed_rows INTEGER DEFAULT 0,
  error_details JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 8. 사용자 설정 테이블
CREATE TABLE public.user_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  timezone TEXT DEFAULT 'Asia/Seoul',
  language TEXT DEFAULT 'ko',
  currency TEXT DEFAULT 'KRW',
  date_format TEXT DEFAULT 'YYYY-MM-DD',
  theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  notifications JSONB DEFAULT '{"email": true, "push": false, "trial_expiry": true, "price_increase": true}',
  privacy JSONB DEFAULT '{"profile_visibility": "private", "data_sharing": false}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS 정책 설정
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saving_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ingest_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Categories (모든 사용자가 조회 가능)
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);

-- Merchants (모든 사용자가 조회 가능)
CREATE POLICY "Anyone can view merchants" ON public.merchants FOR SELECT USING (true);

-- Alerts (사용자 본인만 접근)
CREATE POLICY "Users can view their own alerts" ON public.alerts 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own alerts" ON public.alerts 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own alerts" ON public.alerts 
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own alerts" ON public.alerts 
  FOR DELETE USING (auth.uid() = user_id);

-- Saving Goals (사용자 본인만 접근)
CREATE POLICY "Users can view their own saving goals" ON public.saving_goals 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own saving goals" ON public.saving_goals 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own saving goals" ON public.saving_goals 
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own saving goals" ON public.saving_goals 
  FOR DELETE USING (auth.uid() = user_id);

-- Savings Records (사용자 본인만 접근)
CREATE POLICY "Users can view their own savings records" ON public.savings_records 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own savings records" ON public.savings_records 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own savings records" ON public.savings_records 
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own savings records" ON public.savings_records 
  FOR DELETE USING (auth.uid() = user_id);

-- Ingest Uploads (사용자 본인만 접근)
CREATE POLICY "Users can view their own uploads" ON public.ingest_uploads 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own uploads" ON public.ingest_uploads 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own uploads" ON public.ingest_uploads 
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own uploads" ON public.ingest_uploads 
  FOR DELETE USING (auth.uid() = user_id);

-- User Settings (사용자 본인만 접근)
CREATE POLICY "Users can view their own settings" ON public.user_settings 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own settings" ON public.user_settings 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own settings" ON public.user_settings 
  FOR UPDATE USING (auth.uid() = user_id);

-- 트리거 설정 (업데이트 시간 자동 갱신)
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_merchants_updated_at
  BEFORE UPDATE ON public.merchants
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_alerts_updated_at
  BEFORE UPDATE ON public.alerts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_saving_goals_updated_at
  BEFORE UPDATE ON public.saving_goals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_savings_records_updated_at
  BEFORE UPDATE ON public.savings_records
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ingest_uploads_updated_at
  BEFORE UPDATE ON public.ingest_uploads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON public.user_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 인덱스 생성 (성능 최적화)
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX idx_subscriptions_next_billing ON public.subscriptions(next_billing);
CREATE INDEX idx_alerts_user_id ON public.alerts(user_id);
CREATE INDEX idx_alerts_status ON public.alerts(status);
CREATE INDEX idx_alerts_type ON public.alerts(type);
CREATE INDEX idx_savings_records_user_id ON public.savings_records(user_id);
CREATE INDEX idx_savings_records_type ON public.savings_records(type);
CREATE INDEX idx_saving_goals_user_id ON public.saving_goals(user_id);
CREATE INDEX idx_saving_goals_status ON public.saving_goals(status);

-- 기본 카테고리 데이터 삽입
INSERT INTO public.categories (name, description, icon, color) VALUES
('스트리밍', '영상 및 음악 스트리밍 서비스', '🎬', '#EF4444'),
('소프트웨어', '생산성 및 개발 도구', '💻', '#3B82F6'),
('피트니스', '운동 및 건강 관리', '💪', '#10B981'),
('교육', '온라인 강의 및 학습', '📚', '#F59E0B'),
('뉴스', '뉴스 및 매거진', '📰', '#6B7280'),
('게임', '게임 및 엔터테인먼트', '🎮', '#8B5CF6'),
('클라우드', '클라우드 스토리지 및 백업', '☁️', '#06B6D4'),
('통신', '인터넷 및 모바일 요금', '📱', '#84CC16'),
('기타', '기타 구독 서비스', '📦', '#64748B');

-- 주요 서비스 제공업체 데이터 삽입
INSERT INTO public.merchants (name, name_normalized, domain, category_id) 
SELECT 
  'Netflix', 'netflix', 'netflix.com', c.id 
FROM public.categories c WHERE c.name = '스트리밍'
UNION ALL
SELECT 
  'Spotify', 'spotify', 'spotify.com', c.id 
FROM public.categories c WHERE c.name = '스트리밍'
UNION ALL
SELECT 
  'YouTube Premium', 'youtube_premium', 'youtube.com', c.id 
FROM public.categories c WHERE c.name = '스트리밍'
UNION ALL  
SELECT 
  'Adobe Creative Cloud', 'adobe_cc', 'adobe.com', c.id 
FROM public.categories c WHERE c.name = '소프트웨어'
UNION ALL
SELECT 
  'Microsoft 365', 'microsoft_365', 'microsoft.com', c.id 
FROM public.categories c WHERE c.name = '소프트웨어';