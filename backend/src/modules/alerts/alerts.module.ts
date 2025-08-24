import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alert } from './entities/alert.entity';
import { AlertsController } from './alerts.controller';
import { AlertsService } from './alerts.service';
import { SubscriptionsModule } from '@/modules/subscriptions/subscriptions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Alert]),
    SubscriptionsModule,
  ],
  controllers: [AlertsController],
  providers: [AlertsService],
  exports: [AlertsService, TypeOrmModule],
})
export class AlertsModule {}
