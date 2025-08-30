import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

// 엔티티들을 명시적으로 import
import { User } from '@/modules/users/entities/user.entity';
import { AuthSession } from '@/modules/auth/entities/auth.entity';
import { Merchant } from '@/modules/merchants/entities/merchant.entity';
import { NormalizationRule } from '@/modules/merchants/entities/normalization-rule.entity';
import { Subscription } from '@/modules/subscriptions/entities/subscription.entity';
import { Transaction } from '@/modules/ingest/entities/transaction.entity';
import { Alert } from '@/modules/alerts/entities/alert.entity';
import { Saving } from '@/modules/savings/entities/saving.entity';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get('DATABASE_HOST', 'localhost'),
      port: this.configService.get('DATABASE_PORT', 5432),
      username: this.configService.get('DATABASE_USER', 'postgres'),
      password: this.configService.get('DATABASE_PASSWORD', 'postgres'),
      database: this.configService.get('DATABASE_NAME', 'subscriptionmaster'),
      entities: [
        User,
        AuthSession,
        Merchant,
        NormalizationRule,
        Subscription,
        Transaction,
        Alert,
        Saving,
      ],
      migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
      synchronize: this.configService.get('NODE_ENV') === 'development',
      logging: this.configService.get('NODE_ENV') === 'development',
      ssl: this.configService.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
      autoLoadEntities: false,
      keepConnectionAlive: true,
    };
  }
}
