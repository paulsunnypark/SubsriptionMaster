import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Subscription } from '@/modules/subscriptions/entities/subscription.entity';
import { Transaction } from '@/modules/ingest/entities/transaction.entity';
import { Alert } from '@/modules/alerts/entities/alert.entity';
import { Saving } from '@/modules/savings/entities/saving.entity';

@Entity('users')
export class User {
  @ApiProperty({ description: '사용자 고유 ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '사용자 이메일' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ description: '사용자 비밀번호' })
  @Column({ select: false })
  @Exclude()
  password: string;

  @ApiProperty({ description: '사용자 이름' })
  @Column({ nullable: true })
  name: string;

  @ApiProperty({ description: '프로필 이미지 URL' })
  @Column({ nullable: true })
  avatar_url: string;

  @ApiProperty({ description: '사용자 시간대' })
  @Column({ default: 'UTC' })
  timezone: string;

  @ApiProperty({ description: '사용자 설정' })
  @Column({ type: 'jsonb', default: {} })
  preferences: Record<string, any>;

  @ApiProperty({ description: '계정 활성화 상태' })
  @Column({ default: true })
  is_active: boolean;

  @ApiProperty({ description: '이메일 인증 상태' })
  @Column({ default: false })
  email_verified: boolean;

  @ApiProperty({ description: '마지막 로그인 시간' })
  @Column({ nullable: true })
  last_login_at: Date;

  @ApiProperty({ description: '생성일' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: '수정일' })
  @UpdateDateColumn()
  updated_at: Date;

  // 관계
  @OneToMany(() => Subscription, (subscription) => subscription.user)
  subscriptions: Subscription[];

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @OneToMany(() => Alert, (alert) => alert.user)
  alerts: Alert[];

  @OneToMany(() => Saving, (saving) => saving.user)
  savings: Saving[];

  // 메서드
  @BeforeInsert()
  @BeforeUpdate()
  normalizeEmail() {
    if (this.email) {
      this.email = this.email.toLowerCase().trim();
    }
  }

  // 가상 속성
  get subscriptionCount(): number {
    return this.subscriptions?.filter(sub => sub.status === 'active').length || 0;
  }

  get monthlySpending(): number {
    return this.subscriptions
      ?.filter(sub => sub.status === 'active' && sub.cycle === 'monthly')
      .reduce((sum, sub) => sum + (sub.price || 0), 0) || 0;
  }

  get yearlySpending(): number {
    return this.subscriptions
      ?.filter(sub => sub.status === 'active' && sub.cycle === 'yearly')
      .reduce((sum, sub) => sum + (sub.price || 0), 0) || 0;
  }

  get totalSpending(): number {
    return this.monthlySpending + this.yearlySpending;
  }
}
