import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { IngestController } from './ingest.controller';
import { IngestService } from './ingest.service';
import { MerchantsModule } from '@/modules/merchants/merchants.module';
import { SubscriptionsModule } from '@/modules/subscriptions/subscriptions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    MerchantsModule,
    SubscriptionsModule,
  ],
  controllers: [IngestController],
  providers: [IngestService],
  exports: [IngestService, TypeOrmModule],
})
export class IngestModule {}
