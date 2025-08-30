import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { seedTestUsers } from '@/utils/seed-users';
import { useToast } from '@/hooks/use-toast';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSeedingUsers, setIsSeedingUsers] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { signUp, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!fullName.trim()) {
      newErrors.fullName = '이름을 입력해주세요.';
    }

    if (!email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }

    if (!password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (password.length < 6) {
      newErrors.password = '비밀번호는 최소 6자 이상이어야 합니다.';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    const { error } = await signUp(email, password, fullName);
    
    if (!error) {
      // 회원가입 성공 시 로그인 페이지로 리다이렉트
      navigate('/login');
    }
    
    setIsLoading(false);
  };

  const handleSeedTestUsers = async () => {
    setIsSeedingUsers(true);
    
    try {
      const results = await seedTestUsers();
      const successCount = results.filter(r => r.success).length;
      const failCount = results.filter(r => !r.success).length;
      
      if (successCount > 0) {
        toast({
          title: "테스트 계정 생성 완료",
          description: `${successCount}개 계정이 생성되었습니다. 이메일 확인 후 로그인하세요.`,
        });
      }
      
      if (failCount > 0) {
        toast({
          title: "일부 계정 생성 실패",
          description: `${failCount}개 계정 생성에 실패했습니다. 콘솔을 확인하세요.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "오류",
        description: "테스트 계정 생성 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
    
    setIsSeedingUsers(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold gradient-text">회원가입</CardTitle>
          <CardDescription>
            구독 관리를 시작해보세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">이름</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="홍길동"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isLoading}
                className={errors.fullName ? 'border-destructive' : ''}
              />
              {errors.fullName && (
                <p className="text-sm text-destructive">{errors.fullName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className={errors.password ? 'border-destructive' : ''}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">비밀번호 확인</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                className={errors.confirmPassword ? 'border-destructive' : ''}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword}</p>
              )}
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  회원가입 중...
                </>
              ) : (
                '회원가입'
              )}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">이미 계정이 있으신가요? </span>
            <Link
              to="/login"
              className="font-medium text-primary hover:underline"
            >
              로그인
            </Link>
          </div>
          
          {/* Test Users Seed Button - Development Only */}
          <div className="mt-4 pt-4 border-t border-border">
            <Button 
              type="button"
              variant="outline" 
              className="w-full text-sm" 
              onClick={handleSeedTestUsers}
              disabled={isSeedingUsers}
            >
              {isSeedingUsers ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  테스트 계정 생성 중...
                </>
              ) : (
                '테스트 계정 생성 (admin@testmail.com, test@testmail.com)'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;