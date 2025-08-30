"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/simple-select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calendar, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface AddSubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SubscriptionForm {
  name: string;
  amount: string;
  billing_cycle: 'monthly' | 'yearly';
  next_billing_date: string;
  category: string;
}

export function AddSubscriptionModal({ open, onOpenChange }: AddSubscriptionModalProps) {
  const [form, setForm] = useState<SubscriptionForm>({
    name: '',
    amount: '',
    billing_cycle: 'monthly',
    next_billing_date: '',
    category: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    'Entertainment',
    'Music',
    'Productivity',
    'Gaming',
    'News & Media',
    'Cloud Storage',
    'Communication',
    'Shopping',
    'Fitness & Health',
    'Education',
    'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name || !form.amount || !form.next_billing_date || !form.category) {
      toast.error('모든 필수 필드를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    
    try {
      // API 호출을 여기에 구현 (현재는 시뮬레이션)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('구독이 성공적으로 추가되었습니다.');
      
      // 폼 초기화
      setForm({
        name: '',
        amount: '',
        billing_cycle: 'monthly',
        next_billing_date: '',
        category: ''
      });
      
      onOpenChange(false);
    } catch (error) {
      toast.error('구독 추가 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof SubscriptionForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>새 구독 추가</DialogTitle>
          <DialogDescription>
            새로운 구독 서비스를 추가하세요. 모든 필수 정보를 입력해주세요.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">서비스 이름 *</Label>
              <Input
                id="name"
                placeholder="예: Netflix, Spotify"
                value={form.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">금액 *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="15.99"
                    className="pl-10"
                    value={form.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="billing_cycle">결제 주기 *</Label>
                <Select value={form.billing_cycle} onValueChange={(value) => handleInputChange('billing_cycle', value as 'monthly' | 'yearly')}>
                  <SelectTrigger>
                    <SelectValue placeholder="선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">월간</SelectItem>
                    <SelectItem value="yearly">연간</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="next_billing_date">다음 결제일 *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="next_billing_date"
                  type="date"
                  className="pl-10"
                  value={form.next_billing_date}
                  onChange={(e) => handleInputChange('next_billing_date', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">카테고리 *</Label>
              <Select value={form.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? '추가 중...' : '구독 추가'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
