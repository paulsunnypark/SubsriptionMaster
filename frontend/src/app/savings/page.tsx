'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatsCard } from '@/components/ui/stats-card';
import { AddSavingsGoalModal } from '@/components/modals/add-savings-goal-modal';
import { 
  Target, 
  TrendingUp, 
  PiggyBank,
  Calendar,
  DollarSign,
  Award,
  ArrowRight,
  Plus
} from 'lucide-react';

interface SavingGoal {
  id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
  status: 'active' | 'completed' | 'paused';
}

interface SavingRecord {
  id: string;
  action: string;
  amount: number;
  date: string;
  subscription_name: string;
  type: 'cancellation' | 'downgrade' | 'promotion' | 'duplicate_removal';
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  earned_date: string;
  badge_color: string;
}

export default function SavingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  
  const [totalSavings] = useState(245.50);
  const [monthlySavings] = useState(45.99);
  const [savingsGoal] = useState(500);

  const mockGoals: SavingGoal[] = [
    {
      id: '1',
      title: '연간 절감 목표',
      target_amount: 500,
      current_amount: 245.50,
      deadline: '2024-12-31',
      status: 'active'
    },
    {
      id: '2',
      title: '엔터테인먼트 구독 정리',
      target_amount: 100,
      current_amount: 85.50,
      deadline: '2024-12-15',
      status: 'active'
    },
    {
      id: '3',
      title: '생산성 도구 최적화',
      target_amount: 200,
      current_amount: 200,
      deadline: '2024-11-30',
      status: 'completed'
    }
  ];

  const mockSavings: SavingRecord[] = [
    {
      id: '1',
      action: 'YouTube Premium 구독 취소',
      amount: 11.99,
      date: '2024-12-10',
      subscription_name: 'YouTube Premium',
      type: 'cancellation'
    },
    {
      id: '2',
      action: 'Disney+ 연간 플랜으로 변경',
      amount: 24.00,
      date: '2024-12-08',
      subscription_name: 'Disney+',
      type: 'promotion'
    },
    {
      id: '3',
      action: 'Dropbox Plus → Basic 다운그레이드',
      amount: 9.99,
      date: '2024-12-05',
      subscription_name: 'Dropbox',
      type: 'downgrade'
    },
    {
      id: '4',
      action: '중복 Netflix 계정 제거',
      amount: 15.99,
      date: '2024-12-03',
      subscription_name: 'Netflix',
      type: 'duplicate_removal'
    }
  ];

  const mockAchievements: Achievement[] = [
    {
      id: '1',
      title: '첫 번째 절감',
      description: '첫 구독 취소로 절감 시작',
      earned_date: '2024-11-15',
      badge_color: 'blue'
    },
    {
      id: '2',
      title: '월 $50 절감',
      description: '한 달에 $50 이상 절감 달성',
      earned_date: '2024-11-28',
      badge_color: 'green'
    },
    {
      id: '3',
      title: '중복 탐지 마스터',
      description: '중복 구독 5개 이상 발견',
      earned_date: '2024-12-01',
      badge_color: 'yellow'
    }
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

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getActionTypeBadge = (type: string) => {
    switch (type) {
      case 'cancellation':
        return <Badge variant="destructive">취소</Badge>;
      case 'downgrade':
        return <Badge variant="secondary">다운그레이드</Badge>;
      case 'promotion':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">프로모션</Badge>;
      case 'duplicate_removal':
        return <Badge variant="outline">중복 제거</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
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
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">절감 분석</h2>
            <p className="text-muted-foreground mt-2">
              구독 절감 현황과 목표 달성 진행률을 확인하세요
            </p>
          </div>
          <Button onClick={() => setIsAddGoalModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            절감 목표 추가
          </Button>
        </div>

        {/* 주요 지표 */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="총 절감액"
            value={formatCurrency(totalSavings)}
            icon={PiggyBank}
            variant="success"
            trend={{ value: 25.3, isPositive: true }}
          />
          <StatsCard
            title="이번 달 절감"
            value={formatCurrency(monthlySavings)}
            icon={Calendar}
            trend={{ value: 15.2, isPositive: true }}
          />
          <StatsCard
            title="절감 목표"
            value={formatCurrency(savingsGoal)}
            icon={Target}
          />
          <StatsCard
            title="목표 달성률"
            value={`${Math.round(getProgressPercentage(totalSavings, savingsGoal))}%`}
            icon={TrendingUp}
            variant="success"
          />
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">개요</TabsTrigger>
            <TabsTrigger value="goals">절감 목표</TabsTrigger>
            <TabsTrigger value="history">절감 내역</TabsTrigger>
            <TabsTrigger value="achievements">성취</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* 목표 진행률 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    연간 절감 목표
                  </CardTitle>
                  <CardDescription>
                    올해 목표까지 {formatCurrency(savingsGoal - totalSavings)} 남았습니다
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>진행률</span>
                      <span>{Math.round(getProgressPercentage(totalSavings, savingsGoal))}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div 
                        className="bg-green-600 h-3 rounded-full transition-all"
                        style={{
                          width: `${getProgressPercentage(totalSavings, savingsGoal)}%`
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{formatCurrency(totalSavings)}</span>
                      <span>{formatCurrency(savingsGoal)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 최근 절감 내역 */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">최근 절감 내역</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockSavings.slice(0, 4).map((saving) => (
                      <div key={saving.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{saving.action}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(saving.date).toLocaleDateString('ko-KR')}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-green-600">
                          +{formatCurrency(saving.amount)}
                        </p>
                      </div>
                    ))}
                  </div>
                  <Button variant="ghost" className="w-full mt-4">
                    전체 내역 보기
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="goals" className="space-y-4">
            <div className="space-y-4">
              {mockGoals.map((goal) => (
                <Card key={goal.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">{goal.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          마감일: {new Date(goal.deadline).toLocaleDateString('ko-KR')}
                        </p>
                      </div>
                      <Badge variant={goal.status === 'completed' ? 'default' : 'secondary'}>
                        {goal.status === 'completed' ? '완료' : 
                         goal.status === 'active' ? '진행중' : '일시정지'}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>진행률</span>
                        <span>{Math.round(getProgressPercentage(goal.current_amount, goal.target_amount))}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            goal.status === 'completed' ? 'bg-green-600' : 'bg-blue-600'
                          }`}
                          style={{
                            width: `${getProgressPercentage(goal.current_amount, goal.target_amount)}%`
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{formatCurrency(goal.current_amount)}</span>
                        <span>{formatCurrency(goal.target_amount)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <div className="space-y-4">
              {mockSavings.map((saving) => (
                <Card key={saving.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <DollarSign className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{saving.action}</h3>
                          <p className="text-sm text-muted-foreground">{saving.subscription_name}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="font-semibold text-green-600">
                            +{formatCurrency(saving.amount)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(saving.date).toLocaleDateString('ko-KR')}
                          </p>
                        </div>
                        {getActionTypeBadge(saving.type)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {mockAchievements.map((achievement) => (
                <Card key={achievement.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-${achievement.badge_color}-100`}>
                        <Award className={`h-6 w-6 text-${achievement.badge_color}-600`} />
                      </div>
                      <div>
                        <h3 className="font-semibold">{achievement.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {achievement.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(achievement.earned_date).toLocaleDateString('ko-KR')} 달성
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* 절감 목표 추가 모달 */}
        <AddSavingsGoalModal 
          open={isAddGoalModalOpen} 
          onOpenChange={setIsAddGoalModalOpen} 
        />
      </div>
    </AppLayout>
  );
}
