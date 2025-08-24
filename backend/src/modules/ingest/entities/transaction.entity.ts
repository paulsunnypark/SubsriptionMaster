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
import { Merchant } from '@/modules/merchants/entities/merchant.entity';
import { Subscription } from '@/modules/subscriptions/entities/subscription.entity';

@Entity('transactions')
@Index(['user_id'])
@Index(['merchant_id'])
@Index(['subscription_id'])
@Index(['transaction_date'])
@Index(['status'])
export class Transaction {
  @ApiProperty({ description: '거래 고유 ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '사용자 ID' })
  @Column()
  user_id: string;

  @ApiProperty({ description: '머천트 ID' })
  @Column()
  merchant_id: string;

  @ApiProperty({ description: '구독 ID', required: false })
  @Column({ nullable: true })
  subscription_id: string;

  @ApiProperty({ description: '거래 금액', example: 15000 })
  @Column({ type: 'numeric', precision: 12, scale: 2 })
  amount: number;

  @ApiProperty({ description: '통화', example: 'KRW', default: 'KRW' })
  @Column({ length: 3, default: 'KRW' })
  currency: string;

  @ApiProperty({ description: '거래 상태', example: 'completed', enum: ['pending', 'completed', 'failed', 'refunded'] })
  @Column({ length: 20, default: 'completed' })
  status: 'pending' | 'completed' | 'failed' | 'refunded';

  @ApiProperty({ description: '거래 날짜' })
  @Column({ type: 'timestamptz' })
  transaction_date: Date;

  @ApiProperty({ description: '거래 설명', example: 'Netflix Premium 구독료' })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({ description: '거래 메타데이터', required: false })
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

  @ManyToOne(() => Merchant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'merchant_id' })
  merchant: Merchant;

  @ManyToOne(() => Subscription, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'subscription_id' })
  subscription: Subscription;

  // 가상 속성
  get isCompleted(): boolean {
    return this.status === 'completed';
  }

  get isPending(): boolean {
    return this.status === 'pending';
  }

  get isFailed(): boolean {
    return this.status === 'failed';
  }

  get isRefunded(): boolean {
    return this.status === 'refunded';
  }

  get isSubscriptionPayment(): boolean {
    return !!this.subscription_id;
  }

  // 메서드
  markAsCompleted(): void {
    this.status = 'completed';
    this.updated_at = new Date();
  }

  markAsFailed(): void {
    this.status = 'failed';
    this.updated_at = new Date();
  }

  markAsRefunded(): void {
    this.status = 'refunded';
    this.updated_at = new Date();
  }
}
