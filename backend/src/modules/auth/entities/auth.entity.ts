import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@/modules/users/entities/user.entity';

@Entity('auth_sessions')
export class AuthSession {
  @ApiProperty({ description: '세션 고유 ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '사용자 ID' })
  @Column()
  user_id: string;

  @ApiProperty({ description: 'JWT 토큰' })
  @Column({ unique: true })
  token: string;

  @ApiProperty({ description: '리프레시 토큰' })
  @Column({ unique: true, nullable: true })
  refresh_token: string;

  @ApiProperty({ description: 'IP 주소' })
  @Column({ nullable: true })
  ip_address: string;

  @ApiProperty({ description: '사용자 에이전트' })
  @Column({ nullable: true })
  user_agent: string;

  @ApiProperty({ description: '만료 시간' })
  @Column()
  expires_at: Date;

  @ApiProperty({ description: '마지막 활동 시간' })
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  last_activity_at: Date;

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

  // 메서드
  isExpired(): boolean {
    return new Date() > this.expires_at;
  }

  updateActivity(): void {
    this.last_activity_at = new Date();
  }
}
