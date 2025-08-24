import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { Subscription } from './entities/subscription.entity';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('subscriptions')
@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  // 기본 CRUD 엔드포인트
  @Post()
  @ApiOperation({ summary: '구독 생성' })
  @ApiResponse({ status: 201, description: '구독이 성공적으로 생성되었습니다.', type: Subscription })
  @ApiResponse({ status: 409, description: '이미 활성화된 구독이 존재합니다.' })
  create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionsService.create(createSubscriptionDto);
  }

  @Get()
  @ApiOperation({ summary: '모든 구독 조회' })
  @ApiResponse({ status: 200, description: '구독 목록을 반환합니다.', type: [Subscription] })
  findAll() {
    return this.subscriptionsService.findAll();
  }

  @Get('my')
  @ApiOperation({ summary: '현재 사용자의 구독 조회' })
  @ApiResponse({ status: 200, description: '사용자의 구독 목록을 반환합니다.', type: [Subscription] })
  findMySubscriptions(@Request() req) {
    return this.subscriptionsService.findByUserId(req.user.id);
  }

  @Get('my/stats')
  @ApiOperation({ summary: '현재 사용자의 구독 통계' })
  @ApiResponse({ status: 200, description: '구독 통계를 반환합니다.' })
  getMySubscriptionStats(@Request() req) {
    return this.subscriptionsService.getUserSubscriptionStats(req.user.id);
  }

  @Get('my/forecast')
  @ApiOperation({ summary: '현재 사용자의 월별 구독 비용 예측' })
  @ApiQuery({ name: 'months', required: false, description: '예측할 월 수', type: Number })
  @ApiResponse({ status: 200, description: '월별 예측을 반환합니다.' })
  getMyMonthlyForecast(@Request() req, @Query('months') months: number = 12) {
    return this.subscriptionsService.getMonthlyForecast(req.user.id, months);
  }

  @Get('my/recommendations')
  @ApiOperation({ summary: '현재 사용자의 절감 추천' })
  @ApiResponse({ status: 200, description: '절감 추천을 반환합니다.' })
  getMySavingsRecommendations(@Request() req) {
    return this.subscriptionsService.getSavingsRecommendations(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: '구독 ID로 조회' })
  @ApiResponse({ status: 200, description: '구독 정보를 반환합니다.', type: Subscription })
  @ApiResponse({ status: 404, description: '구독을 찾을 수 없습니다.' })
  findOne(@Param('id') id: string) {
    return this.subscriptionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '구독 정보 수정' })
  @ApiResponse({ status: 200, description: '구독 정보가 성공적으로 수정되었습니다.', type: Subscription })
  @ApiResponse({ status: 404, description: '구독을 찾을 수 없습니다.' })
  update(@Param('id') id: string, @Body() updateSubscriptionDto: UpdateSubscriptionDto) {
    return this.subscriptionsService.update(id, updateSubscriptionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '구독 삭제' })
  @ApiResponse({ status: 200, description: '구독이 성공적으로 삭제되었습니다.' })
  @ApiResponse({ status: 404, description: '구독을 찾을 수 없습니다.' })
  remove(@Param('id') id: string) {
    return this.subscriptionsService.remove(id);
  }

  // 구독 상태 관리 엔드포인트
  @Post(':id/pause')
  @ApiOperation({ summary: '구독 일시중지' })
  @ApiResponse({ status: 200, description: '구독이 일시중지되었습니다.', type: Subscription })
  @ApiResponse({ status: 404, description: '구독을 찾을 수 없습니다.' })
  pause(@Param('id') id: string) {
    return this.subscriptionsService.pause(id);
  }

  @Post(':id/resume')
  @ApiOperation({ summary: '구독 재개' })
  @ApiResponse({ status: 200, description: '구독이 재개되었습니다.', type: Subscription })
  @ApiResponse({ status: 404, description: '구독을 찾을 수 없습니다.' })
  resume(@Param('id') id: string) {
    return this.subscriptionsService.resume(id);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: '구독 해지' })
  @ApiResponse({ status: 200, description: '구독이 해지되었습니다.', type: Subscription })
  @ApiResponse({ status: 404, description: '구독을 찾을 수 없습니다.' })
  cancel(@Param('id') id: string) {
    return this.subscriptionsService.cancel(id);
  }

  // 분석 및 탐지 엔드포인트
  @Get('my/duplicates')
  @ApiOperation({ summary: '현재 사용자의 중복 구독 탐지' })
  @ApiResponse({ status: 200, description: '중복 구독 목록을 반환합니다.', type: [Subscription] })
  detectMyDuplicates(@Request() req) {
    return this.subscriptionsService.detectDuplicates(req.user.id);
  }

  @Get('my/ghost')
  @ApiOperation({ summary: '현재 사용자의 유령 구독 탐지' })
  @ApiQuery({ name: 'days', required: false, description: '사용하지 않은 일수 임계값', type: Number })
  @ApiResponse({ status: 200, description: '유령 구독 목록을 반환합니다.', type: [Subscription] })
  detectMyGhostSubscriptions(@Request() req, @Query('days') days: number = 60) {
    return this.subscriptionsService.detectGhostSubscriptions(req.user.id, days);
  }

  @Get('my/expiring-trials')
  @ApiOperation({ summary: '현재 사용자의 트라이얼 종료 임박 구독' })
  @ApiQuery({ name: 'days', required: false, description: '종료 임박 일수', type: Number })
  @ApiResponse({ status: 200, description: '트라이얼 종료 임박 구독 목록을 반환합니다.', type: [Subscription] })
  findMyExpiringTrials(@Request() req, @Query('days') days: number = 7) {
    return this.subscriptionsService.findExpiringTrials(days);
  }

  @Get('my/price-increases')
  @ApiOperation({ summary: '현재 사용자의 가격 인상 탐지' })
  @ApiQuery({ name: 'percentage', required: false, description: '가격 인상 임계값 (%)', type: Number })
  @ApiResponse({ status: 200, description: '가격 인상 구독 목록을 반환합니다.' })
  detectMyPriceIncreases(@Request() req, @Query('percentage') percentage: number = 15) {
    return this.subscriptionsService.detectPriceIncreases(req.user.id, percentage);
  }

  // 관리자용 엔드포인트 (향후 권한 체크 추가)
  @Get('user/:userId')
  @ApiOperation({ summary: '특정 사용자의 구독 조회' })
  @ApiResponse({ status: 200, description: '사용자의 구독 목록을 반환합니다.', type: [Subscription] })
  findByUserId(@Param('userId') userId: string) {
    return this.subscriptionsService.findByUserId(userId);
  }

  @Get('merchant/:merchantId')
  @ApiOperation({ summary: '특정 머천트의 구독 조회' })
  @ApiResponse({ status: 200, description: '머천트의 구독 목록을 반환합니다.', type: [Subscription] })
  findByMerchantId(@Param('merchantId') merchantId: string) {
    return this.subscriptionsService.findByMerchantId(merchantId);
  }
}
