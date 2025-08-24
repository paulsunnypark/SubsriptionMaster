import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Alert } from './entities/alert.entity';
import { SubscriptionsService } from '@/modules/subscriptions/subscriptions.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AlertsService {
  constructor(
    @InjectRepository(Alert)
    private readonly alertRepository: Repository<Alert>,
    private readonly subscriptionsService: SubscriptionsService,
  ) {}

  // 알림 생성
  async createAlert(
    userId: string,
    type: string,
    title: string,
    message: string,
    priority: string = 'medium',
    meta?: Record<string, any>,
  ): Promise<Alert> {
    const alert = this.alertRepository.create({
      user_id: userId,
      type,
      title,
      message,
      priority,
      meta,
    } as Partial<Alert>);

    return await this.alertRepository.save(alert);
  }

  // 사용자 알림 조회
  async getUserAlerts(userId: string, status?: string): Promise<Alert[]> {
    const where: any = { user_id: userId };
    if (status) {
      where.status = status;
    }

    return await this.alertRepository.find({
      where,
      order: { created_at: 'DESC' },
    });
  }

  // 알림 상태 변경
  async markAsRead(alertId: string, userId: string): Promise<Alert> {
    const alert = await this.alertRepository.findOne({
      where: { id: alertId, user_id: userId },
    });

    if (!alert) {
      throw new Error('알림을 찾을 수 없습니다.');
    }

    alert.markAsRead();
    return await this.alertRepository.save(alert);
  }

  // 알림 해제
  async dismissAlert(alertId: string, userId: string): Promise<Alert> {
    const alert = await this.alertRepository.findOne({
      where: { id: alertId, user_id: userId },
    });

    if (!alert) {
      throw new Error('알림을 찾을 수 없습니다.');
    }

    alert.dismiss();
    return await this.alertRepository.save(alert);
  }

  // 알림 삭제
  async deleteAlert(alertId: string, userId: string): Promise<void> {
    const result = await this.alertRepository.delete({
      id: alertId,
      user_id: userId,
    });

    if (result.affected === 0) {
      throw new Error('알림을 찾을 수 없습니다.');
    }
  }

  // 구독 관련 알림 생성
  async createSubscriptionAlerts(userId: string): Promise<void> {
    // 중복 구독 탐지
    const duplicates = await this.subscriptionsService.detectDuplicates(userId);
    if (duplicates.length > 0) {
      await this.createAlert(
        userId,
        'duplicate_subscription',
        '중복 구독 발견',
        `${duplicates.length}개의 중복 구독이 발견되었습니다. 비용 절감을 위해 확인해보세요.`,
        'high',
        { duplicateCount: duplicates.length },
      );
    }

    // 유령 구독 탐지
    const ghostSubscriptions = await this.subscriptionsService.detectGhostSubscriptions(userId);
    if (ghostSubscriptions.length > 0) {
      await this.createAlert(
        userId,
        'ghost_subscription',
        '유령 구독 발견',
        `${ghostSubscriptions.length}개의 장기간 사용하지 않는 구독이 발견되었습니다.`,
        'medium',
        { ghostCount: ghostSubscriptions.length },
      );
    }

    // 트라이얼 종료 임박
    const expiringTrials = await this.subscriptionsService.findExpiringTrials();
    if (expiringTrials.length > 0) {
      await this.createAlert(
        userId,
        'trial_ending',
        '트라이얼 종료 임박',
        `${expiringTrials.length}개의 트라이얼이 곧 종료됩니다.`,
        'urgent',
        { expiringCount: expiringTrials.length },
      );
    }

    // 가격 인상 탐지
    const priceIncreases = await this.subscriptionsService.detectPriceIncreases(userId);
    if (priceIncreases.length > 0) {
      await this.createAlert(
        userId,
        'price_increase',
        '구독 가격 인상',
        `${priceIncreases.length}개의 구독에서 가격 인상이 감지되었습니다.`,
        'high',
        { increaseCount: priceIncreases.length },
      );
    }
  }

  // 정기 알림 스케줄링
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async scheduleDailyAlerts(): Promise<void> {
    // 매일 오전 9시에 구독 관련 알림 생성
    // 실제 구현에서는 모든 사용자에 대해 실행
    console.log('일일 알림 스케줄링 실행');
  }

  @Cron(CronExpression.EVERY_WEEK)
  async scheduleWeeklyAlerts(): Promise<void> {
    // 매주 구독 요약 및 절감 기회 알림
    console.log('주간 알림 스케줄링 실행');
  }

  // 알림 통계
  async getUserAlertStats(userId: string): Promise<any> {
    const alerts = await this.getUserAlerts(userId);
    
    const totalAlerts = alerts.length;
    const unreadAlerts = alerts.filter(a => a.isUnread).length;
    const urgentAlerts = alerts.filter(a => a.isUrgent).length;
    
    const typeDistribution = alerts.reduce((acc, alert) => {
      acc[alert.type] = (acc[alert.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalAlerts,
      unreadAlerts,
      urgentAlerts,
      typeDistribution,
    };
  }

  // 알림 템플릿 (향후 확장)
  getAlertTemplate(type: string, data: any): { title: string; message: string } {
    const templates: Record<string, (data: any) => { title: string; message: string }> = {
      duplicate_subscription: (data) => ({
        title: '중복 구독 발견',
        message: `${data.merchantName}에서 ${data.count}개의 중복 구독이 발견되었습니다.`,
      }),
      ghost_subscription: (data) => ({
        title: '유령 구독 발견',
        message: `${data.merchantName} 구독을 ${data.days}일간 사용하지 않았습니다.`,
      }),
      trial_ending: (data) => ({
        title: '트라이얼 종료 임박',
        message: `${data.merchantName} 트라이얼이 ${data.days}일 후 종료됩니다.`,
      }),
      price_increase: (data) => ({
        title: '구독 가격 인상',
        message: `${data.merchantName} 구독료가 ${data.percentage}% 인상되었습니다.`,
      }),
    };

    const template = templates[type];
    return template ? template(data) : { title: '알림', message: '새로운 알림이 있습니다.' };
  }
}
