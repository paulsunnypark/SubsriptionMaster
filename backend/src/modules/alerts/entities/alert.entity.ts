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

@Entity('alerts')
@Index(['user_id'])
@Index(['type'])
@Index(['status'])
@Index(['created_at'])
export class Alert {
  @ApiProperty({ description: '알림 고유 ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '사용자 ID' })
  @Column()
  user_id: string;

  @ApiProperty({ description: '알림 타입', example: 'price_increase', enum: ['price_increase', 'duplicate_subscription', 'ghost_subscription', 'trial_ending', 'payment_failed'] })
  @Column({ length: 50 })
  type: 'price_increase' | 'duplicate_subscription' | 'ghost_subscription' | 'trial_ending' | 'payment_failed';

  @ApiProperty({ description: '알림 제목', example: '구독 가격 인상 알림' })
  @Column()
  title: string;

  @ApiProperty({ description: '알림 내용', example: 'Netflix 구독료가 15% 인상되었습니다.' })
  @Column({ type: 'text' })
  message: string;

  @ApiProperty({ description: '알림 상태', example: 'unread', enum: ['unread', 'read', 'dismissed'] })
  @Column({ length: 20, default: 'unread' })
  status: 'unread' | 'read' | 'dismissed';

  @ApiProperty({ description: '알림 우선순위', example: 'high', enum: ['low', 'medium', 'high', 'urgent'] })
  @Column({ length: 20, default: 'medium' })
  priority: 'low' | 'medium' | 'high' | 'urgent';

  @ApiProperty({ description: '알림 메타데이터', required: false })
  @Column({ type: 'jsonb', default: {} })
  meta: Record<string, any>;

  @ApiProperty({ description: '읽은 시간', required: false })
  @Column({ type: 'timestamptz', nullable: true })
  read_at: Date;

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
  get isUnread(): boolean {
    return this.status === 'unread';
  }

  get isRead(): boolean {
    return this.status === 'read';
  }

  get isDismissed(): boolean {
    return this.status === 'dismissed';
  }

  get isUrgent(): boolean {
    return this.priority === 'urgent';
  }

  // 메서드
  markAsRead(): void {
    this.status = 'read';
    this.read_at = new Date();
    this.updated_at = new Date();
  }

  dismiss(): void {
    this.status = 'dismissed';
    this.updated_at = new Date();
  }
}
