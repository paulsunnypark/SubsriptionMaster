import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/ui/stats-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  PiggyBank, 
  TrendingUp, 
  Target, 
  Calendar,
  Plus,
  DollarSign,
  Award,
  CheckCircle,
  Clock,
  ArrowUpRight
} from 'lucide-react';

interface SavingGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  status: 'active' | 'completed' | 'paused';
}

interface SavingRecord {
  id: string;
  type: 'cancel' | 'downgrade' | 'yearly_switch' | 'coupon';
  amount: number;
  service: string;
  date: string;
  description: string;
}

const Savings = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  
  // Mock data
  const totalSavings = 127500;
  const monthlyTarget = 100000;
  const activeSavingsCount = 8;
  const completedGoalsCount = 3;

  const savingGoals: SavingGoal[] = [
    {
      id: '1',
      title: '연간 구독료 절약 목표',
      targetAmount: 1200000,
      currentAmount: 720000,
      deadline: '2024-12-31',
      status: 'active'
    },
    {
      id: '2',
      title: '스트리밍 서비스 정리',
      targetAmount: 500000,
      currentAmount: 500000,
      deadline: '2024-06-30',
      status: 'completed'
    },
    {
      id: '3',
      title: '중복 구독 제거',
      targetAmount: 300000,
      currentAmount: 180000,
      deadline: '2024-09-30',
      status: 'active'
    }
  ];

  const savingRecords: SavingRecord[] = [
    {
      id: '1',
      type: 'cancel',
      amount: 15000,
      service: 'Adobe Creative Cloud',
      date: '2024-01-20',
      description: '사용하지 않는 구독 해지'
    },
    {
      id: '2',
      type: 'yearly_switch',
      amount: 24000,
      service: 'Spotify Premium',
      date: '2024-01-15',
      description: '월간 → 연간 구독으로 전환'
    },
    {
      id: '3',
      type: 'downgrade',
      amount: 8000,
      service: 'Netflix',
      date: '2024-01-10',
      description: 'Premium → Standard 플랜으로 변경'
    },
    {
      id: '4',
      type: 'coupon',
      amount: 12000,
      service: 'Microsoft 365',
      date: '2024-01-05',
      description: '할인 쿠폰 적용'
    }
  ];

  const getSavingTypeInfo = (type: SavingRecord['type']) => {
    switch (type) {
      case 'cancel':
        return { label: '구독 해지', color: 'destructive' as const };
      case 'downgrade':
        return { label: '다운그레이드', color: 'secondary' as const };
      case 'yearly_switch':
        return { label: '연간 전환', color: 'default' as const };
      case 'coupon':
        return { label: '쿠폰 적용', color: 'default' as const };
    }
  };

  const formatCurrency = (amount: number) => {
    return `₩${amount.toLocaleString()}`;
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold gradient-text">절약 관리</h1>
        <p className="text-muted-foreground">구독료 절약 목표를 설정하고 달성률을 추적하세요</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="총 절약액"
          value={formatCurrency(totalSavings)}
          icon={PiggyBank}
          trend={{ value: 15, isPositive: true }}
        />
        <StatsCard
          title="월간 목표"
          value={formatCurrency(monthlyTarget)}
          icon={Target}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="활성 절약"
          value={activeSavingsCount.toString()}
          icon={TrendingUp}
        />
        <StatsCard
          title="달성한 목표"
          value={completedGoalsCount.toString()}
          icon={Award}
        />
      </div>

      <Tabs defaultValue="goals" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="goals">절약 목표</TabsTrigger>
          <TabsTrigger value="records">절약 내역</TabsTrigger>
          <TabsTrigger value="analytics">분석</TabsTrigger>
        </TabsList>

        {/* 절약 목표 탭 */}
        <TabsContent value="goals" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">절약 목표</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              새 목표 추가
            </Button>
          </div>

          <div className="grid gap-4">
            {savingGoals.map((goal) => (
              <Card key={goal.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{goal.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Calendar className="h-4 w-4" />
                        목표일: {new Date(goal.deadline).toLocaleDateString('ko-KR')}
                      </CardDescription>
                    </div>
                    <Badge 
                      variant={goal.status === 'completed' ? 'default' : goal.status === 'active' ? 'secondary' : 'outline'}
                    >
                      {goal.status === 'completed' ? '완료' : goal.status === 'active' ? '진행중' : '일시정지'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>달성률</span>
                      <span className="font-medium">
                        {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                      </span>
                    </div>
                    <Progress 
                      value={getProgressPercentage(goal.currentAmount, goal.targetAmount)} 
                      className="h-2"
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {getProgressPercentage(goal.currentAmount, goal.targetAmount).toFixed(0)}% 달성
                      </span>
                      {goal.status === 'completed' && (
                        <div className="flex items-center text-green-600 text-sm">
                          <CheckCircle className="mr-1 h-4 w-4" />
                          목표 달성!
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 절약 내역 탭 */}
        <TabsContent value="records" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">절약 내역</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">필터</Button>
              <Button variant="outline" size="sm">내보내기</Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {savingRecords.map((record) => {
                  const typeInfo = getSavingTypeInfo(record.type);
                  return (
                    <div key={record.id} className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{record.service}</h3>
                            <Badge variant={typeInfo.color} className="text-xs">
                              {typeInfo.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{record.description}</p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {new Date(record.date).toLocaleDateString('ko-KR')}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center text-green-600 font-semibold">
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                            +{formatCurrency(record.amount)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 분석 탭 */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">절약 분석</h2>
            <div className="flex gap-2">
              <Button 
                variant={selectedPeriod === 'monthly' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setSelectedPeriod('monthly')}
              >
                월간
              </Button>
              <Button 
                variant={selectedPeriod === 'yearly' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setSelectedPeriod('yearly')}
              >
                연간
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">카테고리별 절약</CardTitle>
                <CardDescription>구독 유형별 절약 현황</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">스트리밍 서비스</span>
                    <span className="font-medium">{formatCurrency(45000)}</span>
                  </div>
                  <Progress value={65} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">소프트웨어</span>
                    <span className="font-medium">{formatCurrency(32000)}</span>
                  </div>
                  <Progress value={45} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">피트니스</span>
                    <span className="font-medium">{formatCurrency(18000)}</span>
                  </div>
                  <Progress value={25} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">절약 방법별 효과</CardTitle>
                <CardDescription>어떤 방법이 가장 효과적인가요?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">구독 해지</span>
                    <span className="font-medium">{formatCurrency(52000)}</span>
                  </div>
                  <Progress value={75} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">연간 전환</span>
                    <span className="font-medium">{formatCurrency(38000)}</span>
                  </div>
                  <Progress value={55} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">플랜 다운그레이드</span>
                    <span className="font-medium">{formatCurrency(25000)}</span>
                  </div>
                  <Progress value={35} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">절약 추세</CardTitle>
              <CardDescription>월별 절약 성과</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>차트가 여기에 표시됩니다</p>
                <p className="text-sm">(Recharts 라이브러리를 사용하여 구현 예정)</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Savings;