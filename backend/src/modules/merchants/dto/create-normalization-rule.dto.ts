import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional, IsUrl, IsBoolean, IsNumber, Min, Max } from 'class-validator';

export class CreateNormalizationRuleDto {
  @ApiProperty({ description: '정규화된 머천트명', example: 'Netflix' })
  @IsString()
  canonical_name: string;

  @ApiProperty({ description: '동의어 목록', example: ['NETFLIX.COM', 'NETFLIX*'] })
  @IsArray()
  @IsString({ each: true })
  synonyms: string[];

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

  @ApiProperty({ description: '규칙 버전', example: '1.0.0', default: '1.0.0' })
  @IsString()
  @IsOptional()
  ruleset_version?: string;

  @ApiProperty({ description: '규칙 활성화 상태', default: true })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiProperty({ description: '우선순위', example: 1, default: 1, minimum: 1, maximum: 10 })
  @IsNumber()
  @Min(1)
  @Max(10)
  @IsOptional()
  priority?: number;
}
