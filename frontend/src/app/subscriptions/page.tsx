'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AddSubscriptionModal } from '@/components/modals/add-subscription-modal';
import { 
  CreditCard, 
  Plus, 
  Search,
  Filter,
  MoreVertical,
  Play,
  Pause,
  Trash2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Subscription {
  id: string;
  name: string;
  amount: number;
  billing_cycle: 'monthly' | 'yearly';
  next_billing_date: string;
  status: 'active' | 'paused' | 'cancelled';
  category: string;
}

export default function SubscriptionsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const mockSubscriptions: Subscription[] = [
    {
      id: '1',
      name: 'Netflix Premium',
      amount: 15.99,
      billing_cycle: 'monthly',
      next_billing_date: '2024-12-18',
      status: 'active',
      category: 'Entertainment'
    },
    {
      id: '2',
      name: 'Spotify Premium',
      amount: 11.99,
      billing_cycle: 'monthly',
      next_billing_date: '2024-12-15',
      status: 'active',
      category: 'Music'
    },
    {
      id: '3',
      name: 'Adobe Creative Cloud',
      amount: 52.99,
      billing_cycle: 'monthly',
      next_billing_date: '2024-12-20',
      status: 'active',
      category: 'Productivity'
    },
    {
      id: '4',
      name: 'Disney+',
      amount: 89.99,
      billing_cycle: 'yearly',
      next_billing_date: '2025-03-15',
      status: 'paused',
      category: 'Entertainment'
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">활성</Badge>;
      case 'paused':
        return <Badge variant="secondary">일시정지</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">취소됨</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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
            <h2 className="text-3xl font-bold text-foreground">구독 관리</h2>
            <p className="text-muted-foreground mt-2">
              모든 구독 서비스를 한 곳에서 관리하세요
            </p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            구독 추가
          </Button>
        </div>

        {/* 필터 및 검색 */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="구독 서비스 검색..." 
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            필터
          </Button>
        </div>

        {/* 구독 목록 */}
        <div className="grid gap-4">
          {mockSubscriptions.map((subscription) => (
            <Card key={subscription.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{subscription.name}</h3>
                      <p className="text-sm text-muted-foreground">{subscription.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatCurrency(subscription.amount)}
                        <span className="text-sm text-muted-foreground ml-1">
                          /{subscription.billing_cycle === 'monthly' ? '월' : '년'}
                        </span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        다음 결제: {new Date(subscription.next_billing_date).toLocaleDateString('ko-KR')}
                      </p>
                    </div>

                    {getStatusBadge(subscription.status)}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Play className="mr-2 h-4 w-4" />
                          편집
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Pause className="mr-2 h-4 w-4" />
                          일시정지
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          삭제
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 요약 정보 */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">총 월 지출</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(mockSubscriptions.filter(s => s.billing_cycle === 'monthly' && s.status === 'active').reduce((sum, s) => sum + s.amount, 0))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">활성 구독</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockSubscriptions.filter(s => s.status === 'active').length}개
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">다음 결제</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Date('2024-12-15').toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 구독 추가 모달 */}
        <AddSubscriptionModal 
          open={isAddModalOpen} 
          onOpenChange={setIsAddModalOpen} 
        />
      </div>
    </AppLayout>
  );
}
