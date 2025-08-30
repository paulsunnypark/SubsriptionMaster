import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Shield, Zap } from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 gradient-text">
            SubWatch Wise
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            구독 서비스를 스마트하게 관리하고, 불필요한 지출을 줄이며, 
            최적의 구독 포트폴리오를 구성하세요.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/register')}
              className="px-8"
            >
              시작하기
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => navigate('/login')}
              className="px-8"
            >
              로그인
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>지출 추적</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                모든 구독 서비스의 비용을 한눈에 파악하고 
                월별, 연별 지출을 추적하세요.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>스마트 알림</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                갱신일, 가격 인상, 중복 구독 등을 미리 알려드려 
                불필요한 지출을 방지하세요.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>자동 최적화</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                AI 기반 분석으로 더 나은 요금제나 대안 서비스를 
                추천받아 비용을 절약하세요.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">지금 시작하세요</CardTitle>
              <CardDescription>
                월 평균 30% 이상의 구독 비용을 절약할 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                size="lg" 
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto px-12"
              >
                무료로 시작하기
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
