import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';

// 설정
import { TypeOrmConfigService } from '@/config/typeorm.config';
import { AppController } from './app.controller';

// 공통 모듈
import { CommonModule } from '@/common/common.module';

// 기능 모듈
import { AuthModule } from '@/modules/auth/auth.module';
import { UsersModule } from '@/modules/users/users.module';
import { SubscriptionsModule } from '@/modules/subscriptions/subscriptions.module';
import { MerchantsModule } from '@/modules/merchants/merchants.module';
import { IngestModule } from '@/modules/ingest/ingest.module';
import { AlertsModule } from '@/modules/alerts/alerts.module';
import { SavingsModule } from '@/modules/savings/savings.module';
import { HealthModule } from '@/modules/health/health.module';

@Module({
  imports: [
    // 설정 모듈
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),

    // 데이터베이스 모듈
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      inject: [ConfigService],
    }),

    // Cache 모듈 (일시적으로 비활성화)
    // CacheModule.forRoot({
    //   isGlobal: true,
    //   store: redisStore,
    //   host: process.env.REDIS_HOST || 'localhost',
    //   port: parseInt(process.env.REDIS_PORT || '6379'),
    //   password: process.env.REDIS_PASSWORD,
    //   ttl: parseInt(process.env.REDIS_TTL || '3600'),
    // }),

    // 스케줄러 모듈
    ScheduleModule.forRoot(),

    // 레이트 리미터 모듈
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
          limit: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
        },
      ],
    }),

    // 헬스체크 모듈 (일시적으로 비활성화)
    // TerminusModule,

    // 공통 모듈
    CommonModule,

    // 기능 모듈
    AuthModule,
    UsersModule,
    SubscriptionsModule,
    MerchantsModule,
    IngestModule,
    AlertsModule,
    SavingsModule,
    // HealthModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
