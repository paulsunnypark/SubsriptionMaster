import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AlertsService } from './alerts.service';
import { Alert } from './entities/alert.entity';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('alerts')
@Controller('alerts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  @ApiOperation({ summary: '사용자의 알림 목록 조회' })
  @ApiQuery({ name: 'status', required: false, description: '알림 상태 필터', enum: ['unread', 'read', 'dismissed'] })
  @ApiResponse({ status: 200, description: '알림 목록을 반환합니다.', type: [Alert] })
  async getUserAlerts(
    @Request() req,
    @Query('status') status?: string,
  ) {
    return await this.alertsService.getUserAlerts(req.user.id, status);
  }

  @Get('stats')
  @ApiOperation({ summary: '사용자의 알림 통계' })
  @ApiResponse({ status: 200, description: '알림 통계를 반환합니다.' })
  async getUserAlertStats(@Request() req) {
    return await this.alertsService.getUserAlertStats(req.user.id);
  }

  @Post(':id/read')
  @ApiOperation({ summary: '알림을 읽음으로 표시' })
  @ApiResponse({ status: 200, description: '알림이 읽음으로 표시되었습니다.', type: Alert })
  async markAsRead(
    @Param('id') id: string,
    @Request() req,
  ) {
    return await this.alertsService.markAsRead(id, req.user.id);
  }

  @Post(':id/dismiss')
  @ApiOperation({ summary: '알림 해제' })
  @ApiResponse({ status: 200, description: '알림이 해제되었습니다.', type: Alert })
  async dismissAlert(
    @Param('id') id: string,
    @Request() req,
  ) {
    return await this.alertsService.dismissAlert(id, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: '알림 삭제' })
  @ApiResponse({ status: 200, description: '알림이 삭제되었습니다.' })
  async deleteAlert(
    @Param('id') id: string,
    @Request() req,
  ) {
    await this.alertsService.deleteAlert(id, req.user.id);
    return { message: '알림이 삭제되었습니다.' };
  }

  @Post('subscription-check')
  @ApiOperation({ summary: '구독 관련 알림 생성 (수동 실행)' })
  @ApiResponse({ status: 200, description: '구독 관련 알림이 생성되었습니다.' })
  async createSubscriptionAlerts(@Request() req) {
    await this.alertsService.createSubscriptionAlerts(req.user.id);
    return { message: '구독 관련 알림이 생성되었습니다.' };
  }
}
