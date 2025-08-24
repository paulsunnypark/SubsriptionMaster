import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Saving } from './entities/saving.entity';
import { SubscriptionsService } from '@/modules/subscriptions/subscriptions.service';
import { AlertsService } from '@/modules/alerts/alerts.service';

@Injectable()
export class SavingsService {
  constructor(
    @InjectRepository(Saving)
    private readonly savingRepository: Repository<Saving>,
    private readonly subscriptionsService: SubscriptionsService,
    private readonly alertsService: AlertsService,
  ) {}

  // 절감 이벤트 생성
  async createSaving(
    userId: string,
    type: string,
    title: string,
    description: string,
    amount: number,
    frequency: string,
    startDate: Date,
    endDate?: Date,
    meta?: Record<string, any>,
  ): Promise<Saving> {
    const saving = this.savingRepository.create({
      user_id: userId,
      type,
      title,
      description,
      amount,
      currency: 'KRW',
      frequency,
      start_date: startDate,
      end_date: endDate,
      meta,
    } as Partial<Saving>);

    return await this.savingRepository.save(saving);
  }

  // 사용자 절감 목록 조회
  async getUserSavings(userId: string, activeOnly: boolean = true): Promise<Saving[]> {
    const where: any = { user_id: userId };
    
    if (activeOnly) {
      where.end_date = null; // 종료일이 없는 활성 절감만
    }

    return await this.savingRepository.find({
      where,
      order: { start_date: 'DESC' },
    });
  }

  // 절감 이벤트 수정
  async updateSaving(
    savingId: string,
    userId: string,
    updateData: Partial<Saving>,
  ): Promise<Saving> {
    const saving = await this.savingRepository.findOne({
      where: { id: savingId, user_id: userId },
    });

    if (!saving) {
      throw new Error('절감 이벤트를 찾을 수 없습니다.');
    }

    Object.assign(saving, updateData);
    return await this.savingRepository.save(saving);
  }

  // 절감 이벤트 삭제
  async deleteSaving(savingId: string, userId: string): Promise<void> {
    const result = await this.savingRepository.delete({
      id: savingId,
      user_id: userId,
    });

    if (result.affected === 0) {
      throw new Error('절감 이벤트를 찾을 수 없습니다.');
    }
  }

  // 자동 절감 이벤트 생성
  async createAutomaticSavings(userId: string): Promise<void> {
    // 구독 해지로 인한 절감
    await this.createSubscriptionCancellationSavings(userId);
    
    // 연간 전환으로 인한 절감
    await this.createAnnualConversionSavings(userId);
    
    // 중복 구독 제거로 인한 절감
    await this.createDuplicateRemovalSavings(userId);
  }

  // 구독 해지 절감 생성
  private async createSubscriptionCancellationSavings(userId: string): Promise<void> {
    const subscriptions = await this.subscriptionsService.findByUserId(userId);
    const canceledSubscriptions = subscriptions.filter(sub => sub.status === 'canceled');

    for (const sub of canceledSubscriptions) {
      if (sub.price && sub.ended_at) {
        const existingSaving = await this.savingRepository.findOne({
          where: {
            user_id: userId,
            type: 'subscription_cancellation',
            meta: { subscriptionId: sub.id },
          },
        });

        if (!existingSaving) {
          await this.createSaving(
            userId,
            'subscription_cancellation',
            `${sub.merchant?.name_norm || 'Unknown'} 구독 해지`,
            `${sub.merchant?.name_norm || 'Unknown'} 구독을 해지하여 월 ${sub.price}원 절약`,
            sub.price,
            'monthly',
            sub.ended_at,
            undefined,
            { subscriptionId: sub.id, merchantName: sub.merchant?.name_norm },
          );
        }
      }
    }
  }

  // 연간 전환 절감 생성
  private async createAnnualConversionSavings(userId: string): Promise<void> {
    const recommendations = await this.subscriptionsService.getSavingsRecommendations(userId);
    const annualConversions = recommendations.filter(r => r.type === 'yearly_conversion');

    for (const rec of annualConversions) {
      const existingSaving = await this.savingRepository.findOne({
        where: {
          user_id: userId,
          type: 'annual_conversion',
          meta: { subscriptionId: rec.subscription.id },
        },
      });

      if (!existingSaving) {
        await this.createSaving(
          userId,
          'annual_conversion',
          `${rec.subscription.merchant?.name_norm || 'Unknown'} 연간 전환`,
          rec.description,
          rec.potentialSavings / 12,
          'monthly',
          new Date(),
          undefined,
          { subscriptionId: rec.subscription.id, merchantName: rec.subscription.merchant?.name_norm },
        );
      }
    }
  }

  // 중복 구독 제거 절감 생성
  private async createDuplicateRemovalSavings(userId: string): Promise<void> {
    const recommendations = await this.subscriptionsService.getSavingsRecommendations(userId);
    const duplicateRemovals = recommendations.filter(r => r.type === 'duplicate_removal');

    for (const rec of duplicateRemovals) {
      const existingSaving = await this.savingRepository.findOne({
        where: {
          user_id: userId,
          type: 'duplicate_removal',
          meta: { merchantId: rec.subscriptions[0].merchant_id },
        },
      });

      if (!existingSaving) {
        await this.createSaving(
          userId,
          'duplicate_removal',
          `${rec.subscriptions[0].merchant?.name_norm || 'Unknown'} 중복 구독 제거`,
          rec.description,
          rec.potentialSavings,
          'monthly',
          new Date(),
          undefined,
          { merchantId: rec.subscriptions[0].merchant_id, merchantName: rec.subscriptions[0].merchant?.name_norm },
        );
      }
    }
  }

  // 절감 통계
  async getUserSavingsStats(userId: string): Promise<any> {
    const savings = await this.getUserSavings(userId, false);
    
    const activeSavings = savings.filter(s => s.isActive);
    const totalMonthlySavings = activeSavings.reduce((sum, s) => sum + s.calculateMonthlySavings(), 0);
    const totalYearlySavings = activeSavings.reduce((sum, s) => sum + s.calculateYearlySavings(), 0);
    
    const typeDistribution = savings.reduce((acc, saving) => {
      acc[saving.type] = (acc[saving.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const monthlyTrend = this.calculateMonthlySavingsTrend(savings);

    return {
      totalSavings: savings.length,
      activeSavings: activeSavings.length,
      totalMonthlySavings,
      totalYearlySavings,
      typeDistribution,
      monthlyTrend,
      averageMonthlySavings: activeSavings.length > 0 ? totalMonthlySavings / activeSavings.length : 0,
    };
  }

  // 월별 절감 트렌드 계산
  private calculateMonthlySavingsTrend(savings: Saving[]): any[] {
    const monthlyData = new Map<string, number>();
    
    savings.forEach(saving => {
      if (saving.isActive) {
        const month = saving.start_date.toISOString().slice(0, 7); // YYYY-MM
        monthlyData.set(month, (monthlyData.get(month) || 0) + saving.calculateMonthlySavings());
      }
    });

    return Array.from(monthlyData.entries()).map(([month, amount]) => ({
      month,
      amount,
    })).sort((a, b) => a.month.localeCompare(b.month));
  }

  // 절감 목표 설정
  async setSavingsGoal(userId: string, monthlyGoal: number, yearlyGoal: number): Promise<void> {
    // 사용자 설정에 절감 목표 저장 (향후 구현)
    console.log(`사용자 ${userId}의 절감 목표 설정: 월 ${monthlyGoal}원, 연 ${yearlyGoal}원`);
  }

  // 절감 달성률 계산
  async calculateSavingsAchievement(userId: string): Promise<any> {
    const stats = await this.getUserSavingsStats(userId);
    const monthlyGoal = 50000; // 기본 목표 (향후 사용자 설정에서 가져올 예정)
    const yearlyGoal = monthlyGoal * 12;

    const monthlyAchievement = (stats.totalMonthlySavings / monthlyGoal) * 100;
    const yearlyAchievement = (stats.totalYearlySavings / yearlyGoal) * 100;

    return {
      monthlyGoal,
      yearlyGoal,
      monthlyAchievement: Math.min(monthlyAchievement, 100),
      yearlyAchievement: Math.min(yearlyAchievement, 100),
      isOnTrack: monthlyAchievement >= 80, // 80% 이상 달성 시 정상 진행
    };
  }
}
