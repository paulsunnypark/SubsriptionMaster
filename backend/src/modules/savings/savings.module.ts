import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Saving } from './entities/saving.entity';
import { SavingsController } from './savings.controller';
import { SavingsService } from './savings.service';
import { SubscriptionsModule } from '@/modules/subscriptions/subscriptions.module';
import { AlertsModule } from '@/modules/alerts/alerts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Saving]),
    SubscriptionsModule,
    AlertsModule,
  ],
  controllers: [SavingsController],
  providers: [SavingsService],
  exports: [SavingsService, TypeOrmModule],
})
export class SavingsModule {}
