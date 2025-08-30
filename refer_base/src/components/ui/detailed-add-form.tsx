import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Building2, 
  CreditCard, 
  Calendar, 
  DollarSign, 
  Users, 
  Tag,
  Save,
  X
} from 'lucide-react';

interface DetailedAddFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function DetailedAddForm({ onSuccess, onCancel }: DetailedAddFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    merchantName: '',
    planName: '',
    billingCycle: 'monthly' as 'monthly' | 'yearly' | 'trial',
    amount: '',
    currency: 'KRW',
    nextBilling: '',
    seats: '1',
    paymentMethod: '',
    category: '',
    website: '',
    cancelUrl: '',
    notes: ''
  });

  const availableTags = ['업무용', '개인용', '팀 공유', '필수', '선택적', '시험 중'];

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: API 호출로 구독 생성
      const subscriptionData = {
        ...formData,
        tags: selectedTags,
        amount: parseInt(formData.amount)
      };
      
      await new Promise(resolve => setTimeout(resolve, 1500)); // Mock API call
      
      toast({
        title: "구독이 추가되었습니다",
        description: `${formData.merchantName}이 성공적으로 등록되었습니다.`
      });
      
      onSuccess();
    } catch (error) {
      toast({
        title: "오류가 발생했습니다",
        description: "구독 추가 중 문제가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          상세 구독 등록
        </CardTitle>
        <CardDescription>
          모든 구독 정보를 자세히 입력하세요
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 기본 정보 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">기본 정보</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="merchant-name">서비스명 *</Label>
                <Input
                  id="merchant-name"
                  placeholder="Netflix, Spotify, Adobe..."
                  value={formData.merchantName}
                  onChange={(e) => setFormData(prev => ({ ...prev, merchantName: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="plan-name">플랜명</Label>
                <Input
                  id="plan-name"
                  placeholder="Premium, Pro, Enterprise..."
                  value={formData.planName}
                  onChange={(e) => setFormData(prev => ({ ...prev, planName: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">카테고리</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="streaming">스트리밍</SelectItem>
                    <SelectItem value="software">소프트웨어</SelectItem>
                    <SelectItem value="fitness">피트니스</SelectItem>
                    <SelectItem value="education">교육</SelectItem>
                    <SelectItem value="news">뉴스</SelectItem>
                    <SelectItem value="gaming">게임</SelectItem>
                    <SelectItem value="cloud">클라우드</SelectItem>
                    <SelectItem value="communication">통신</SelectItem>
                    <SelectItem value="other">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">웹사이트</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://example.com"
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* 결제 정보 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              결제 정보
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">결제 금액 *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="amount"
                    type="number"
                    placeholder="17000"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    className="pl-10"
                    inputMode="numeric"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">통화</Label>
                <Select 
                  value={formData.currency} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="KRW">KRW (원)</SelectItem>
                    <SelectItem value="USD">USD (달러)</SelectItem>
                    <SelectItem value="EUR">EUR (유로)</SelectItem>
                    <SelectItem value="JPY">JPY (엔)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="billing-cycle">결제 주기 *</Label>
                <Select 
                  value={formData.billingCycle} 
                  onValueChange={(value: 'monthly' | 'yearly' | 'trial') => 
                    setFormData(prev => ({ ...prev, billingCycle: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">월간 결제</SelectItem>
                    <SelectItem value="yearly">연간 결제</SelectItem>
                    <SelectItem value="trial">무료 체험</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="next-billing">다음 결제일</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="next-billing"
                    type="date"
                    value={formData.nextBilling}
                    onChange={(e) => setFormData(prev => ({ ...prev, nextBilling: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="seats">좌석/사용자 수</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="seats"
                    type="number"
                    min="1"
                    value={formData.seats}
                    onChange={(e) => setFormData(prev => ({ ...prev, seats: e.target.value }))}
                    className="pl-10"
                    inputMode="numeric"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment-method">결제 수단</Label>
                <Input
                  id="payment-method"
                  placeholder="신용카드 뒤 4자리, 계좌 등"
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* 추가 정보 */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Tag className="h-4 w-4" />
              추가 정보
            </h3>

            <div className="space-y-2">
              <Label>태그</Label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/10"
                    onClick={() => handleTagToggle(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cancel-url">해지 URL</Label>
              <Input
                id="cancel-url"
                type="url"
                placeholder="https://service.com/cancel"
                value={formData.cancelUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, cancelUrl: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">메모</Label>
              <Textarea
                id="notes"
                placeholder="구독에 대한 추가 메모를 입력하세요..."
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
              />
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              <X className="mr-2 h-4 w-4" />
              취소
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !formData.merchantName || !formData.amount}
              className="flex-1"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  등록 중...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  구독 등록
                </div>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}