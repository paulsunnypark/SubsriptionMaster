'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Bell, 
  Shield,
  CreditCard,
  Download,
  Trash2,
  Save,
  Key,
  Globe,
  Smartphone
} from 'lucide-react';
import { toast } from 'sonner';

interface NotificationSettings {
  email_alerts: boolean;
  push_notifications: boolean;
  trial_ending: boolean;
  price_increases: boolean;
  new_subscriptions: boolean;
  weekly_summary: boolean;
}

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    timezone: 'Asia/Seoul',
    currency: 'KRW'
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    email_alerts: true,
    push_notifications: true,
    trial_ending: true,
    price_increases: true,
    new_subscriptions: false,
    weekly_summary: true
  });

  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        timezone: 'Asia/Seoul',
        currency: 'KRW'
      });
    }
  }, [user]);

  const handleProfileSave = () => {
    // API 호출하여 프로필 업데이트
    toast.success('프로필이 성공적으로 업데이트되었습니다.');
  };

  const handlePasswordChange = () => {
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast.error('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    // API 호출하여 비밀번호 변경
    toast.success('비밀번호가 성공적으로 변경되었습니다.');
    setPasswordForm({
      current_password: '',
      new_password: '',
      confirm_password: ''
    });
  };

  const handleNotificationChange = (key: keyof NotificationSettings, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }));
    // API 호출하여 알림 설정 업데이트
    toast.success('알림 설정이 업데이트되었습니다.');
  };

  const handleExportData = () => {
    toast.success('데이터 내보내기가 시작되었습니다. 이메일로 다운로드 링크를 발송해드립니다.');
  };

  const handleDeleteAccount = () => {
    // 확인 다이얼로그 후 계정 삭제
    if (confirm('정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      toast.error('계정이 삭제되었습니다.');
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
        <div>
          <h2 className="text-3xl font-bold text-foreground">설정</h2>
          <p className="text-muted-foreground mt-2">
            계정 정보, 알림 설정, 보안 등을 관리하세요
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">프로필</TabsTrigger>
            <TabsTrigger value="notifications">알림</TabsTrigger>
            <TabsTrigger value="security">보안</TabsTrigger>
            <TabsTrigger value="data">데이터</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  프로필 정보
                </CardTitle>
                <CardDescription>
                  기본 계정 정보를 수정할 수 있습니다
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">이름</Label>
                    <Input
                      id="name"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">이메일</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">시간대</Label>
                    <select 
                      id="timezone"
                      className="w-full px-3 py-2 border border-input bg-background rounded-md"
                      value={profileForm.timezone}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, timezone: e.target.value }))}
                    >
                      <option value="Asia/Seoul">Asia/Seoul (UTC+9)</option>
                      <option value="America/New_York">America/New_York (UTC-5)</option>
                      <option value="Europe/London">Europe/London (UTC+0)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency">통화</Label>
                    <select 
                      id="currency"
                      className="w-full px-3 py-2 border border-input bg-background rounded-md"
                      value={profileForm.currency}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, currency: e.target.value }))}
                    >
                      <option value="KRW">Korean Won (₩)</option>
                      <option value="USD">US Dollar ($)</option>
                      <option value="EUR">Euro (€)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleProfileSave}>
                    <Save className="mr-2 h-4 w-4" />
                    저장
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  알림 설정
                </CardTitle>
                <CardDescription>
                  받고 싶은 알림 유형을 선택하세요
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>이메일 알림</Label>
                      <p className="text-sm text-muted-foreground">
                        중요한 알림을 이메일로 받습니다
                      </p>
                    </div>
                    <Switch
                      checked={notifications.email_alerts}
                      onCheckedChange={(checked) => handleNotificationChange('email_alerts', checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>푸시 알림</Label>
                      <p className="text-sm text-muted-foreground">
                        브라우저 푸시 알림을 받습니다
                      </p>
                    </div>
                    <Switch
                      checked={notifications.push_notifications}
                      onCheckedChange={(checked) => handleNotificationChange('push_notifications', checked)}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <Label>알림 유형</Label>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-sm">체험판 만료 알림</Label>
                          <p className="text-xs text-muted-foreground">
                            체험판이 곧 만료될 때 알림
                          </p>
                        </div>
                        <Switch
                          checked={notifications.trial_ending}
                          onCheckedChange={(checked) => handleNotificationChange('trial_ending', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-sm">가격 인상 알림</Label>
                          <p className="text-xs text-muted-foreground">
                            구독 서비스 가격이 인상될 때 알림
                          </p>
                        </div>
                        <Switch
                          checked={notifications.price_increases}
                          onCheckedChange={(checked) => handleNotificationChange('price_increases', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-sm">새 구독 감지</Label>
                          <p className="text-xs text-muted-foreground">
                            새로운 구독이 감지될 때 알림
                          </p>
                        </div>
                        <Switch
                          checked={notifications.new_subscriptions}
                          onCheckedChange={(checked) => handleNotificationChange('new_subscriptions', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-sm">주간 요약</Label>
                          <p className="text-xs text-muted-foreground">
                            주간 구독 요약 리포트
                          </p>
                        </div>
                        <Switch
                          checked={notifications.weekly_summary}
                          onCheckedChange={(checked) => handleNotificationChange('weekly_summary', checked)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  보안 설정
                </CardTitle>
                <CardDescription>
                  계정 보안을 강화하세요
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>비밀번호 변경</Label>
                  
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">현재 비밀번호</Label>
                      <Input
                        id="current-password"
                        type="password"
                        value={passwordForm.current_password}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, current_password: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-password">새 비밀번호</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={passwordForm.new_password}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, new_password: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">새 비밀번호 확인</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={passwordForm.confirm_password}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, confirm_password: e.target.value }))}
                      />
                    </div>

                    <Button onClick={handlePasswordChange}>
                      <Key className="mr-2 h-4 w-4" />
                      비밀번호 변경
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>활성 세션</Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Globe className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Chrome - macOS</p>
                          <p className="text-xs text-muted-foreground">
                            현재 세션 • Seoul, Korea
                          </p>
                        </div>
                      </div>
                      <Badge variant="default">현재</Badge>
                    </div>

                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Smartphone className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Safari - iOS</p>
                          <p className="text-xs text-muted-foreground">
                            2일 전 • Seoul, Korea
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        로그아웃
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  데이터 관리
                </CardTitle>
                <CardDescription>
                  데이터를 내보내거나 계정을 삭제할 수 있습니다
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">데이터 내보내기</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      모든 구독 데이터, 거래 내역, 설정을 JSON 형식으로 다운로드할 수 있습니다.
                    </p>
                    <Button variant="outline" onClick={handleExportData}>
                      <Download className="mr-2 h-4 w-4" />
                      데이터 내보내기
                    </Button>
                  </div>

                  <Separator />

                  <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <h3 className="font-medium mb-2 text-red-900">계정 삭제</h3>
                    <p className="text-sm text-red-700 mb-4">
                      계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
                    </p>
                    <Button variant="destructive" onClick={handleDeleteAccount}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      계정 삭제
                    </Button>
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
