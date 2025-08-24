import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: '시스템 헬스체크' })
  @ApiResponse({ status: 200, description: '시스템 상태를 반환합니다.' })
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
    ]);
  }
}
