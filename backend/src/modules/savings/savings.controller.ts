import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SavingsService } from './savings.service';
import { Saving } from './entities/saving.entity';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('savings')
@Controller('savings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SavingsController {
  constructor(private readonly savingsService: SavingsService) {}

  @Get()
  @ApiOperation({ summary: '사용자의 절감 이벤트 목록 조회' })
  @ApiQuery({ name: 'activeOnly', required: false, description: '활성 절감만 조회', type: Boolean })
  @ApiResponse({ status: 200, description: '절감 이벤트 목록을 반환합니다.', type: [Saving] })
  async getUserSavings(
    @Request() req,
    @Query('activeOnly') activeOnly: boolean = true,
  ) {
    return await this.savingsService.getUserSavings(req.user.id, activeOnly);
  }

  @Get('stats')
  @ApiOperation({ summary: '사용자의 절감 통계' })
  @ApiResponse({ status: 200, description: '절감 통계를 반환합니다.' })
  async getUserSavingsStats(@Request() req) {
    return await this.savingsService.getUserSavingsStats(req.user.id);
  }

  @Get('achievement')
  @ApiOperation({ summary: '사용자의 절감 달성률' })
  @ApiResponse({ status: 200, description: '절감 달성률을 반환합니다.' })
  async getSavingsAchievement(@Request() req) {
    return await this.savingsService.calculateSavingsAchievement(req.user.id);
  }

  @Post()
  @ApiOperation({ summary: '절감 이벤트 생성' })
  @ApiResponse({ status: 201, description: '절감 이벤트가 성공적으로 생성되었습니다.', type: Saving })
  async createSaving(
    @Body() createSavingDto: {
      type: string;
      title: string;
      description: string;
      amount: number;
      frequency: string;
      startDate: string;
      endDate?: string;
      meta?: Record<string, any>;
    },
    @Request() req,
  ) {
    return await this.savingsService.createSaving(
      req.user.id,
      createSavingDto.type,
      createSavingDto.title,
      createSavingDto.description,
      createSavingDto.amount,
      createSavingDto.frequency,
      new Date(createSavingDto.startDate),
      createSavingDto.endDate ? new Date(createSavingDto.endDate) : undefined,
      createSavingDto.meta,
    );
  }

  @Put(':id')
  @ApiOperation({ summary: '절감 이벤트 수정' })
  @ApiResponse({ status: 200, description: '절감 이벤트가 성공적으로 수정되었습니다.', type: Saving })
  async updateSaving(
    @Param('id') id: string,
    @Body() updateSavingDto: Partial<Saving>,
    @Request() req,
  ) {
    return await this.savingsService.updateSaving(id, req.user.id, updateSavingDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '절감 이벤트 삭제' })
  @ApiResponse({ status: 200, description: '절감 이벤트가 성공적으로 삭제되었습니다.' })
  async deleteSaving(
    @Param('id') id: string,
    @Request() req,
  ) {
    await this.savingsService.deleteSaving(id, req.user.id);
    return { message: '절감 이벤트가 삭제되었습니다.' };
  }

  @Post('auto-generate')
  @ApiOperation({ summary: '자동 절감 이벤트 생성' })
  @ApiResponse({ status: 200, description: '자동 절감 이벤트가 생성되었습니다.' })
  async generateAutomaticSavings(@Request() req) {
    await this.savingsService.createAutomaticSavings(req.user.id);
    return { message: '자동 절감 이벤트가 생성되었습니다.' };
  }

  @Post('goals')
  @ApiOperation({ summary: '절감 목표 설정' })
  @ApiResponse({ status: 200, description: '절감 목표가 설정되었습니다.' })
  async setSavingsGoal(
    @Body() goalDto: { monthlyGoal: number; yearlyGoal: number },
    @Request() req,
  ) {
    await this.savingsService.setSavingsGoal(
      req.user.id,
      goalDto.monthlyGoal,
      goalDto.yearlyGoal,
    );
    return { message: '절감 목표가 설정되었습니다.' };
  }
}
