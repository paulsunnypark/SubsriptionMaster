import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { MerchantsService } from './merchants.service';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import { CreateNormalizationRuleDto } from './dto/create-normalization-rule.dto';
import { Merchant } from './entities/merchant.entity';
import { NormalizationRule } from './entities/normalization-rule.entity';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('merchants')
@Controller('merchants')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MerchantsController {
  constructor(private readonly merchantsService: MerchantsService) {}

  // 머천트 관련 엔드포인트
  @Post()
  @ApiOperation({ summary: '머천트 생성' })
  @ApiResponse({ status: 201, description: '머천트가 성공적으로 생성되었습니다.', type: Merchant })
  @ApiResponse({ status: 409, description: '이미 존재하는 머천트명입니다.' })
  createMerchant(@Body() createMerchantDto: CreateMerchantDto) {
    return this.merchantsService.createMerchant(createMerchantDto);
  }

  @Get()
  @ApiOperation({ summary: '모든 머천트 조회' })
  @ApiResponse({ status: 200, description: '머천트 목록을 반환합니다.', type: [Merchant] })
  @ApiQuery({ name: 'category', required: false, description: '카테고리별 필터링' })
  findAllMerchants(@Query('category') category?: string) {
    if (category) {
      // 카테고리별 필터링 로직 추가 예정
      return this.merchantsService.findAllMerchants();
    }
    return this.merchantsService.findAllMerchants();
  }

  @Get('stats')
  @ApiOperation({ summary: '머천트 통계 조회' })
  @ApiResponse({ status: 200, description: '머천트 통계를 반환합니다.' })
  getMerchantStats() {
    return this.merchantsService.getMerchantStats();
  }

  @Get(':id')
  @ApiOperation({ summary: '머천트 ID로 조회' })
  @ApiResponse({ status: 200, description: '머천트 정보를 반환합니다.', type: Merchant })
  @ApiResponse({ status: 404, description: '머천트를 찾을 수 없습니다.' })
  findMerchantById(@Param('id') id: string) {
    return this.merchantsService.findMerchantById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '머천트 정보 수정' })
  @ApiResponse({ status: 200, description: '머천트 정보가 성공적으로 수정되었습니다.', type: Merchant })
  @ApiResponse({ status: 404, description: '머천트를 찾을 수 없습니다.' })
  @ApiResponse({ status: 409, description: '이미 존재하는 머천트명입니다.' })
  updateMerchant(@Param('id') id: string, @Body() updateMerchantDto: UpdateMerchantDto) {
    return this.merchantsService.updateMerchant(id, updateMerchantDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '머천트 삭제' })
  @ApiResponse({ status: 200, description: '머천트가 성공적으로 삭제되었습니다.' })
  @ApiResponse({ status: 404, description: '머천트를 찾을 수 없습니다.' })
  removeMerchant(@Param('id') id: string) {
    return this.merchantsService.removeMerchant(id);
  }

  // 정규화 규칙 관련 엔드포인트
  @Post('normalization-rules')
  @ApiOperation({ summary: '정규화 규칙 생성' })
  @ApiResponse({ status: 201, description: '정규화 규칙이 성공적으로 생성되었습니다.', type: NormalizationRule })
  createNormalizationRule(@Body() createRuleDto: CreateNormalizationRuleDto) {
    return this.merchantsService.createNormalizationRule(createRuleDto);
  }

  @Get('normalization-rules')
  @ApiOperation({ summary: '모든 정규화 규칙 조회' })
  @ApiResponse({ status: 200, description: '정규화 규칙 목록을 반환합니다.', type: [NormalizationRule] })
  findAllNormalizationRules() {
    return this.merchantsService.findAllNormalizationRules();
  }

  @Get('normalization-rules/:id')
  @ApiOperation({ summary: '정규화 규칙 ID로 조회' })
  @ApiResponse({ status: 200, description: '정규화 규칙을 반환합니다.', type: NormalizationRule })
  @ApiResponse({ status: 404, description: '정규화 규칙을 찾을 수 없습니다.' })
  findNormalizationRuleById(@Param('id') id: string) {
    return this.merchantsService.findNormalizationRuleById(id);
  }

  @Patch('normalization-rules/:id')
  @ApiOperation({ summary: '정규화 규칙 수정' })
  @ApiResponse({ status: 200, description: '정규화 규칙이 성공적으로 수정되었습니다.', type: NormalizationRule })
  @ApiResponse({ status: 404, description: '정규화 규칙을 찾을 수 없습니다.' })
  updateNormalizationRule(@Param('id') id: string, @Body() updateRuleDto: any) {
    return this.merchantsService.updateNormalizationRule(id, updateRuleDto);
  }

  @Delete('normalization-rules/:id')
  @ApiOperation({ summary: '정규화 규칙 삭제' })
  @ApiResponse({ status: 200, description: '정규화 규칙이 성공적으로 삭제되었습니다.' })
  @ApiResponse({ status: 404, description: '정규화 규칙을 찾을 수 없습니다.' })
  removeNormalizationRule(@Param('id') id: string) {
    return this.merchantsService.removeNormalizationRule(id);
  }

  // 정규화 테스트 엔드포인트
  @Post('normalize')
  @ApiOperation({ summary: '머천트명 정규화 테스트' })
  @ApiResponse({ status: 200, description: '정규화 결과를 반환합니다.' })
  async normalizeMerchantName(@Body() body: { name: string }) {
    const result = await this.merchantsService.normalizeMerchantName(body.name);
    return result;
  }

  @Post('find-or-create')
  @ApiOperation({ summary: '머천트 찾기 또는 생성' })
  @ApiResponse({ status: 200, description: '머천트를 찾거나 생성하여 반환합니다.', type: Merchant })
  async findOrCreateMerchant(@Body() body: { name: string }) {
    return await this.merchantsService.findOrCreateMerchant(body.name);
  }
}
