import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('normalization_rules')
@Index(['canonical_name'])
@Index(['category'])
export class NormalizationRule {
  @ApiProperty({ description: '규칙 고유 ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '정규화된 머천트명', example: 'Netflix' })
  @Column({ nullable: true })
  canonical_name: string;

  @ApiProperty({ description: '동의어 목록', example: ['NETFLIX.COM', 'NETFLIX*'] })
  @Column('text', { array: true })
  synonyms: string[];

  @ApiProperty({ description: '머천트 카테고리', example: 'OTT' })
  @Column({ nullable: true })
  category: string;

  @ApiProperty({ description: '해지 URL', example: 'https://www.netflix.com/cancelplan' })
  @Column({ nullable: true })
  cancel_url: string;

  @ApiProperty({ description: '웹사이트 URL', required: false })
  @Column({ nullable: true })
  website: string;

  @ApiProperty({ description: '규칙 버전', example: '1.0.0' })
  @Column({ default: '1.0.0' })
  ruleset_version: string;

  @ApiProperty({ description: '규칙 활성화 상태', default: true })
  @Column({ default: true })
  is_active: boolean;

  @ApiProperty({ description: '우선순위', example: 1, default: 1 })
  @Column({ default: 1 })
  priority: number;

  @ApiProperty({ description: '생성일' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: '수정일' })
  @UpdateDateColumn()
  updated_at: Date;

  // 메서드
  hasSynonym(synonym: string): boolean {
    return this.synonyms.some(s => 
      s.toLowerCase() === synonym.toLowerCase() ||
      s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() === 
      synonym.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
    );
  }

  addSynonym(synonym: string): void {
    if (!this.hasSynonym(synonym)) {
      this.synonyms.push(synonym);
    }
  }

  removeSynonym(synonym: string): void {
    this.synonyms = this.synonyms.filter(s => s !== synonym);
  }
}
