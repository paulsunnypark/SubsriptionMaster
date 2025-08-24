import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl } from 'class-validator';

export class CreateMerchantDto {
  @ApiProperty({ description: '정규화된 머천트명', example: 'Netflix' })
  @IsString()
  name_norm: string;

  @ApiProperty({ description: '원본 머천트명', example: 'NETFLIX.COM', required: false })
  @IsString()
  @IsOptional()
  name_original?: string;

  @ApiProperty({ description: '머천트 카테고리', example: 'OTT', required: false })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({ description: '해지 URL', example: 'https://www.netflix.com/cancelplan', required: false })
  @IsUrl()
  @IsOptional()
  cancel_url?: string;

  @ApiProperty({ description: '웹사이트 URL', required: false })
  @IsUrl()
  @IsOptional()
  website?: string;

  @ApiProperty({ description: '로고 URL', required: false })
  @IsUrl()
  @IsOptional()
  logo_url?: string;

  @ApiProperty({ description: '규칙 버전', example: '1.0.0', default: '1.0.0' })
  @IsString()
  @IsOptional()
  ruleset_version?: string;
}
