import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, IsBoolean, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: '사용자 이메일', example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: '사용자 비밀번호', example: 'password123', minLength: 8 })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({ description: '사용자 이름', example: '홍길동' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: '프로필 이미지 URL', required: false })
  @IsString()
  @IsOptional()
  avatar_url?: string;

  @ApiProperty({ description: '사용자 시간대', example: 'Asia/Seoul', default: 'UTC' })
  @IsString()
  @IsOptional()
  timezone?: string;

  @ApiProperty({ description: '사용자 설정', required: false })
  @IsOptional()
  preferences?: Record<string, any>;

  @ApiProperty({ description: '계정 활성화 상태', default: true })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
