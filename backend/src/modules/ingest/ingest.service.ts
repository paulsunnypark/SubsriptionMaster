import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { MerchantsService } from '@/modules/merchants/merchants.service';
import { SubscriptionsService } from '@/modules/subscriptions/subscriptions.service';
import * as csv from 'csv-parser';
import { Readable } from 'stream';

@Injectable()
export class IngestService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly merchantsService: MerchantsService,
    private readonly subscriptionsService: SubscriptionsService,
  ) {}

  // CSV 파일 처리
  async processCsvFile(
    file: Express.Multer.File,
    userId: string,
    sourceType: string,
  ): Promise<{ processed: number; errors: number }> {
    if (!file || !file.buffer) {
      throw new BadRequestException('파일이 제공되지 않았습니다.');
    }

    const results: any[] = [];
    const stream = Readable.from(file.buffer.toString());

    return new Promise((resolve, reject) => {
      stream
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          try {
            const result = await this.processCsvData(results, userId, sourceType);
            resolve(result);
          } catch (error) {
            reject(error);
          }
        })
        .on('error', reject);
    });
  }

  // CSV 데이터 처리
  private async processCsvData(
    data: any[],
    userId: string,
    sourceType: string,
  ): Promise<{ processed: number; errors: number }> {
    let processed = 0;
    let errors = 0;

    for (const row of data) {
      try {
        const transaction = await this.createTransactionFromRow(row, userId, sourceType);
        if (transaction) {
          await this.transactionRepository.save(transaction);
          processed++;
        }
      } catch (error) {
        console.error(`Row processing error:`, error);
        errors++;
      }
    }

    return { processed, errors };
  }

  // CSV 행에서 거래 생성
  private async createTransactionFromRow(
    row: any,
    userId: string,
    sourceType: string,
  ): Promise<Transaction | null> {
    try {
      // 데이터 검증
      const amount = this.parseAmount(row.amount || row.Amount || row.AMOUNT);
      const merchantName = row.merchant || row.Merchant || row.MERCHANT || row.description || row.Description;
      const date = this.parseDate(row.date || row.Date || row.DATE);

      if (!amount || !merchantName || !date) {
        return null;
      }

      // 머천트 찾기 또는 생성
      const merchant = await this.merchantsService.findOrCreateByNormalization(merchantName);

      // 거래 생성
      const transaction = this.transactionRepository.create({
        user_id: userId,
        merchant_id: merchant.id,
        amount,
        currency: 'KRW',
        status: 'completed',
        transaction_date: date,
        description: merchantName,
        meta: {
          sourceType,
          originalData: row,
        },
      } as Partial<Transaction>);

      return transaction;
    } catch (error) {
      console.error(`Transaction creation error:`, error);
      return null;
    }
  }

  // 금액 파싱
  private parseAmount(amountStr: string): number | null {
    if (!amountStr) return null;
    
    const cleaned = amountStr.toString().replace(/[^\d.-]/g, '');
    const amount = parseFloat(cleaned);
    
    return isNaN(amount) ? null : Math.abs(amount);
  }

  // 날짜 파싱
  private parseDate(dateStr: string): Date | null {
    if (!dateStr) return null;
    
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  }

  // 이메일 파싱 (향후 구현)
  async processEmail(emailContent: string, userId: string): Promise<any> {
    // 이메일 내용에서 구독 정보 추출
    // 정규식 패턴 매칭으로 머천트명, 금액, 날짜 등 추출
    // 향후 구현 예정
    throw new Error('이메일 파싱 기능은 향후 구현 예정입니다.');
  }

  // 거래 내역 조회
  async getUserTransactions(userId: string, limit: number = 50): Promise<Transaction[]> {
    return await this.transactionRepository.find({
      where: { user_id: userId },
      relations: ['merchant'],
      order: { transaction_date: 'DESC' },
      take: limit,
    });
  }

  // 거래 통계
  async getUserTransactionStats(userId: string): Promise<any> {
    const transactions = await this.transactionRepository.find({
      where: { user_id: userId, status: 'completed' },
      relations: ['merchant'],
    });

    const totalAmount = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
    const merchantCount = new Set(transactions.map(t => t.merchant_id)).size;
    const monthlySpending = this.calculateMonthlySpending(transactions);

    return {
      totalTransactions: transactions.length,
      totalAmount,
      merchantCount,
      monthlySpending,
      averageTransactionAmount: transactions.length > 0 ? totalAmount / transactions.length : 0,
    };
  }

  // 월별 지출 계산
  private calculateMonthlySpending(transactions: Transaction[]): any[] {
    const monthlyData = new Map<string, number>();
    
    transactions.forEach(t => {
      const month = t.transaction_date.toISOString().slice(0, 7); // YYYY-MM
      monthlyData.set(month, (monthlyData.get(month) || 0) + (t.amount || 0));
    });

    return Array.from(monthlyData.entries()).map(([month, amount]) => ({
      month,
      amount,
    })).sort((a, b) => a.month.localeCompare(b.month));
  }
}
