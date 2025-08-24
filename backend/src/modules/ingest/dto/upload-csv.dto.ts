import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';

export class UploadCsvDto {
  @ApiProperty({ description: 'CSV 파일', type: 'string', format: 'binary' })
  file: Express.Multer.File;

  @ApiProperty({ description: '데이터 소스 타입', example: 'bank_statement', enum: ['bank_statement', 'credit_card', 'subscription_service'] })
  @IsEnum(['bank_statement', 'credit_card', 'subscription_service'])
  sourceType: 'bank_statement' | 'credit_card' | 'subscription_service';

  @ApiProperty({ description: '처리 옵션', required: false })
  @IsOptional()
  @IsString()
  options?: string;
}
