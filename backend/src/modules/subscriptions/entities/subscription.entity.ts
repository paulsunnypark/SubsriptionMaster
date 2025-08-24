import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@/modules/users/entities/user.entity';
import { Merchant } from '@/modules/merchants/entities/merchant.entity';
import { Transaction } from '@/modules/ingest/entities/transaction.entity';

@Entity('subscriptions')
@Index(['user_id'])
@Index(['merchant_id'])
@Index(['next_bill_at'])
@Index(['status'])
export class Subscription {
  @ApiProperty({ description: '구독 고유 ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '사용자 ID' })
  @Column()
  user_id: string;

  @ApiProperty({ description: '머천트 ID' })
  @Column()
  merchant_id: string;

  @ApiProperty({ description: '구독 플랜명', example: 'Premium Plan' })
  @Column({ nullable: true })
  plan: string;

  @ApiProperty({ description: '결제 주기', example: 'monthly', enum: ['monthly', 'yearly', 'trial'] })
  @Column({ type: 'varchar', length: 20 })
  cycle: 'monthly' | 'yearly' | 'trial';

  @ApiProperty({ description: '다음 결제일' })
  @Column({ type: 'timestamptz', nullable: true })
  next_bill_at: Date;

  @ApiProperty({ description: '구독 가격', example: 15000 })
  @Column({ type: 'numeric', precision: 12, scale: 2, nullable: true })
  price: number;

  @ApiProperty({ description: '통화', example: 'KRW', default: 'KRW' })
  @Column({ length: 3, default: 'KRW' })
  currency: string;

  @ApiProperty({ description: '구독 상태', example: 'active', enum: ['active', 'paused', 'canceled'], default: 'active' })
  @Column({ length: 20, default: 'active' })
  status: 'active' | 'paused' | 'canceled';

  @ApiProperty({ description: '구독 시작일' })
  @Column({ type: 'timestamptz', nullable: true })
  started_at: Date;

  @ApiProperty({ description: '구독 종료일' })
  @Column({ type: 'timestamptz', nullable: true })
  ended_at: Date;

  @ApiProperty({ description: '자동 갱신 여부', default: true })
  @Column({ default: true })
  auto_renew: boolean;

  @ApiProperty({ description: '구독 메타데이터', required: false })
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

  @OneToMany(() => Transaction, (transaction) => transaction.subscription)
  transactions: Transaction[];

  // 가상 속성
  get isActive(): boolean {
    return this.status === 'active';
  }

  get isTrial(): boolean {
    return this.cycle === 'trial';
  }

  get isExpired(): boolean {
    if (!this.next_bill_at) return false;
    return new Date() > this.next_bill_at;
  }

  get daysUntilNextBill(): number {
    if (!this.next_bill_at) return 0;
    const now = new Date();
    const nextBill = new Date(this.next_bill_at);
    const diffTime = nextBill.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  get monthlyEquivalentPrice(): number {
    if (this.cycle === 'monthly') return this.price || 0;
    if (this.cycle === 'yearly') return (this.price || 0) / 12;
    return 0; // trial은 0
  }

  get yearlyEquivalentPrice(): number {
    if (this.cycle === 'yearly') return this.price || 0;
    if (this.cycle === 'monthly') return (this.price || 0) * 12;
    return 0; // trial은 0
  }

  // 메서드
  pause(): void {
    this.status = 'paused';
    this.updated_at = new Date();
  }

  resume(): void {
    this.status = 'active';
    this.updated_at = new Date();
  }

  cancel(): void {
    this.status = 'canceled';
    this.ended_at = new Date();
    this.updated_at = new Date();
  }

  updateNextBillingDate(): void {
    if (this.cycle === 'monthly') {
      this.next_bill_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    } else if (this.cycle === 'yearly') {
      this.next_bill_at = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
    }
    this.updated_at = new Date();
  }
}
