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
import { Calendar, DollarSign, Target } from 'lucide-react';
import { toast } from 'sonner';

interface AddSavingsGoalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SavingsGoalForm {
  title: string;
  target_amount: string;
  deadline: string;
  category: string;
  description: string;
}

export function AddSavingsGoalModal({ open, onOpenChange }: AddSavingsGoalModalProps) {
  const [form, setForm] = useState<SavingsGoalForm>({
    title: '',
    target_amount: '',
    deadline: '',
    category: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    '연간 절감 목표',
    '엔터테인먼트 절약',
    '생산성 도구 최적화',
    '음악 서비스 정리',
    '클라우드 스토리지 절약',
    '월간 절감 목표',
    '특정 서비스 절약',
    '기타'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.title || !form.target_amount || !form.deadline || !form.category) {
      toast.error('모든 필수 필드를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    
    try {
      // API 호출을 여기에 구현 (현재는 시뮬레이션)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('절감 목표가 성공적으로 추가되었습니다.');
      
      // 폼 초기화
      setForm({
        title: '',
        target_amount: '',
        deadline: '',
        category: '',
        description: ''
      });
      
      onOpenChange(false);
    } catch (error) {
      toast.error('절감 목표 추가 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof SavingsGoalForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>새 절감 목표 추가</DialogTitle>
          <DialogDescription>
            새로운 절감 목표를 설정하세요. 목표를 달성하여 구독비를 줄여보세요.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">목표 제목 *</Label>
              <Input
                id="title"
                placeholder="예: 연간 500달러 절감"
                value={form.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="target_amount">목표 금액 *</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="target_amount"
                    type="number"
                    step="0.01"
                    placeholder="500.00"
                    className="pl-10"
                    value={form.target_amount}
                    onChange={(e) => handleInputChange('target_amount', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">마감일 *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="deadline"
                    type="date"
                    className="pl-10"
                    value={form.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                    required
                  />
                </div>
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

            <div className="space-y-2">
              <Label htmlFor="description">설명 (선택사항)</Label>
              <Input
                id="description"
                placeholder="목표에 대한 간단한 설명을 입력하세요"
                value={form.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-start space-x-3">
                <Target className="h-5 w-5 text-primary mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-foreground">절감 팁</p>
                  <p className="text-muted-foreground mt-1">
                    현실적이고 달성 가능한 목표를 설정하세요. 작은 목표부터 시작하여 점진적으로 늘려나가는 것이 좋습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? '추가 중...' : '목표 추가'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
