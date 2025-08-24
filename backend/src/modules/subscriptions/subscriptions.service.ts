import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { MerchantsService } from '@/modules/merchants/merchants.service';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    private readonly merchantsService: MerchantsService,
  ) {}

  // 기본 CRUD 메서드
  async create(createSubscriptionDto: CreateSubscriptionDto): Promise<Subscription> {
    // 중복 구독 확인
    const existingSubscription = await this.subscriptionRepository.findOne({
      where: {
        user_id: createSubscriptionDto.user_id,
        merchant_id: createSubscriptionDto.merchant_id,
        status: 'active',
      },
    });

    if (existingSubscription) {
      throw new ConflictException('이미 활성화된 구독이 존재합니다.');
    }

    const subscription = this.subscriptionRepository.create(createSubscriptionDto);
    
    // 시작일이 없으면 현재 시간으로 설정
    if (!subscription.started_at) {
      subscription.started_at = new Date();
    }

    // 다음 결제일이 없으면 자동 계산
    if (!subscription.next_bill_at) {
      subscription.updateNextBillingDate();
    }

    return await this.subscriptionRepository.save(subscription);
  }

  async findAll(): Promise<Subscription[]> {
    return await this.subscriptionRepository.find({
      relations: ['user', 'merchant', 'transactions'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
      relations: ['user', 'merchant', 'transactions'],
    });

    if (!subscription) {
      throw new NotFoundException('구독을 찾을 수 없습니다.');
    }

    return subscription;
  }

  async findByUserId(userId: string): Promise<Subscription[]> {
    return await this.subscriptionRepository.find({
      where: { user_id: userId },
      relations: ['merchant', 'transactions'],
      order: { next_bill_at: 'ASC' },
    });
  }

  async findByMerchantId(merchantId: string): Promise<Subscription[]> {
    return await this.subscriptionRepository.find({
      where: { merchant_id: merchantId },
      relations: ['user', 'transactions'],
      order: { created_at: 'DESC' },
    });
  }

  async update(id: string, updateSubscriptionDto: UpdateSubscriptionDto): Promise<Subscription> {
    const subscription = await this.findOne(id);
    Object.assign(subscription, updateSubscriptionDto);
    return await this.subscriptionRepository.save(subscription);
  }

  async remove(id: string): Promise<void> {
    const subscription = await this.findOne(id);
    await this.subscriptionRepository.remove(subscription);
  }

  // 구독 상태 관리
  async pause(id: string): Promise<Subscription> {
    const subscription = await this.findOne(id);
    subscription.pause();
    return await this.subscriptionRepository.save(subscription);
  }

  async resume(id: string): Promise<Subscription> {
    const subscription = await this.findOne(id);
    subscription.resume();
    return await this.subscriptionRepository.save(subscription);
  }

  async cancel(id: string): Promise<Subscription> {
    const subscription = await this.findOne(id);
    subscription.cancel();
    return await this.subscriptionRepository.save(subscription);
  }

  // 중복 구독 탐지
  async detectDuplicates(userId: string): Promise<Subscription[]> {
    const userSubscriptions = await this.findByUserId(userId);
    const duplicates: Subscription[] = [];

    // 머천트별로 그룹화하여 중복 확인
    const merchantGroups = new Map<string, Subscription[]>();
    
    userSubscriptions.forEach(sub => {
      if (sub.status === 'active') {
        const key = sub.merchant_id;
        if (!merchantGroups.has(key)) {
          merchantGroups.set(key, []);
        }
        merchantGroups.get(key)!.push(sub);
      }
    });

    // 2개 이상의 활성 구독이 있는 머천트 찾기
    merchantGroups.forEach((subscriptions, merchantId) => {
      if (subscriptions.length > 1) {
        duplicates.push(...subscriptions);
      }
    });

    return duplicates;
  }

  // 유령 구독 탐지 (장기간 사용하지 않는 구독)
  async detectGhostSubscriptions(userId: string, daysThreshold: number = 60): Promise<Subscription[]> {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - daysThreshold);

    return await this.subscriptionRepository.find({
      where: {
        user_id: userId,
        status: 'active',
        updated_at: LessThanOrEqual(thresholdDate),
      },
      relations: ['merchant'],
    });
  }

  // 트라이얼 종료 임박 구독
  async findExpiringTrials(daysThreshold: number = 7): Promise<Subscription[]> {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);

    return await this.subscriptionRepository.find({
      where: {
        cycle: 'trial',
        status: 'active',
        next_bill_at: LessThanOrEqual(thresholdDate),
      },
      relations: ['user', 'merchant'],
    });
  }

  // 가격 인상 탐지
  async detectPriceIncreases(userId: string, percentageThreshold: number = 15): Promise<any[]> {
    const userSubscriptions = await this.findByUserId(userId);
    const priceIncreases = [];

    for (const subscription of userSubscriptions) {
      if (subscription.status === 'active' && subscription.price) {
        // 최근 거래 내역에서 가격 변화 확인
        const recentTransactions = subscription.transactions?.filter(t => 
          t.amount && Math.abs(t.amount - subscription.price) / subscription.price > percentageThreshold / 100
        );

        if (recentTransactions && recentTransactions.length > 0) {
          priceIncreases.push({
            subscription,
            oldPrice: subscription.price,
            newPrice: recentTransactions[0].amount,
            increasePercentage: ((recentTransactions[0].amount - subscription.price) / subscription.price) * 100,
          });
        }
      }
    }

    return priceIncreases;
  }

  // 구독 통계
  async getUserSubscriptionStats(userId: string) {
    const subscriptions = await this.findByUserId(userId);
    
    const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active');
    const monthlySubscriptions = activeSubscriptions.filter(sub => sub.cycle === 'monthly');
    const yearlySubscriptions = activeSubscriptions.filter(sub => sub.cycle === 'yearly');
    const trialSubscriptions = activeSubscriptions.filter(sub => sub.cycle === 'trial');

    const totalMonthlySpending = monthlySubscriptions.reduce((sum, sub) => sum + (sub.price || 0), 0);
    const totalYearlySpending = yearlySubscriptions.reduce((sum, sub) => sum + (sub.price || 0), 0);
    const totalMonthlyEquivalent = activeSubscriptions.reduce((sum, sub) => sum + sub.monthlyEquivalentPrice, 0);

    return {
      totalSubscriptions: subscriptions.length,
      activeSubscriptions: activeSubscriptions.length,
      monthlySubscriptions: monthlySubscriptions.length,
      yearlySubscriptions: yearlySubscriptions.length,
      trialSubscriptions: trialSubscriptions.length,
      totalMonthlySpending,
      totalYearlySpending,
      totalMonthlyEquivalent,
      averageMonthlySpending: activeSubscriptions.length > 0 ? totalMonthlyEquivalent / activeSubscriptions.length : 0,
    };
  }

  // 월별 구독 비용 예측
  async getMonthlyForecast(userId: string, months: number = 12): Promise<any[]> {
    const subscriptions = await this.findByUserId(userId);
    const forecast = [];

    for (let i = 0; i < months; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() + i);
      
      let monthlyCost = 0;
      subscriptions.forEach(sub => {
        if (sub.status === 'active') {
          if (sub.cycle === 'monthly') {
            monthlyCost += sub.price || 0;
          } else if (sub.cycle === 'yearly') {
            // 연간 구독이 해당 월에 결제되는지 확인
            if (sub.next_bill_at && sub.next_bill_at.getMonth() === date.getMonth()) {
              monthlyCost += sub.price || 0;
            }
          }
        }
      });

      forecast.push({
        month: date.toISOString().slice(0, 7), // YYYY-MM 형식
        estimatedCost: monthlyCost,
        subscriptionCount: subscriptions.filter(sub => sub.status === 'active').length,
      });
    }

    return forecast;
  }

  // 구독 추천 (비용 절감 기회)
  async getSavingsRecommendations(userId: string): Promise<any[]> {
    const subscriptions = await this.findByUserId(userId);
    const recommendations = [];

    // 연간 전환 기회
    const monthlySubscriptions = subscriptions.filter(sub => 
      sub.status === 'active' && sub.cycle === 'monthly' && sub.price
    );

    monthlySubscriptions.forEach(sub => {
      const yearlyPrice = (sub.price || 0) * 12;
      const potentialSavings = (sub.price || 0) * 12 - yearlyPrice;
      
      if (potentialSavings > 0) {
        recommendations.push({
          type: 'yearly_conversion',
          subscription: sub,
          currentCost: sub.price || 0,
          recommendedCost: yearlyPrice / 12,
          potentialSavings,
          description: `${sub.merchant?.name_norm || 'Unknown'} 연간 전환으로 월 ${potentialSavings / 12}원 절약`,
        });
      }
    });

    // 중복 구독 제거 기회
    const duplicates = await this.detectDuplicates(userId);
    if (duplicates.length > 0) {
      const duplicateGroups = new Map<string, Subscription[]>();
      duplicates.forEach(sub => {
        const key = sub.merchant_id;
        if (!duplicateGroups.has(key)) {
          duplicateGroups.set(key, []);
        }
        duplicateGroups.get(key)!.push(sub);
      });

      duplicateGroups.forEach((subs, merchantId) => {
        if (subs.length > 1) {
          const totalCost = subs.reduce((sum, sub) => sum + (sub.price || 0), 0);
          const potentialSavings = totalCost - (subs[0].price || 0);
          
          recommendations.push({
            type: 'duplicate_removal',
            subscriptions: subs,
            currentCost: totalCost,
            recommendedCost: subs[0].price || 0,
            potentialSavings,
            description: `${subs[0].merchant?.name_norm || 'Unknown'} 중복 구독 제거로 월 ${potentialSavings}원 절약`,
          });
        }
      });
    }

    return recommendations.sort((a, b) => b.potentialSavings - a.potentialSavings);
  }
}
