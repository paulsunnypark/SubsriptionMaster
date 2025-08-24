import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('app')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: '애플리케이션 상태 확인' })
  @ApiResponse({ status: 200, description: '애플리케이션이 정상적으로 실행 중입니다.' })
  getHello(): string {
    return 'SubscriptionMaster Backend is running!';
  }

  @Get('health')
  @ApiOperation({ summary: '기본 헬스체크' })
  @ApiResponse({ status: 200, description: '서버가 정상적으로 실행 중입니다.' })
  getHealth(): { status: string; timestamp: string } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
