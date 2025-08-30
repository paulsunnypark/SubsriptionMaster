import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Search, AlertTriangle, Check, Building2, Calendar, DollarSign } from 'lucide-react';

interface Merchant {
  id: string;
  name: string;
  logo?: string;
  category: string;
  averagePrice?: number;
  cancelUrl?: string;
}

interface QuickAddModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface DuplicateWarning {
  id: string;
  merchantName: string;
  amount: number;
  nextBilling: string;
  similarity: number;
}

export function QuickAddModal({ open, onOpenChange, onSuccess }: QuickAddModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [merchantQuery, setMerchantQuery] = useState('');
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [showMerchants, setShowMerchants] = useState(false);
  const [duplicateWarnings, setDuplicateWarnings] = useState<DuplicateWarning[]>([]);

  const [formData, setFormData] = useState({
    merchantName: '',
    amount: '',
    billingCycle: 'monthly' as 'monthly' | 'yearly' | 'trial',
    nextBilling: '',
    notes: ''
  });

  // Mock merchants data - 실제로는 API에서 가져옴
  const mockMerchants: Merchant[] = [
    { id: '1', name: 'Netflix', category: '스트리밍', averagePrice: 17000, cancelUrl: 'https://netflix.com/cancel' },
    { id: '2', name: 'Spotify', category: '스트리밍', averagePrice: 10900, cancelUrl: 'https://spotify.com/cancel' },
    { id: '3', name: 'YouTube Premium', category: '스트리밍', averagePrice: 14900 },
    { id: '4', name: 'Adobe Creative Cloud', category: '소프트웨어', averagePrice: 24000 },
    { id: '5', name: 'Microsoft 365', category: '소프트웨어', averagePrice: 12000 },
    { id: '6', name: 'Apple iCloud', category: '클라우드', averagePrice: 1300 },
    { id: '7', name: 'Google Workspace', category: '소프트웨어', averagePrice: 8000 }
  ];

  // 상호명 검색
  useEffect(() => {
    if (merchantQuery.length >= 2) {
      const filtered = mockMerchants.filter(m => 
        m.name.toLowerCase().includes(merchantQuery.toLowerCase())
      );
      setMerchants(filtered);
      setShowMerchants(true);
    } else {
      setMerchants([]);
      setShowMerchants(false);
    }
  }, [merchantQuery]);

  // 중복 감지
  useEffect(() => {
    if (selectedMerchant && formData.amount) {
      // Mock duplicate detection
      const amount = parseInt(formData.amount);
      const mockDuplicates: DuplicateWarning[] = [];
      
      if (selectedMerchant.name === 'Netflix' && Math.abs(amount - 17000) <= 2000) {
        mockDuplicates.push({
          id: 'dup1',
          merchantName: 'Netflix',
          amount: 17000,
          nextBilling: '2024-02-15',
          similarity: 95
        });
      }
      
      setDuplicateWarnings(mockDuplicates);
    } else {
      setDuplicateWarnings([]);
    }
  }, [selectedMerchant, formData.amount]);

  const handleMerchantSelect = (merchant: Merchant) => {
    setSelectedMerchant(merchant);
    setMerchantQuery(merchant.name);
    setFormData(prev => ({
      ...prev,
      merchantName: merchant.name,
      amount: merchant.averagePrice?.toString() || prev.amount
    }));
    setShowMerchants(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: API 호출로 구독 생성
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock API call
      
      toast({
        title: "구독이 추가되었습니다",
        description: `${formData.merchantName}이 성공적으로 등록되었습니다.`
      });
      
      onSuccess();
      onOpenChange(false);
      
      // Reset form
      setFormData({
        merchantName: '',
        amount: '',
        billingCycle: 'monthly',
        nextBilling: '',
        notes: ''
      });
      setSelectedMerchant(null);
      setMerchantQuery('');
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

  const formatCurrency = (amount: number) => `₩${amount.toLocaleString()}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            빠른 구독 추가
          </DialogTitle>
          <DialogDescription>
            필수 정보만 입력하여 빠르게 구독을 등록하세요
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 상호명 입력 및 자동완성 */}
          <div className="space-y-2">
            <Label htmlFor="merchant">서비스명 *</Label>
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="merchant"
                  placeholder="Netflix, Spotify, Adobe..."
                  value={merchantQuery}
                  onChange={(e) => setMerchantQuery(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
              
              {/* 자동완성 드롭다운 */}
              {showMerchants && merchants.length > 0 && (
                <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto">
                  <CardContent className="p-0">
                    {merchants.map((merchant) => (
                      <button
                        key={merchant.id}
                        type="button"
                        onClick={() => handleMerchantSelect(merchant)}
                        className="w-full p-3 text-left hover:bg-muted transition-colors border-b last:border-b-0"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{merchant.name}</span>
                              <Badge variant="secondary" className="text-xs">
                                {merchant.category}
                              </Badge>
                            </div>
                            {merchant.averagePrice && (
                              <p className="text-sm text-muted-foreground mt-1">
                                평균 {formatCurrency(merchant.averagePrice)}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* 중복 경고 */}
          {duplicateWarnings.length > 0 && (
            <div className="space-y-2">
              {duplicateWarnings.map((warning) => (
                <Card key={warning.id} className="border-warning bg-warning-light">
                  <CardContent className="p-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">중복 구독 가능성</p>
                        <p className="text-xs text-muted-foreground">
                          {warning.merchantName} {formatCurrency(warning.amount)} 구독이 이미 있습니다
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="outline" className="h-7 text-xs">
                            병합하기
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 text-xs">
                            무시하기
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* 금액 */}
          <div className="space-y-2">
            <Label htmlFor="amount">월 결제 금액 *</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                placeholder="17000"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* 결제 주기 */}
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

          {/* 다음 결제일 (선택사항) */}
          <div className="space-y-2">
            <Label htmlFor="next-billing">다음 결제일 (선택사항)</Label>
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

          {/* 메모 (선택사항) */}
          <div className="space-y-2">
            <Label htmlFor="notes">메모 (선택사항)</Label>
            <Input
              id="notes"
              placeholder="개인용, 팀 공유 등..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            />
          </div>

          {/* 버튼 */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
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
                  추가 중...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  구독 추가
                </div>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}