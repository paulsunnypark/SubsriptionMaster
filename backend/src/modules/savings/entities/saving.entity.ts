import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@/modules/users/entities/user.entity';

@Entity('savings')
@Index(['user_id'])
@Index(['type'])
@Index(['created_at'])
export class Saving {
  @ApiProperty({ description: '절감 고유 ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '사용자 ID' })
  @Column()
  user_id: string;

  @ApiProperty({ description: '절감 타입', example: 'subscription_cancellation', enum: ['subscription_cancellation', 'plan_downgrade', 'annual_conversion', 'duplicate_removal'] })
  @Column({ length: 50 })
  type: 'subscription_cancellation' | 'plan_downgrade' | 'annual_conversion' | 'duplicate_removal';

  @ApiProperty({ description: '절감 제목', example: 'Netflix 구독 해지로 절감' })
  @Column()
  title: string;

  @ApiProperty({ description: '절감 설명', example: '사용하지 않는 Netflix 구독을 해지하여 월 15,000원 절약' })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({ description: '절감 금액', example: 15000 })
  @Column({ type: 'numeric', precision: 12, scale: 2 })
  amount: number;

  @ApiProperty({ description: '통화', example: 'KRW', default: 'KRW' })
  @Column({ length: 3, default: 'KRW' })
  currency: string;

  @ApiProperty({ description: '절감 주기', example: 'monthly', enum: ['one_time', 'monthly', 'yearly'] })
  @Column({ length: 20 })
  frequency: 'one_time' | 'monthly' | 'yearly';

  @ApiProperty({ description: '절감 시작일' })
  @Column({ type: 'timestamptz' })
  start_date: Date;

  @ApiProperty({ description: '절감 종료일', required: false })
  @Column({ type: 'timestamptz', nullable: true })
  end_date: Date;

  @ApiProperty({ description: '절감 메타데이터', required: false })
  @Column({ type: 'jsonb', default: {} })
  meta: Record<string, any>;

  @ApiProperty({ description: '생성일' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: '수정일' })
  @UpdateDateColumn()
  updated_at: Date;

  // 관계
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  // 가상 속성
  get isActive(): boolean {
    if (!this.end_date) return true;
    return new Date() <= this.end_date;
  }

  get isMonthly(): boolean {
    return this.frequency === 'monthly';
  }

  get isYearly(): boolean {
    return this.frequency === 'yearly';
  }

  get isOneTime(): boolean {
    return this.frequency === 'one_time';
  }

  get totalSavings(): number {
    if (this.isOneTime) return this.amount;
    
    const now = new Date();
    const start = new Date(this.start_date);
    const end = this.end_date ? new Date(this.end_date) : now;
    
    if (this.isMonthly) {
      const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
      return this.amount * Math.max(1, months);
    } else if (this.isYearly) {
      const years = end.getFullYear() - start.getFullYear();
      return this.amount * Math.max(1, years);
    }
    
    return this.amount;
  }

  // 메서드
  calculateMonthlySavings(): number {
    if (this.isMonthly) return this.amount;
    if (this.isYearly) return this.amount / 12;
    return 0; // one_time은 월별 절감 없음
  }

  calculateYearlySavings(): number {
    if (this.isYearly) return this.amount;
    if (this.isMonthly) return this.amount * 12;
    return 0; // one_time은 연별 절감 없음
  }
}
