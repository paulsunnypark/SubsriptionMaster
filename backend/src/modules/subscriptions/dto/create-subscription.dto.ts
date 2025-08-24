import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsNumber, IsDateString, IsBoolean, IsUUID } from 'class-validator';

export class CreateSubscriptionDto {
  @ApiProperty({ description: '사용자 ID' })
  @IsUUID()
  user_id: string;

  @ApiProperty({ description: '머천트 ID' })
  @IsUUID()
  merchant_id: string;

  @ApiProperty({ description: '구독 플랜명', example: 'Premium Plan', required: false })
  @IsString()
  @IsOptional()
  plan?: string;

  @ApiProperty({ description: '결제 주기', example: 'monthly', enum: ['monthly', 'yearly', 'trial'] })
  @IsEnum(['monthly', 'yearly', 'trial'])
  cycle: 'monthly' | 'yearly' | 'trial';

  @ApiProperty({ description: '다음 결제일', required: false })
  @IsDateString()
  @IsOptional()
  next_bill_at?: string;

  @ApiProperty({ description: '구독 가격', example: 15000, required: false })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({ description: '통화', example: 'KRW', default: 'KRW' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({ description: '구독 시작일', required: false })
  @IsDateString()
  @IsOptional()
  started_at?: string;

  @ApiProperty({ description: '자동 갱신 여부', default: true })
  @IsBoolean()
  @IsOptional()
  auto_renew?: boolean;

  @ApiProperty({ description: '구독 메타데이터', required: false })
  @IsOptional()
  meta?: Record<string, any>;
}
