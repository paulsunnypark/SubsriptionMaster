import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Subscription } from '@/modules/subscriptions/entities/subscription.entity';
import { Transaction } from '@/modules/ingest/entities/transaction.entity';

@Entity('merchants')
@Index(['name_norm'])
@Index(['category'])
export class Merchant {
  @ApiProperty({ description: '머천트 고유 ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '정규화된 머천트명', example: 'Netflix' })
  @Column({ unique: true })
  name_norm: string;

  @ApiProperty({ description: '원본 머천트명', example: 'NETFLIX.COM' })
  @Column({ nullable: true })
  name_original: string;

  @ApiProperty({ description: '머천트 카테고리', example: 'OTT' })
  @Column({ nullable: true })
  category: string;

  @ApiProperty({ description: '해지 URL', example: 'https://www.netflix.com/cancelplan' })
  @Column({ nullable: true })
  cancel_url: string;

  @ApiProperty({ description: '이용약관 해시', required: false })
  @Column({ nullable: true })
  terms_hash: string;

  @ApiProperty({ description: '로고 URL', required: false })
  @Column({ nullable: true })
  logo_url: string;

  @ApiProperty({ description: '웹사이트 URL', required: false })
  @Column({ nullable: true })
  website: string;

  @ApiProperty({ description: '머천트 상태', example: 'active', default: 'active' })
  @Column({ default: 'active' })
  status: string;

  @ApiProperty({ description: '정규화 규칙 버전', example: '1.0.0' })
  @Column({ default: '1.0.0' })
  ruleset_version: string;

  @ApiProperty({ description: '생성일' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: '수정일' })
  @UpdateDateColumn()
  updated_at: Date;

  // 관계
  @OneToMany(() => Subscription, (subscription) => subscription.merchant)
  subscriptions: Subscription[];

  @OneToMany(() => Transaction, (transaction) => transaction.merchant)
  transactions: Transaction[];

  // 가상 속성
  get activeSubscriptionCount(): number {
    return this.subscriptions?.filter(sub => sub.status === 'active').length || 0;
  }

  get totalRevenue(): number {
    return this.transactions?.reduce((sum, trans) => sum + (trans.amount || 0), 0) || 0;
  }
}
