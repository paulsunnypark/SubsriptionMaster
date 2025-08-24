import {
  Controller,
  Post,
  Get,
  UseInterceptors,
  UploadedFile,
  Body,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { IngestService } from './ingest.service';
import { UploadCsvDto } from './dto/upload-csv.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('ingest')
@Controller('ingest')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class IngestController {
  constructor(private readonly ingestService: IngestService) {}

  @Post('upload/csv')
  @ApiOperation({ summary: 'CSV 파일 업로드 및 처리' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'CSV 파일',
        },
        sourceType: {
          type: 'string',
          enum: ['bank_statement', 'credit_card', 'subscription_service'],
          description: '데이터 소스 타입',
        },
        options: {
          type: 'string',
          description: '처리 옵션 (JSON 문자열)',
        },
      },
      required: ['file', 'sourceType'],
    },
  })
  @ApiResponse({ status: 201, description: 'CSV 파일이 성공적으로 처리되었습니다.' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadCsv(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadCsvDto: UploadCsvDto,
    @Request() req,
  ) {
    const result = await this.ingestService.processCsvFile(
      file,
      req.user.id,
      uploadCsvDto.sourceType,
    );

    return {
      message: 'CSV 파일이 성공적으로 처리되었습니다.',
      result,
    };
  }

  @Get('transactions')
  @ApiOperation({ summary: '사용자의 거래 내역 조회' })
  @ApiResponse({ status: 200, description: '거래 내역을 반환합니다.' })
  async getUserTransactions(
    @Request() req,
    @Query('limit') limit: number = 50,
  ) {
    return await this.ingestService.getUserTransactions(req.user.id, limit);
  }

  @Get('transactions/stats')
  @ApiOperation({ summary: '사용자의 거래 통계' })
  @ApiResponse({ status: 200, description: '거래 통계를 반환합니다.' })
  async getUserTransactionStats(@Request() req) {
    return await this.ingestService.getUserTransactionStats(req.user.id);
  }

  @Post('email')
  @ApiOperation({ summary: '이메일 내용 파싱 (향후 구현)' })
  @ApiResponse({ status: 501, description: '이 기능은 향후 구현 예정입니다.' })
  async processEmail(@Body() body: { content: string }, @Request() req) {
    return await this.ingestService.processEmail(body.content, req.user.id);
  }
}
