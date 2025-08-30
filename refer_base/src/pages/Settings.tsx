import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/components/theme-provider';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  CreditCard,
  Mail,
  Smartphone,
  Eye,
  EyeOff,
  Save,
  Trash2,
  Download,
  Upload,
  AlertTriangle
} from 'lucide-react';

const Settings = () => {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  
  // Profile settings state
  const [profile, setProfile] = useState({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: '',
    timezone: 'Asia/Seoul',
    language: 'ko'
  });

  // Notification settings state
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    trialExpiry: true,
    priceIncrease: true,
    duplicateSubscriptions: true,
    weeklyReport: false,
    monthlyReport: true
  });

  // Privacy settings state
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'private',
    dataSharing: false,
    analyticsTracking: true,
    marketingEmails: false
  });

  const handleProfileUpdate = () => {
    // Handle profile update logic here
    console.log('Profile updated:', profile);
  };

  const handleNotificationUpdate = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handlePrivacyUpdate = (key: string, value: boolean | string) => {
    setPrivacy(prev => ({ ...prev, [key]: value }));
  };

  const handleExportData = () => {
    // Handle data export logic
    console.log('Exporting user data...');
  };

  const handleDeleteAccount = () => {
    // Handle account deletion logic
    console.log('Account deletion requested...');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold gradient-text">설정</h1>
        <p className="text-muted-foreground">계정 및 앱 설정을 관리하세요</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">프로필</TabsTrigger>
          <TabsTrigger value="notifications">알림</TabsTrigger>
          <TabsTrigger value="appearance">테마</TabsTrigger>
          <TabsTrigger value="privacy">개인정보</TabsTrigger>
          <TabsTrigger value="account">계정</TabsTrigger>
        </TabsList>

        {/* 프로필 설정 */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                기본 정보
              </CardTitle>
              <CardDescription>
                프로필 정보를 업데이트하세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">이름</Label>
                  <Input
                    id="fullName"
                    value={profile.fullName}
                    onChange={(e) => setProfile(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="홍길동"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">이메일은 변경할 수 없습니다</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">전화번호</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="010-1234-5678"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">시간대</Label>
                  <Select 
                    value={profile.timezone} 
                    onValueChange={(value) => setProfile(prev => ({ ...prev, timezone: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Seoul">서울 (GMT+9)</SelectItem>
                      <SelectItem value="America/New_York">뉴욕 (GMT-5)</SelectItem>
                      <SelectItem value="Europe/London">런던 (GMT+0)</SelectItem>
                      <SelectItem value="Asia/Tokyo">도쿄 (GMT+9)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">언어</Label>
                <Select 
                  value={profile.language} 
                  onValueChange={(value) => setProfile(prev => ({ ...prev, language: value }))}
                >
                  <SelectTrigger className="w-full md:w-1/2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ko">한국어</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleProfileUpdate} className="w-full md:w-auto">
                <Save className="mr-2 h-4 w-4" />
                변경사항 저장
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 알림 설정 */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                알림 설정
              </CardTitle>
              <CardDescription>
                받고 싶은 알림을 선택하세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">알림 채널</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>이메일 알림</Label>
                      <p className="text-sm text-muted-foreground">이메일로 알림을 받습니다</p>
                    </div>
                    <Switch
                      checked={notifications.emailNotifications}
                      onCheckedChange={(checked) => handleNotificationUpdate('emailNotifications', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>푸시 알림</Label>
                      <p className="text-sm text-muted-foreground">브라우저 푸시 알림을 받습니다</p>
                    </div>
                    <Switch
                      checked={notifications.pushNotifications}
                      onCheckedChange={(checked) => handleNotificationUpdate('pushNotifications', checked)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">구독 관련 알림</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>체험판 만료 알림</Label>
                      <p className="text-sm text-muted-foreground">무료 체험이 곧 끝날 때 알림</p>
                    </div>
                    <Switch
                      checked={notifications.trialExpiry}
                      onCheckedChange={(checked) => handleNotificationUpdate('trialExpiry', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>가격 인상 알림</Label>
                      <p className="text-sm text-muted-foreground">구독료가 인상될 때 알림</p>
                    </div>
                    <Switch
                      checked={notifications.priceIncrease}
                      onCheckedChange={(checked) => handleNotificationUpdate('priceIncrease', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>중복 구독 알림</Label>
                      <p className="text-sm text-muted-foreground">중복된 구독을 발견했을 때 알림</p>
                    </div>
                    <Switch
                      checked={notifications.duplicateSubscriptions}
                      onCheckedChange={(checked) => handleNotificationUpdate('duplicateSubscriptions', checked)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">리포트 알림</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>주간 리포트</Label>
                      <p className="text-sm text-muted-foreground">매주 구독 현황을 요약해서 보내드립니다</p>
                    </div>
                    <Switch
                      checked={notifications.weeklyReport}
                      onCheckedChange={(checked) => handleNotificationUpdate('weeklyReport', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>월간 리포트</Label>
                      <p className="text-sm text-muted-foreground">매월 구독 분석 리포트를 보내드립니다</p>
                    </div>
                    <Switch
                      checked={notifications.monthlyReport}
                      onCheckedChange={(checked) => handleNotificationUpdate('monthlyReport', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 테마 설정 */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                테마 설정
              </CardTitle>
              <CardDescription>
                앱의 모양과 느낌을 설정하세요
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>테마 선택</Label>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    onClick={() => setTheme('light')}
                    className="h-20 flex-col gap-2"
                  >
                    <div className="w-6 h-6 rounded bg-white border border-gray-300"></div>
                    라이트
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    onClick={() => setTheme('dark')}
                    className="h-20 flex-col gap-2"
                  >
                    <div className="w-6 h-6 rounded bg-gray-800 border border-gray-600"></div>
                    다크
                  </Button>
                  <Button
                    variant={theme === 'system' ? 'default' : 'outline'}
                    onClick={() => setTheme('system')}
                    className="h-20 flex-col gap-2"
                  >
                    <div className="w-6 h-6 rounded bg-gradient-to-r from-white to-gray-800 border border-gray-400"></div>
                    시스템
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                현재 테마: <Badge variant="secondary">{theme === 'light' ? '라이트' : theme === 'dark' ? '다크' : '시스템'}</Badge>
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 개인정보 설정 */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                개인정보 보호
              </CardTitle>
              <CardDescription>
                데이터 처리 및 개인정보 보호 설정
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>프로필 공개 설정</Label>
                    <p className="text-sm text-muted-foreground">다른 사용자에게 프로필을 공개할 범위</p>
                  </div>
                  <Select 
                    value={privacy.profileVisibility} 
                    onValueChange={(value) => handlePrivacyUpdate('profileVisibility', value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">비공개</SelectItem>
                      <SelectItem value="friends">친구만</SelectItem>
                      <SelectItem value="public">전체공개</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>데이터 공유</Label>
                    <p className="text-sm text-muted-foreground">서비스 개선을 위한 익명 데이터 공유</p>
                  </div>
                  <Switch
                    checked={privacy.dataSharing}
                    onCheckedChange={(checked) => handlePrivacyUpdate('dataSharing', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>분석 추적</Label>
                    <p className="text-sm text-muted-foreground">사용 패턴 분석을 위한 추적 허용</p>
                  </div>
                  <Switch
                    checked={privacy.analyticsTracking}
                    onCheckedChange={(checked) => handlePrivacyUpdate('analyticsTracking', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>마케팅 이메일</Label>
                    <p className="text-sm text-muted-foreground">제품 업데이트 및 프로모션 이메일 수신</p>
                  </div>
                  <Switch
                    checked={privacy.marketingEmails}
                    onCheckedChange={(checked) => handlePrivacyUpdate('marketingEmails', checked)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">데이터 관리</h3>
                <div className="space-y-3">
                  <Button onClick={handleExportData} variant="outline" className="w-full justify-start">
                    <Download className="mr-2 h-4 w-4" />
                    내 데이터 내보내기
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    계정과 관련된 모든 데이터를 JSON 형식으로 다운로드합니다.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 계정 관리 */}
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                계정 관리
              </CardTitle>
              <CardDescription>
                계정 보안 및 관리 설정
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium">비밀번호 변경</h4>
                    <p className="text-sm text-muted-foreground">보안을 위해 정기적으로 비밀번호를 변경하세요</p>
                  </div>
                  <Button variant="outline">
                    변경
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium">2단계 인증</h4>
                    <p className="text-sm text-muted-foreground">추가 보안을 위한 2단계 인증 설정</p>
                  </div>
                  <Badge variant="outline">비활성화</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium">활성 세션</h4>
                    <p className="text-sm text-muted-foreground">현재 로그인된 디바이스 관리</p>
                  </div>
                  <Button variant="outline">
                    관리
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium text-destructive flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  위험 구역
                </h3>
                <div className="space-y-3 p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                  <div className="space-y-2">
                    <h4 className="font-medium">계정 삭제</h4>
                    <p className="text-sm text-muted-foreground">
                      계정을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
                    </p>
                  </div>
                  <Button onClick={handleDeleteAccount} variant="destructive" size="sm">
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
  );
};

export default Settings;