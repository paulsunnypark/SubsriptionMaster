'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  AlertTriangle, 
  Clock,
  DollarSign,
  X,
  Settings,
  TrendingUp
} from 'lucide-react';

interface Alert {
  id: string;
  type: 'trial_ending' | 'price_increase' | 'duplicate' | 'unused' | 'ghost';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  created_at: string;
  is_read: boolean;
  subscription_name: string;
  amount?: number;
}

export default function AlertsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const mockAlerts: Alert[] = [
    {
      id: '1',
      type: 'trial_ending',
      title: '체험판 만료 임박',
      description: 'Netflix Premium 체험판이 3일 후 만료됩니다',
      severity: 'high',
      created_at: '2024-12-10',
      is_read: false,
      subscription_name: 'Netflix Premium',
      amount: 15.99
    },
    {
      id: '2',
      type: 'price_increase',
      title: '가격 인상 알림',
      description: 'Spotify Premium이 다음 달부터 월 2,000원 인상됩니다',
      severity: 'medium',
      created_at: '2024-12-09',
      is_read: false,
      subscription_name: 'Spotify Premium',
      amount: 11.99
    },
    {
      id: '3',
      type: 'duplicate',
      title: '중복 구독 감지',
      description: 'YouTube Premium과 YouTube Music 구독이 중복됩니다',
      severity: 'medium',
      created_at: '2024-12-08',
      is_read: true,
      subscription_name: 'YouTube Premium'
    },
    {
      id: '4',
      type: 'unused',
      title: '미사용 구독',
      description: 'Adobe Creative Cloud를 지난 30일간 사용하지 않았습니다',
      severity: 'low',
      created_at: '2024-12-07',
      is_read: true,
      subscription_name: 'Adobe Creative Cloud',
      amount: 52.99
    }
  ];

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge variant="destructive">긴급</Badge>;
      case 'medium':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">주의</Badge>;
      case 'low':
        return <Badge variant="outline">정보</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'trial_ending':
        return <Clock className="h-5 w-5 text-orange-600" />;
      case 'price_increase':
        return <TrendingUp className="h-5 w-5 text-red-600" />;
      case 'duplicate':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'unused':
        return <Bell className="h-5 w-5 text-blue-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(amount);
  };

  const unreadCount = mockAlerts.filter(alert => !alert.is_read).length;
  const highPriorityCount = mockAlerts.filter(alert => alert.severity === 'high').length;

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
            <h2 className="text-3xl font-bold text-foreground">알림 센터</h2>
            <p className="text-muted-foreground mt-2">
              구독 관련 중요한 알림과 업데이트를 확인하세요
            </p>
          </div>
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            알림 설정
          </Button>
        </div>

        {/* 요약 카드 */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">읽지 않은 알림</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{unreadCount}개</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">긴급 알림</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{highPriorityCount}개</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">총 알림</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockAlerts.length}개</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">전체 알림</TabsTrigger>
            <TabsTrigger value="unread">읽지 않음</TabsTrigger>
            <TabsTrigger value="high">긴급</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="space-y-4">
              {mockAlerts.map((alert) => (
                <Card key={alert.id} className={`${!alert.is_read ? 'border-primary/50 bg-primary/5' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        {getAlertIcon(alert.type)}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold">{alert.title}</h3>
                            {getSeverityBadge(alert.severity)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {alert.description}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>{alert.subscription_name}</span>
                            <span>•</span>
                            <span>{new Date(alert.created_at).toLocaleDateString('ko-KR')}</span>
                            {alert.amount && (
                              <>
                                <span>•</span>
                                <span>{formatCurrency(alert.amount)}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          조치하기
                        </Button>
                        <Button variant="ghost" size="sm">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="unread" className="space-y-4">
            <div className="space-y-4">
              {mockAlerts.filter(alert => !alert.is_read).map((alert) => (
                <Card key={alert.id} className="border-primary/50 bg-primary/5">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        {getAlertIcon(alert.type)}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold">{alert.title}</h3>
                            {getSeverityBadge(alert.severity)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {alert.description}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>{alert.subscription_name}</span>
                            <span>•</span>
                            <span>{new Date(alert.created_at).toLocaleDateString('ko-KR')}</span>
                            {alert.amount && (
                              <>
                                <span>•</span>
                                <span>{formatCurrency(alert.amount)}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          조치하기
                        </Button>
                        <Button variant="ghost" size="sm">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="high" className="space-y-4">
            <div className="space-y-4">
              {mockAlerts.filter(alert => alert.severity === 'high').map((alert) => (
                <Card key={alert.id} className="border-red-200 bg-red-50">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        {getAlertIcon(alert.type)}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold">{alert.title}</h3>
                            {getSeverityBadge(alert.severity)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {alert.description}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>{alert.subscription_name}</span>
                            <span>•</span>
                            <span>{new Date(alert.created_at).toLocaleDateString('ko-KR')}</span>
                            {alert.amount && (
                              <>
                                <span>•</span>
                                <span>{formatCurrency(alert.amount)}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button size="sm">
                          즉시 조치
                        </Button>
                        <Button variant="ghost" size="sm">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
