'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatsCard } from '@/components/ui/stats-card';
import { RiskBadge } from '@/components/ui/risk-badge';
import { AppLayout } from '@/components/layout/app-layout';
import { 
  CreditCard, 
  Bell, 
  TrendingUp, 
  Plus,
  Calendar,
  DollarSign,
  AlertTriangle,
  ArrowRight,
  Target
} from 'lucide-react';

interface DashboardStats {
  monthly_total: number;
  yearly_total: number;
  total_savings: number;
  active_subscriptions: number;
  at_risk_count: number;
}

interface RiskSubscription {
  id: string;
  name: string;
  type: 'trial_ending' | 'price_increase' | 'duplicate' | 'unused' | 'ghost';
  daysLeft?: number;
  amount: number;
}

interface RecentSaving {
  id: string;
  action: string;
  amount: number;
  date: string;
}

interface UpcomingBill {
  id: string;
  name: string;
  date: string;
  amount: number;
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    monthly_total: 127.99,
    yearly_total: 1535.88,
    total_savings: 245.50,
    active_subscriptions: 12,
    at_risk_count: 3,
  });

  const riskSubscriptions: RiskSubscription[] = [
    { id: '1', name: 'Netflix Premium', type: 'trial_ending', daysLeft: 3, amount: 15.99 },
    { id: '2', name: 'Spotify Premium', type: 'price_increase', amount: 11.99 },
    { id: '3', name: 'Adobe Creative Cloud', type: 'duplicate', amount: 52.99 }
  ];

  const recentSavings: RecentSaving[] = [
    { id: '1', action: 'YouTube Premium 취소', amount: 11.99, date: 'Dec 10, 2024' },
    { id: '2', action: 'Disney+ 연간 플랜 변경', amount: 24.00, date: 'Dec 8, 2024' },
    { id: '3', action: 'Dropbox 다운그레이드', amount: 9.99, date: 'Dec 5, 2024' }
  ];

  const upcomingBills: UpcomingBill[] = [
    { id: '1', name: 'Spotify Premium', date: 'Dec 15, 2024', amount: 11.99 },
    { id: '2', name: 'Netflix Premium', date: 'Dec 18, 2024', amount: 15.99 },
    { id: '3', name: 'Adobe Creative Cloud', date: 'Dec 20, 2024', amount: 52.99 }
  ];

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* 환영 메시지 */}
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            안녕하세요, {user.name}님!
          </h2>
          <p className="text-muted-foreground mt-2">
            구독 관리 및 절감 기회를 확인해보세요
          </p>
        </div>

        {/* 주요 지표 */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="월 총 지출"
            value={formatCurrency(stats.monthly_total)}
            icon={DollarSign}
            trend={{ value: -12.5, isPositive: false }}
          />
          <StatsCard
            title="연 총 지출"
            value={formatCurrency(stats.yearly_total)}
            icon={TrendingUp}
            trend={{ value: 8.2, isPositive: true }}
          />
          <StatsCard
            title="총 절감액"
            value={formatCurrency(stats.total_savings)}
            icon={Target}
            variant="success"
            trend={{ value: 25.3, isPositive: true }}
          />
          <StatsCard
            title="주의 필요"
            value={stats.at_risk_count}
            icon={AlertTriangle}
            variant="warning"
          />
        </div>

        {/* 위험 알림 */}
        {riskSubscriptions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                주의가 필요한 구독
              </CardTitle>
              <CardDescription>
                즉시 조치가 필요한 구독 서비스들입니다
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {riskSubscriptions.map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <RiskBadge type={sub.type} />
                      <div>
                        <p className="font-medium">{sub.name}</p>
                        {sub.daysLeft && (
                          <p className="text-sm text-muted-foreground">
                            {sub.daysLeft}일 후 만료
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(sub.amount)}</p>
                      <Button size="sm" variant="outline">
                        조치하기
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* 메인 탭 */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">개요</TabsTrigger>
            <TabsTrigger value="subscriptions">구독 관리</TabsTrigger>
            <TabsTrigger value="alerts">알림</TabsTrigger>
            <TabsTrigger value="analytics">분석</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* 최근 절감 내역 */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">최근 절감 내역</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentSavings.map((saving) => (
                      <div key={saving.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{saving.action}</p>
                          <p className="text-xs text-muted-foreground">{saving.date}</p>
                        </div>
                        <p className="text-sm font-medium text-green-600">
                          +{formatCurrency(saving.amount)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <Button variant="ghost" className="w-full mt-4">
                    모든 절감 내역 보기
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>

              {/* 다가오는 결제 */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">다가오는 결제</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingBills.map((bill) => (
                      <div key={bill.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{bill.name}</p>
                          <p className="text-xs text-muted-foreground">{bill.date}</p>
                        </div>
                        <p className="text-sm font-medium">
                          {formatCurrency(bill.amount)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <Button variant="ghost" className="w-full mt-4">
                    전체 일정 보기
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="subscriptions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>구독 관리</CardTitle>
                <CardDescription>
                  현재 활성화된 구독 서비스를 관리하세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-32">
                  <div className="text-center">
                    <CreditCard className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">구독 관리 기능이 곧 추가됩니다</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>알림 센터</CardTitle>
                <CardDescription>
                  중요한 알림과 업데이트를 확인하세요
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-32">
                  <div className="text-center">
                    <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">알림 기능이 곧 추가됩니다</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>지출 분석</CardTitle>
                <CardDescription>
                  구독 지출 패턴과 절감 기회를 분석합니다
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-32">
                  <div className="text-center">
                    <TrendingUp className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">분석 기능이 곧 추가됩니다</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}